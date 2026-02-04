"use client";

import { useEffect, useState } from "react";

const marketplaces = [
  {
    name: "eBay UK",
    focus: "Trending listings, sold count, price history",
  },
  {
    name: "Amazon UK",
    focus: "Category best sellers, reviews, buy box pricing",
  },
  {
    name: "OnBuy",
    focus: "UK-only discovery, seller reliability signals",
  },
  {
    name: "Etsy UK",
    focus: "Niche demand, personalization, top-rated sellers",
  },
];

const featureCards = [
  {
    title: "Winning product discovery",
    description:
      "Multi-tab Playwright scraping across UK marketplaces to capture price, stock, seller, and trend data in one pass.",
  },
  {
    title: "SEO-ready content",
    description:
      "Optional OpenAI layer generates SEO titles, bullet descriptions, and meta snippets tailored for eBay UK listings.",
  },
  {
    title: "Profit intelligence",
    description:
      "Built-in profit calculator with fees, supplier cost, and a sales potential score based on ratings + sold count.",
  },
  {
    title: "Supplier sourcing",
    description:
      "Attach supplier/source links, delivery windows, and reliability checks to each product candidate.",
  },
];

const stack = [
  {
    name: "Node.js + Playwright",
    reason: "Scrape multiple tabs, rotate UA, and apply UK filters safely.",
  },
  {
    name: "SQLite",
    reason: "Fast local database for product snapshots and scoring history.",
  },
  {
    name: "OpenAI API (optional)",
    reason: "Generate SEO titles, descriptions, and meta copy instantly.",
  },
  {
    name: "CSV / Excel export",
    reason: "One-click output for eBay UK upload templates.",
  },
];

const flowSteps = [
  {
    title: "Collect",
    detail:
      "Scrape listings with filters for UK-only shipping, in-stock, and top-rated sellers.",
  },
  {
    title: "Analyze",
    detail:
      "Calculate profit, score sales potential, and flag risky suppliers.",
  },
  {
    title: "Enhance",
    detail:
      "Generate SEO titles + descriptions with AI (or keep manual mode).",
  },
  {
    title: "Export",
    detail:
      "Deliver 2–5 winning products to CSV with ready-to-list fields.",
  },
];

const tableRows = [
  {
    title: "Portable 3-in-1 Blender",
    description: "USB rechargeable, UK plug, 6-blade, travel safe",
    supplier: "AliExpress UK Warehouse",
    price: "£24.99",
    profit: "£7.10",
    score: "8.6",
    rating: "4.7 (1.2k)",
  },
  {
    title: "Heated Neck Wrap",
    description: "Microwave heat therapy, washable cover, 3 sizes",
    supplier: "DHgate UK Stock",
    price: "£19.50",
    profit: "£6.20",
    score: "8.1",
    rating: "4.6 (860)",
  },
  {
    title: "LED Wardrobe Sensor",
    description: "Motion sensor strip, USB-C, easy install",
    supplier: "Banggood UK",
    price: "£14.99",
    profit: "£5.05",
    score: "7.8",
    rating: "4.5 (540)",
  },
];

const initialProgress = {
  status: "idle",
  progressPercent: 0,
  remainingTime: "--",
  currentAction: "Idle",
};

export default function Home() {
  const [progress, setProgress] = useState(initialProgress);

  useEffect(() => {
    let isMounted = true;

    const fetchProgress = async () => {
      try {
        const response = await fetch("/api/progress", { cache: "no-store" });
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (isMounted) {
          setProgress(data);
        }
      } catch (error) {
        if (isMounted) {
          setProgress((current) => ({ ...current, status: "failed" }));
        }
      }
    };

    fetchProgress();
    const interval = setInterval(fetchProgress, 2500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_55%)]"></div>
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl"></div>
        <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-lg font-semibold text-cyan-100">
              UK
            </span>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/70">
                Local Dropshipping Suite
              </p>
              <h1 className="text-xl font-semibold">UK Product Finder</h1>
            </div>
          </div>
          <button className="rounded-full border border-cyan-300/30 px-4 py-2 text-sm text-cyan-100 transition hover:border-cyan-300/70">
            Run new scan
          </button>
        </header>

        <section className="relative mx-auto grid w-full max-w-6xl gap-10 px-6 pb-20 pt-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cyan-200">
              Fully advanced product finder
            </div>
            <h2 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Build winning UK dropshipping offers in a single local run.
            </h2>
            <p className="text-lg text-slate-300">
              Scrape UK marketplaces, analyze profitability, and generate SEO-ready listings. Keep everything on your
              local PC with safe SQLite storage and CSV exports.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950">
                Start 1-click run
              </button>
              <button className="rounded-lg border border-slate-700 px-5 py-3 text-sm text-slate-200">
                Preview CSV output
              </button>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">
                    Live scan status
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    Status {progress.status} · Remaining {progress.remainingTime}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Current action: {progress.currentAction}
                  </p>
                </div>
                <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                  {progress.progressPercent}% complete
                </span>
              </div>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                  style={{ width: `${progress.progressPercent}%` }}
                ></div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {marketplaces.map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
                >
                  <p className="text-sm font-semibold text-cyan-200">{item.name}</p>
                  <p className="mt-2 text-sm text-slate-400">{item.focus}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-[0_0_60px_rgba(56,189,248,0.15)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">Session summary</p>
                <h3 className="text-2xl font-semibold">Winning products shortlist</h3>
              </div>
              <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-xs text-cyan-100">2-5 results</span>
            </div>
            <div className="space-y-4">
              {tableRows.map((row) => (
                <div
                  key={row.title}
                  className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{row.title}</p>
                      <p className="mt-1 text-xs text-slate-400">{row.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-cyan-200">{row.profit} profit</p>
                      <p className="text-xs text-slate-400">Score {row.score}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span>Supplier: {row.supplier}</span>
                    <span>Price: {row.price}</span>
                    <span>Rating: {row.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="mx-auto w-full max-w-6xl space-y-12 px-6 py-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <h3 className="text-3xl font-semibold">Core capabilities</h3>
            <p className="mt-3 text-slate-400">
              Every run blends scraping, analysis, and AI generation (optional) to deliver a shortlist of high-margin
              UK products with supplier links and listing-ready copy.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {featureCards.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
              >
                <h4 className="text-lg font-semibold text-white">{feature.title}</h4>
                <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-2xl font-semibold">Proposed stack</h3>
            <p className="mt-2 text-sm text-slate-400">
              All components are local-first and built for long-running sessions.
            </p>
            <div className="mt-6 space-y-4">
              {stack.map((item) => (
                <div key={item.name} className="rounded-xl border border-slate-800 p-4">
                  <p className="text-sm font-semibold text-cyan-200">{item.name}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6">
            <h3 className="text-2xl font-semibold">Automation flow</h3>
            <p className="mt-2 text-sm text-slate-400">
              One click → scrape, analyze, enrich, and export. AI can be toggled off if the OpenAI API is unavailable.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {flowSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">0{index + 1}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{step.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl space-y-6 px-6 pb-20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-3xl font-semibold">CSV output preview</h3>
            <p className="mt-2 text-sm text-slate-400">
              Ready-to-list fields: Title | Description | Supplier Link | Price | Profit | Sales Score | Rating.
            </p>
          </div>
          <button className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200">
            Export sample CSV
          </button>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="grid grid-cols-[2fr_2fr_1.6fr_1fr_1fr_1fr_1fr] gap-4 border-b border-slate-800 px-5 py-3 text-xs uppercase tracking-[0.3em] text-slate-400">
            <span>Title</span>
            <span>Description</span>
            <span>Supplier link</span>
            <span>Price</span>
            <span>Profit</span>
            <span>Score</span>
            <span>Rating</span>
          </div>
          {tableRows.map((row) => (
            <div
              key={row.title}
              className="grid grid-cols-[2fr_2fr_1.6fr_1fr_1fr_1fr_1fr] gap-4 border-b border-slate-800 px-5 py-4 text-sm text-slate-200"
            >
              <span className="font-semibold text-white">{row.title}</span>
              <span className="text-slate-400">{row.description}</span>
              <span className="text-cyan-200">{row.supplier}</span>
              <span>{row.price}</span>
              <span className="text-emerald-300">{row.profit}</span>
              <span>{row.score}</span>
              <span>{row.rating}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
