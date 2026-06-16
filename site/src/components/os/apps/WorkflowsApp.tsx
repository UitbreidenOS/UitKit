import { useState } from "react";
import { Eyebrow } from "./ui";

interface Wf { name: string; cat: string; desc: string; }

const WORKFLOWS: Wf[] = [
  { name: "Feature Development", cat: "Engineering", desc: "End-to-end feature: branch → code → test → PR → review → merge." },
  { name: "Bug Investigation", cat: "Engineering", desc: "Reproduce → isolate → root cause → fix → regression test." },
  { name: "Code Review", cat: "Engineering", desc: "Multi-pass review: correctness, style, performance, security." },
  { name: "Refactor Safely", cat: "Engineering", desc: "Characterize → extract → migrate → verify behavior preservation." },
  { name: "Debugging Session", cat: "Engineering", desc: "Log → bisect → hypothesis → experiment → fix → verify." },
  { name: "New Project Bootstrap", cat: "Engineering", desc: "Scaffold → configure → CI → README → first commit." },
  { name: "RIPE(R)", cat: "Engineering", desc: "Research → Innovate → Plan → Execute → Review methodology." },
  { name: "Incremental Build", cat: "Engineering", desc: "Build features incrementally with continuous validation." },
  { name: "Strangle Legacy", cat: "Engineering", desc: "Gradually replace legacy system with strangler fig pattern." },
  { name: "Worktree Lifecycle", cat: "Engineering", desc: "Manage git worktrees for parallel feature development." },
  // DevOps
  { name: "DevOps Incident", cat: "DevOps", desc: "Detect → triage → mitigate → post-mortem → prevent." },
  { name: "Agentic Production Runbook", cat: "DevOps", desc: "Automated runbook execution with agent oversight." },
  { name: "Error Budget", cat: "DevOps", desc: "Track error budget burn rate and trigger freezes." },
  { name: "Chaos Game Day", cat: "DevOps", desc: "Simulate failures to test resilience and recovery." },
  { name: "Database Migration", cat: "DevOps", desc: "Plan → test → deploy → verify → rollback plan." },
  { name: "Offline Validation", cat: "DevOps", desc: "Validate infrastructure changes without cloud access." },
  // Business
  { name: "Founder Weekly", cat: "Business", desc: "Weekly strategic review: metrics, runway, priorities." },
  { name: "CTO Weekly", cat: "Business", desc: "Tech leadership: architecture, debt, team velocity." },
  { name: "Freelancer Weekly", cat: "Business", desc: "Client pipeline, invoicing, project delivery review." },
  { name: "Deal Screening", cat: "Business", desc: "Evaluate partnership/investment opportunities systematically." },
  { name: "Compound Engineering", cat: "Business", desc: "Build compounding assets that accelerate over time." },
  // GTM/Sales
  { name: "SDR Daily", cat: "Sales", desc: "Daily prospecting: research → personalize → outreach → track." },
  { name: "SDR Daily Workflow", cat: "Sales", desc: "Full daily SDR workflow with CRM integration." },
  { name: "SDR Sequence Builder", cat: "Sales", desc: "Multi-touch outreach sequence across channels." },
  { name: "AE Deal Cycle", cat: "Sales", desc: "Full account executive deal lifecycle management." },
  { name: "Email Campaign", cat: "Sales", desc: "Design, write, test, and send email campaigns." },
  // Marketing
  { name: "Content Creation", cat: "Marketing", desc: "Research → outline → draft → edit → publish → distribute." },
  { name: "Growth Experiment", cat: "Marketing", desc: "Hypothesize → design → test → measure → iterate." },
  { name: "DX Review", cat: "Marketing", desc: "Developer experience audit and improvement plan." },
  // PM/Design
  { name: "PM Sprint", cat: "Product", desc: "Sprint planning: prioritize → scope → assign → track." },
  { name: "UX Research Sprint", cat: "Product", desc: "User research: recruit → interview → synthesize → present." },
  { name: "API Design", cat: "Product", desc: "Design API contracts with stakeholder alignment." },
  // Data
  { name: "Data Reporting", cat: "Data", desc: "Extract → transform → visualize → narrate findings." },
  { name: "DAG Orchestration", cat: "Data", desc: "Design and manage DAG-based data pipelines." },
  // Security
  { name: "Security Review", cat: "Security", desc: "Threat model → scan → triage → remediate → verify." },
  { name: "Pre-Human Review", cat: "Security", desc: "Pre-commit security review before human merge." },
  // Multi-Agent
  { name: "Autonomous Loop", cat: "Multi-Agent", desc: "Autonomous agent loop with human checkpoint gates." },
  { name: "Agent Team Kickoff", cat: "Multi-Agent", desc: "Initialize multi-agent team with roles and handoffs." },
  { name: "Agent Memory Sharing", cat: "Multi-Agent", desc: "Share context and memory between cooperating agents." },
  { name: "Multi-Agent Debug", cat: "Multi-Agent", desc: "Debug failures across multi-agent pipelines." },
  { name: "Multi-Agent Saga", cat: "Multi-Agent", desc: "Saga pattern for distributed agent transactions." },
  { name: "Session Learning", cat: "Multi-Agent", desc: "Extract learnings from session for future context." },
  // Operations
  { name: "Ops Weekly", cat: "Operations", desc: "Operations review: uptime, incidents, capacity planning." },
  { name: "Ecommerce Weekly", cat: "Operations", desc: "Store metrics, inventory, marketing performance review." },
  { name: "CS QBR Prep", cat: "Operations", desc: "Quarterly business review preparation with health scores." },
  { name: "Contract Review", cat: "Operations", desc: "Review contracts for risks, obligations, and opportunities." },
  { name: "Recruiting Pipeline", cat: "Operations", desc: "Source → screen → interview → offer → onboard." },
  // Maintenance
  { name: "Skill Audit", cat: "Maintenance", desc: "Audit all skills for freshness, quality, and coverage." },
  { name: "Freshness Refresh", cat: "Maintenance", desc: "Auto-refresh stale content across all skills and docs." },
  { name: "Context Management Flow", cat: "Maintenance", desc: "Manage context budget across session lifecycle." },
  { name: "Docs Sprint", cat: "Maintenance", desc: "Focused documentation sprint with review gates." },
  { name: "Finance Month End", cat: "Maintenance", desc: "Month-end close: reconcile → report → analyze." },
  { name: "Feature Launch", cat: "Maintenance", desc: "Launch checklist: docs, marketing, monitoring, support." },
];

const CAT_COLORS: Record<string, string> = {
  Engineering: "#1d4aff", DevOps: "#f54e00", Business: "#f5b800",
  Sales: "#3fb950", Marketing: "#b62ad9", Product: "#1078a3",
  Data: "#1d4aff", Security: "#ef4444", "Multi-Agent": "#b62ad9",
  Operations: "#f5b800", Maintenance: "#76786c",
};

export function WorkflowsApp() {
  const cats = ["All", ...new Set(WORKFLOWS.map((w) => w.cat))];
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? WORKFLOWS : WORKFLOWS.filter((w) => w.cat === filter);
  const catCounts = cats.map((c) => ({ name: c, count: c === "All" ? WORKFLOWS.length : WORKFLOWS.filter((w) => w.cat === c).length }));

  return (
    <div className="flex h-full">
      <div className="w-[180px] border-r border-hairline bg-cream/50 p-3 overflow-y-auto shrink-0">
        <Eyebrow color="#3fb950">Domain</Eyebrow>
        <div className="mt-3 space-y-0.5">
          {catCounts.map((c) => (
            <button key={c.name} onClick={() => setFilter(c.name)}
              className={`w-full text-left rounded-md px-2.5 py-1.5 text-[12px] flex items-center justify-between transition ${filter === c.name ? "bg-white font-bold text-ink shadow-sm" : "text-body hover:bg-white/50"}`}>
              <span className="truncate">{c.name}</span>
              <span className="text-[10px] text-mute font-mono shrink-0 ml-1">{c.count}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <Eyebrow color="#3fb950">Workflows</Eyebrow>
        <h2 className="text-lg font-bold text-ink mt-1 mb-4">{filtered.length} workflows{filter !== "All" ? ` — ${filter}` : ""}</h2>
        <div className="space-y-2">
          {filtered.map((w) => (
            <div key={w.name} className="rounded-lg border border-hairline bg-white p-3 hover:border-olive/70 transition">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-ink">{w.name}</span>
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold text-white" style={{ backgroundColor: CAT_COLORS[w.cat] || "#76786c" }}>{w.cat}</span>
              </div>
              <p className="mt-1 text-[12px] text-mute">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
