import { useState, useMemo } from "react";
import { Eyebrow, Tag, YellowButton } from "./ui";

interface Showcase {
  id: string;
  title: string;
  author: string;
  description: string;
  skills: string[];
  agents_count: number;
  stars: number;
  tags: string[];
}

const SHOWCASE_URL = "https://github.com/UitbreidenOS/Claudient/tree/main/community";
const PR_URL = "https://github.com/UitbreidenOS/Claudient/compare";
const TEMPLATE_CMD = "cp -r community/template/stack-template/ my-stack && cd my-stack";

const showcases: Showcase[] = [
  { id: "fullstack-saas-stack", title: "Full-Stack SaaS Stack", author: "community", description: "Complete SaaS development: frontend components, backend APIs, databases, auth, devops, testing, analytics, monitoring", skills: ["backend", "automation", "devops-infra", "marketing"], agents_count: 14, stars: 35, tags: ["saas", "fullstack", "engineering", "startup"] },
  { id: "ai-engineering-stack", title: "AI Engineering Stack", author: "community", description: "LLM development: agent orchestration, RAG patterns, prompt optimization, token management, model eval, monitoring", skills: ["ai-engineering", "data-ml"], agents_count: 10, stars: 31, tags: ["ai", "engineering", "llm", "agents"] },
  { id: "devops-infra-stack", title: "DevOps Infrastructure Stack", author: "community", description: "Cloud-native ops: Kubernetes, Terraform, CI/CD pipelines, monitoring, cost optimization, disaster recovery", skills: ["devops-infra", "automation"], agents_count: 7, stars: 24, tags: ["devops", "infrastructure", "cloud", "automation"] },
  { id: "small-biz-stack", title: "Small Business Stack", author: "community", description: "Small biz ops: invoicing, cash flow, bookkeeping, client management, SOPs, content marketing, analytics", skills: ["small-business", "marketing", "automation"], agents_count: 9, stars: 22, tags: ["small-business", "operations", "marketing", "productivity"] },
  { id: "backend-api-stack", title: "Backend API Stack", author: "community", description: "Full-stack REST API development: FastAPI/Express patterns, database design, migrations, API docs generation, testing", skills: ["backend", "database", "devops-infra"], agents_count: 6, stars: 18, tags: ["backend", "api", "database", "engineering"] },
  { id: "full-gtm-stack", title: "Full GTM Stack", author: "tushar2704", description: "Complete go-to-market setup: SDR research, sales ops, email automation, analytics, and pipeline management", skills: ["gtm", "sdr", "marketing"], agents_count: 8, stars: 12, tags: ["sales", "gtm", "startup", "revenue"] },
  { id: "fintech-stack", title: "Fintech & Compliance Stack", author: "community", description: "Financial tech stack: DCF models, regulatory compliance (GDPR/SOC2), payment processing, KYC automation, audit trails", skills: ["finance", "finance-payments", "legal"], agents_count: 5, stars: 8, tags: ["finance", "compliance", "payments", "regulated"] },
  { id: "legal-ops-stack", title: "Legal Operations Stack", author: "community", description: "Legal operations automation: contract review, GDPR compliance, SOC2 framework, legal research, vendor management", skills: ["legal", "automation"], agents_count: 4, stars: 6, tags: ["legal", "compliance", "governance", "operations"] },
];

// Collect all unique tags
const allTags = [...new Set(showcases.flatMap((s) => s.tags))].sort();

export function CommunityApp() {
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (tagFilter === "all") return showcases;
    return showcases.filter((s) => s.tags.includes(tagFilter));
  }, [tagFilter]);

  const copyCmd = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="h-full flex flex-col sm:flex-row">
      {/* Left sidebar — tag filter */}
      <aside className="sm:w-52 shrink-0 border-r border-hairline bg-cream flex flex-col overflow-hidden">
        <div className="p-3">
          <Eyebrow color="#f54e00">Community</Eyebrow>
        </div>
        <div className="flex-1 overflow-auto px-2 pb-2 space-y-0.5">
          <button
            onClick={() => setTagFilter("all")}
            className={`w-full text-left flex items-center justify-between rounded-lg px-2.5 py-2 text-[12px] font-semibold transition ${
              tagFilter === "all" ? "bg-white border border-hairline text-ink shadow-sm" : "text-body hover:bg-white/60"
            }`}
          >
            <span>All Stacks</span>
            <span className="text-[10px] text-mute">{showcases.length}</span>
          </button>
          {allTags.map((t) => {
            const count = showcases.filter((s) => s.tags.includes(t)).length;
            return (
              <button
                key={t}
                onClick={() => setTagFilter(t)}
                className={`w-full text-left flex items-center justify-between rounded-lg px-2.5 py-2 text-[12px] font-semibold transition capitalize ${
                  tagFilter === t ? "bg-white border border-hairline text-ink shadow-sm" : "text-body hover:bg-white/60"
                }`}
              >
                <span className="truncate">{t}</span>
                <span className="text-[10px] text-mute shrink-0 ml-1">{count}</span>
              </button>
            );
          })}
        </div>
        <div className="px-3 py-2.5 border-t border-hairline space-y-1">
          <div className="text-[11px] font-bold text-ink">{showcases.length} showcase stacks</div>
          <a
            href={PR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md bg-brand-yellow px-2 py-1 text-[10px] font-bold text-ink border-b border-[#c79700] hover:brightness-105 transition w-full text-center justify-center"
          >
            Submit Yours →
          </a>
        </div>
      </aside>

      {/* Right pane — showcase cards */}
      <div className="flex-1 min-w-0 overflow-auto flex flex-col">
        <div className="shrink-0 border-b border-hairline px-5 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-[15px] font-extrabold text-ink capitalize">
              {tagFilter === "all" ? "All Stacks" : tagFilter} ({filtered.length})
            </h2>
            <Tag color="#f5b800">{filtered.reduce((s, r) => s + r.stars, 0)} total stars</Tag>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-5">
          {filtered.length === 0 ? (
            <div className="grid place-items-center h-full text-center text-mute text-[13px]">
              No community stacks with this tag yet.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {filtered.sort((a, b) => b.stars - a.stars).map((s) => (
                <div key={s.id} className="rounded-xl border border-hairline bg-white p-4 hover:border-brand-orange/40 transition">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-bold text-ink">{s.title}</div>
                      <div className="text-[11px] text-mute mt-0.5">by {s.author}</div>
                    </div>
                    <div className="flex items-center gap-1 text-[12px] text-[#f5b800] shrink-0 font-bold">
                      <span>★</span> {s.stars}
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-body leading-relaxed">{s.description}</p>
                  <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                    {s.skills.map((sk) => (
                      <span key={sk} className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-semibold text-brand-teal bg-brand-teal/10 capitalize">{sk}</span>
                    ))}
                    <span className="text-[10px] text-mute">{s.agents_count} agents</span>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                    {s.tags.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTagFilter(t)}
                        className="inline-flex items-center rounded-full border border-hairline px-2 py-0.5 text-[9px] font-semibold text-mute hover:text-ink hover:border-olive/60 transition capitalize"
                      >
                        #{t}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <a
                      href={PR_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md bg-brand-yellow px-3 py-1.5 text-[11px] font-bold text-ink border-b border-[#c79700] hover:brightness-105 transition"
                    >
                      Submit via PR
                    </a>
                    <button
                      onClick={() => copyCmd(TEMPLATE_CMD, s.id)}
                      className="inline-flex items-center gap-1 rounded-md border border-olive/60 bg-white px-3 py-1.5 text-[11px] font-semibold text-ink hover:bg-cream transition"
                    >
                      {copied === s.id ? "✓ Copied!" : "Copy Template"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — PR submission instructions */}
        <div className="shrink-0 border-t border-hairline px-5 py-3 bg-cream/50">
          <div className="text-[11px] text-mute mb-2">
            <strong>How to submit your stack:</strong>
          </div>
          <ol className="text-[11px] text-body space-y-1 list-decimal list-inside">
            <li>Fork the repo and create a branch: <code className="bg-white px-1 py-0.5 rounded font-mono text-[10px]">git checkout -b stacks/your-stack-name</code></li>
            <li>Copy the template: <code className="bg-white px-1 py-0.5 rounded font-mono text-[10px]">cp -r community/template/stack-template/ your-stack/</code></li>
            <li>Add your skills, hooks, and a <code className="bg-white px-1 py-0.5 rounded font-mono text-[10px]">submission.json</code></li>
            <li>Open a PR at <a href={PR_URL} target="_blank" rel="noopener noreferrer" className="text-brand-blue underline font-semibold">github.com/UitbreidenOS/Claudient/compare</a></li>
          </ol>
          <div className="mt-2 flex items-center gap-2">
            <YellowButton onClick={() => copyCmd(TEMPLATE_CMD, "footer")}>
              {copied === "footer" ? "✓ Copied!" : "Copy Template Command"}
            </YellowButton>
            <a
              href={SHOWCASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-olive/60 bg-white px-3 py-1.5 text-[11px] font-semibold text-ink hover:bg-cream transition"
            >
              Read Full Guide
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
