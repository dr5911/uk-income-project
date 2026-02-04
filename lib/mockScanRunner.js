import { EVENT_TYPES, getProgressManager } from "./progressManager";

const globalKey = "__ukProductFinderMockScan__";

const buildTasks = () => [
  { type: EVENT_TYPES.SCRAPING },
  { type: EVENT_TYPES.MARKETPLACE_STARTED, meta: { marketplace: "ebay_uk" } },
  { type: EVENT_TYPES.PAGE_STARTED, meta: { marketplace: "ebay_uk", page: 1 } },
  { type: EVENT_TYPES.PAGE_COMPLETED, meta: { marketplace: "ebay_uk", page: 1 } },
  { type: EVENT_TYPES.PRODUCT_SCRAPED, meta: { marketplace: "ebay_uk" } },
  { type: EVENT_TYPES.PRODUCT_ANALYZED, meta: { marketplace: "ebay_uk" } },
  { type: EVENT_TYPES.PRODUCT_SHORTLISTED, meta: { marketplace: "ebay_uk" } },
  { type: EVENT_TYPES.PAGE_STARTED, meta: { marketplace: "ebay_uk", page: 2 } },
  { type: EVENT_TYPES.PAGE_COMPLETED, meta: { marketplace: "ebay_uk", page: 2 } },
  { type: EVENT_TYPES.PRODUCT_SCRAPED, meta: { marketplace: "ebay_uk" } },
  { type: EVENT_TYPES.PRODUCT_ANALYZED, meta: { marketplace: "ebay_uk" } },
  { type: EVENT_TYPES.MARKETPLACE_STARTED, meta: { marketplace: "amazon_uk" } },
  { type: EVENT_TYPES.PAGE_STARTED, meta: { marketplace: "amazon_uk", page: 1 } },
  { type: EVENT_TYPES.PAGE_COMPLETED, meta: { marketplace: "amazon_uk", page: 1 } },
  { type: EVENT_TYPES.PRODUCT_SCRAPED, meta: { marketplace: "amazon_uk" } },
  { type: EVENT_TYPES.PRODUCT_ANALYZED, meta: { marketplace: "amazon_uk" } },
  { type: EVENT_TYPES.PRODUCT_SHORTLISTED, meta: { marketplace: "amazon_uk" } },
  { type: EVENT_TYPES.OUTPUT },
];

const ensureMockState = () => {
  if (!globalThis[globalKey]) {
    globalThis[globalKey] = {
      timer: null,
      tasks: [],
      index: 0,
    };
  }
  return globalThis[globalKey];
};

const runTask = (progressManager, task) => {
  if (task.type === EVENT_TYPES.PRODUCT_SHORTLISTED) {
    progressManager.recordShortlist(task.meta);
    return;
  }

  progressManager.taskCompleted({ type: task.type, meta: task.meta });
};

const startMockScan = () => {
  const progressManager = getProgressManager();
  const state = ensureMockState();

  if (progressManager.status === "running") {
    return progressManager.getSnapshot();
  }

  const tasks = buildTasks();
  state.tasks = tasks;
  state.index = 0;

  progressManager.startScan({ totalTasks: tasks.length, shortlistTarget: 3 });

  if (state.timer) {
    clearInterval(state.timer);
  }

  state.timer = setInterval(() => {
    if (progressManager.status !== "running") {
      clearInterval(state.timer);
      state.timer = null;
      return;
    }

    const task = state.tasks[state.index];
    if (!task) {
      progressManager.completeScan();
      clearInterval(state.timer);
      state.timer = null;
      progressManager.startCsvGeneration({ rows: 3 });
      progressManager.completeCsvGeneration({ rows: 3 });
      return;
    }

    runTask(progressManager, task);
    state.index += 1;
  }, 500);

  return progressManager.getSnapshot();
};

export { startMockScan };
