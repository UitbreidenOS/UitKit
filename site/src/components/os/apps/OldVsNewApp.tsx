import { useState } from "react";
import { Eyebrow, Card } from "./ui";

interface ComparisonCard {
  id: string;
  category: string;
  title: string;
  oldWay: {
    title: string;
    description: string;
    metrics: string;
    icon: string;
  };
  newWay: {
    title: string;
    description: string;
    metrics: string;
    icon: string;
  };
  timeSaved: string;
  impact: string;
}

const COMPARISONS: ComparisonCard[] = [
  {
    id: "swe",
    category: "Software Engineering",
    title: "Feature Development & Testing",
    oldWay: {
      title: "Manual Loop Writing",
      description: "Write code manually, run dev servers, click around in browser, check terminal logs, manually trigger git commit, check linting.",
      metrics: "Average 45 mins per loop iteration",
      icon: "🐌"
    },
    newWay: {
      title: "Agentic Loop Engineering",
      description: "Define desired feature state. AI agent spins up subagents, writes tests, verifies builds automatically, fixes lints, auto-commits on green.",
      metrics: "Completed in 45 seconds",
      icon: "⚡"
    },
    timeSaved: "98% faster iteration",
    impact: "Unbroken flow state"
  },
  {
    id: "seo",
    category: "Content & SEO",
    title: "SEO Optimization & Tracking",
    oldWay: {
      title: "Click-heavy Console Audits",
      description: "Log into Google Search Console, pull CSVs, run audit tools, cross-reference keyword rankings, draft meta updates manually in CMS.",
      metrics: "4 hours weekly",
      icon: "📋"
    },
    newWay: {
      title: "Autonomous Search Radar",
      description: "Self-running SEO Agent monitors indexing errors, writes SEO fixes, maps target keywords, updates JSON metadata via Git autonomously.",
      metrics: "Continuous (0 hours manual)",
      icon: "🎯"
    },
    timeSaved: "100% automated audits",
    impact: "Rankings increase in real-time"
  },
  {
    id: "leads",
    category: "Lead Gen & Sales",
    title: "Outbound Lead Gen Pipeline",
    oldWay: {
      title: "Manual Scraping & Drafting",
      description: "Find leads on LinkedIn, copy-paste email addresses into spreadsheets, draft personalized outreach templates one by one.",
      metrics: "60 mins per 10 leads",
      icon: "📨"
    },
    newWay: {
      title: "Autonomous Lead Harvester",
      description: "Lead pipelines query sources, qualify based on custom rulesets, generate hyper-tailored outreach copy with zero hallucination risk.",
      metrics: "12 seconds for 10 leads",
      icon: "🤖"
    },
    timeSaved: "99.8% process efficiency",
    impact: "More high-intent replies"
  },
  {
    id: "comp",
    category: "Computer Use",
    title: "Browser Takeovers & Integration",
    oldWay: {
      title: "Brute-force RPA Scripts",
      description: "Write fragile Selenium scripts or click coordinates that break anytime a button color changes or DOM updates.",
      metrics: "High maintenance cost",
      icon: "🧱"
    },
    newWay: {
      title: "Vision-based Computer Use",
      description: "AI reads the screen visually, hovers/clicks/types based on real-time visual feedback, and solves dynamic captchas autonomously.",
      metrics: "Flawless UI adaptability",
      icon: "👁️"
    },
    timeSaved: "Zero Selector Maintenance",
    impact: "Robust across any application"
  }
];

export function OldVsNewApp() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(COMPARISONS.map(c => c.category)))];

  const filteredComparisons = selectedCategory === "All"
    ? COMPARISONS
    : COMPARISONS.filter(c => c.category === selectedCategory);

  const handleLearnMore = (title: string) => {
    window.dispatchEvent(new CustomEvent("sidekick_status_change", {
      detail: {
        status: "working",
        message: `Analyzing differences for: ${title}`
      }
    }));
  };

  return (
    <div className="h-full flex flex-col p-5 overflow-y-auto space-y-4">
      {/* Header */}
      <div className="border-b border-hairline pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🔄</span>
          <div>
            <Eyebrow color="#ec4899">Paradigm Shift</Eyebrow>
            <h1 className="text-xl font-extrabold text-ink">Old Way vs. New Way</h1>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-bold border transition ${
                selectedCategory === cat
                  ? "bg-pink-50 border-pink-200 text-pink-600 shadow-sm"
                  : "bg-white border-hairline text-mute hover:bg-zinc-50 hover:text-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of comparisons */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredComparisons.map((c) => (
          <Card key={c.id} className="flex flex-col justify-between border-2 border-hairline hover:border-pink-200 transition-colors p-6 bg-zinc-50/50">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 border border-pink-100 px-2 py-0.5 rounded-full">
                  {c.category}
                </span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  ⏱️ {c.timeSaved}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-ink mb-4">{c.title}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Old Way */}
                <div className="bg-white border border-hairline rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-8 h-8 bg-zinc-100/50 flex items-center justify-center rounded-bl-xl text-[14px]">
                    {c.oldWay.icon}
                  </div>
                  <div>
                    <h4 className="text-[12px] font-bold text-zinc-400 uppercase tracking-wider mb-2">The Old Way</h4>
                    <h5 className="text-[13px] font-extrabold text-zinc-700 mb-1">{c.oldWay.title}</h5>
                    <p className="text-[12px] text-mute leading-relaxed mb-4">{c.oldWay.description}</p>
                  </div>
                  <div className="border-t border-hairline/60 pt-2.5 mt-auto">
                    <span className="text-[11px] text-zinc-400 font-bold block">Cost/Speed:</span>
                    <span className="text-[12px] text-zinc-600 font-bold">{c.oldWay.metrics}</span>
                  </div>
                </div>

                {/* New Way */}
                <div className="bg-gradient-to-br from-pink-50/10 via-white to-pink-50/20 border-2 border-pink-500/20 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group hover:border-pink-500/40 transition-colors">
                  <div className="absolute top-0 right-0 w-8 h-8 bg-pink-100/60 flex items-center justify-center rounded-bl-xl text-[14px]">
                    {c.newWay.icon}
                  </div>
                  <div>
                    <h4 className="text-[12px] font-bold text-pink-600 uppercase tracking-wider mb-2">The New Way</h4>
                    <h5 className="text-[13px] font-extrabold text-ink mb-1">{c.newWay.title}</h5>
                    <p className="text-[12px] text-zinc-600 leading-relaxed mb-4">{c.newWay.description}</p>
                  </div>
                  <div className="border-t border-pink-100 pt-2.5 mt-auto">
                    <span className="text-[11px] text-pink-600 font-bold block">Cost/Speed:</span>
                    <span className="text-[12px] text-pink-700 font-bold">{c.newWay.metrics}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-hairline/80 pt-4 mt-6 flex justify-between items-center bg-white -mx-6 -mb-6 p-4 rounded-b-xl">
              <div>
                <span className="text-[10px] text-mute uppercase font-bold block tracking-wider">Business Impact</span>
                <span className="text-[12px] text-ink font-bold">{c.impact}</span>
              </div>
              <button
                onClick={() => handleLearnMore(c.title)}
                className="px-3.5 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-bold text-[12px] transition active:scale-[0.98]"
              >
                Inspect Workflow
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
