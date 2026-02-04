import { EventEmitter } from "events";

const EVENT_TYPES = {
  SCAN_STARTED: "SCAN_STARTED",
  SCAN_COMPLETED: "SCAN_COMPLETED",
  SCAN_FAILED: "SCAN_FAILED",
  SCRAPING: "SCRAPING",
  MARKETPLACE_STARTED: "MARKETPLACE_STARTED",
  PAGE_STARTED: "PAGE_STARTED",
  PAGE_COMPLETED: "PAGE_COMPLETED",
  PRODUCT_SCRAPED: "PRODUCT_SCRAPED",
  ANALYSIS: "ANALYSIS",
  PRODUCT_ANALYZED: "PRODUCT_ANALYZED",
  PRODUCT_REJECTED: "PRODUCT_REJECTED",
  PRODUCT_SHORTLISTED: "PRODUCT_SHORTLISTED",
  OUTPUT: "OUTPUT",
  CSV_GENERATION_STARTED: "CSV_GENERATION_STARTED",
  CSV_GENERATION_COMPLETED: "CSV_GENERATION_COMPLETED",
};

const formatRemaining = (remainingMs) => {
  if (!Number.isFinite(remainingMs) || remainingMs <= 0) {
    return "0 min";
  }

  const totalSeconds = Math.round(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) {
    return `${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
};

class ProgressManager extends EventEmitter {
  constructor() {
    super();
    this.reset();
  }

  reset() {
    this.startTime = null;
    this.totalTasks = 0;
    this.completedTasks = 0;
    this.status = "idle";
    this.currentPhase = "Idle";
    this.lastEvent = null;
    this.shortlistedCount = 0;
    this.shortlistTarget = 0;
  }

  startScan({ totalTasks = 0, shortlistTarget = 5 } = {}) {
    this.startTime = Date.now();
    this.totalTasks = totalTasks;
    this.completedTasks = 0;
    this.status = "running";
    this.currentPhase = "SCAN";
    this.shortlistedCount = 0;
    this.shortlistTarget = Math.min(Math.max(shortlistTarget, 2), 5);
    this.emitEvent(EVENT_TYPES.SCAN_STARTED, {});
  }

  failScan(error) {
    this.status = "failed";
    this.currentPhase = "SCAN";
    this.emitEvent(EVENT_TYPES.SCAN_FAILED, {
      error: error?.message ?? String(error ?? "Unknown error"),
    });
  }

  completeScan() {
    if (this.status === "completed") {
      return;
    }
    this.status = "completed";
    this.currentPhase = "OUTPUT";
    this.emitEvent(EVENT_TYPES.SCAN_COMPLETED, {});
  }

  emitEvent(type, meta) {
    const payload = {
      type,
      completedTasks: this.completedTasks,
      totalTasks: this.totalTasks,
      timestamp: Date.now(),
      meta: meta ?? {},
    };
    this.lastEvent = payload;
    this.emit("progress:update", payload);
  }

  taskCompleted({ type, meta } = {}) {
    if (this.status !== "running") {
      return;
    }
    this.completedTasks += 1;
    if (type) {
      this.currentPhase = type;
      this.emitEvent(type, meta);
    }
  }

  recordShortlist(meta) {
    if (this.status !== "running") {
      return;
    }
    this.shortlistedCount += 1;
    this.taskCompleted({ type: EVENT_TYPES.PRODUCT_SHORTLISTED, meta });
    if (this.shortlistedCount >= this.shortlistTarget) {
      this.completeScan();
    }
  }

  startCsvGeneration(meta) {
    if (this.status !== "completed") {
      throw new Error("CSV generation allowed only after scan completion.");
    }
    this.emitEvent(EVENT_TYPES.CSV_GENERATION_STARTED, meta);
  }

  completeCsvGeneration(meta) {
    if (this.status !== "completed") {
      throw new Error("CSV generation allowed only after scan completion.");
    }
    this.emitEvent(EVENT_TYPES.CSV_GENERATION_COMPLETED, meta);
  }

  getSnapshot() {
    const now = Date.now();
    const progressPercent = this.totalTasks
      ? Math.round((this.completedTasks / this.totalTasks) * 100)
      : 0;
    const avgTaskTime =
      this.completedTasks > 0 && this.startTime
        ? (now - this.startTime) / this.completedTasks
        : null;
    const remainingTime =
      avgTaskTime && this.totalTasks
        ? avgTaskTime * (this.totalTasks - this.completedTasks)
        : null;

    return {
      status: this.status,
      progressPercent,
      remainingTime: formatRemaining(remainingTime),
      currentAction: this.lastEvent?.type ?? "Idle",
      currentPhase: this.currentPhase,
      lastEvent: this.lastEvent,
    };
  }
}

const globalKey = "__ukProductFinderProgressManager__";

const getProgressManager = () => {
  if (!globalThis[globalKey]) {
    globalThis[globalKey] = new ProgressManager();
  }
  return globalThis[globalKey];
};

export { EVENT_TYPES, getProgressManager };
