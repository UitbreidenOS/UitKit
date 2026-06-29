import featuresData from "./data/showcase_features.json";
import { useState } from "react";
import { Eyebrow } from "./ui";

interface Feature {
  id: string; icon: string; name: string; tagline: string;
  desc: string; how: string; example: string; color: string; category: string;
  install?: string;
  steps?: string[];
  related?: string[];
}
interface Category { id: string; label: string; color: string; audience: string; }

interface BlastNode { id: string; label: string; x: number; y: number; risk: "critical" | "medium" | "safe"; imports: string[]; depth: number; }
const BLAST_GRAPH: { nodes: BlastNode[]; links: { source: string; target: string }[] } = {
  nodes: [
    { id: "src/utils/auth.ts", label: "auth.ts", x: 220, y: 160, risk: "critical", imports: ["jwt", "crypto", "db/users"], depth: 0 },
    { id: "src/api/payments.ts", label: "payments.ts", x: 80, y: 60, risk: "critical", imports: ["auth", "db/orders", "stripe"], depth: 1 },
    { id: "src/api/users.ts", label: "users.ts", x: 80, y: 160, risk: "critical", imports: ["auth", "db/users", "validator"], depth: 1 },
    { id: "src/api/admin.ts", label: "admin.ts", x: 80, y: 260, risk: "medium", imports: ["auth", "db/users", "acl"], depth: 1 },
    { id: "src/db/users.ts", label: "db/users.ts", x: 360, y: 100, risk: "medium", imports: ["prisma", "auth-types"], depth: 2 },
    { id: "src/db/orders.ts", label: "db/orders.ts", x: 360, y: 200, risk: "safe", imports: ["prisma", "order-types"], depth: 2 },
    { id: "src/middleware/rate-limit.ts", label: "rate-limit.ts", x: 80, y: 350, risk: "medium", imports: ["auth", "redis"], depth: 1 },
    { id: "src/hooks/useAuth.ts", label: "useAuth.ts", x: 360, y: 310, risk: "safe", imports: ["auth-types", "api-client"], depth: 2 },
    { id: "src/components/Login.tsx", label: "Login.tsx", x: 480, y: 50, risk: "safe", imports: ["useAuth", "ui/Button"], depth: 3 },
    { id: "src/components/Dashboard.tsx", label: "Dashboard.tsx", x: 480, y: 160, risk: "safe", imports: ["useAuth", "api/payments"], depth: 3 },
    { id: "src/components/Admin.tsx", label: "AdminPanel.tsx", x: 480, y: 270, risk: "safe", imports: ["useAuth", "api/admin"], depth: 3 },
  ],
  links: [
    { source: "src/utils/auth.ts", target: "src/api/payments.ts" },
    { source: "src/utils/auth.ts", target: "src/api/users.ts" },
    { source: "src/utils/auth.ts", target: "src/api/admin.ts" },
    { source: "src/utils/auth.ts", target: "src/middleware/rate-limit.ts" },
    { source: "src/api/payments.ts", target: "src/db/orders.ts" },
    { source: "src/api/users.ts", target: "src/db/users.ts" },
    { source: "src/api/admin.ts", target: "src/db/users.ts" },
    { source: "src/db/users.ts", target: "src/hooks/useAuth.ts" },
    { source: "src/hooks/useAuth.ts", target: "src/components/Login.tsx" },
    { source: "src/hooks/useAuth.ts", target: "src/components/Dashboard.tsx" },
    { source: "src/hooks/useAuth.ts", target: "src/components/Admin.tsx" },
    { source: "src/api/payments.ts", target: "src/components/Dashboard.tsx" },
    { source: "src/api/admin.ts", target: "src/components/Admin.tsx" },
  ],
};
const RISK_COLORS = { critical: "#ef4444", medium: "#eab308", safe: "#22c55e" };

const CATEGORIES: Category[] = [
  { id: "cost", label: "Context & Cost Optimization", color: "#3fb950", audience: "CTOs & Power Users" },
  { id: "resilience", label: "Resilience & Zero-Hallucination", color: "#1d4aff", audience: "DevSecOps & QA Leads" },
  { id: "enterprise", label: "Enterprise Architecture", color: "#b62ad9", audience: "Architects & Staff Engineers" },
  { id: "swarms", label: "Multi-Agent Swarms", color: "#f54e00", audience: "Lead Developers" },
  { id: "context", label: "Environment & Context Engineering", color: "#f5b800", audience: "Onboarding & Daily Contributors" },
  { id: "zero-trust", label: "Zero-Trust & Compliance", color: "#ff5722", audience: "Security & Compliance Teams" },
  { id: "enterprise-intel", label: "Enterprise Intelligence", color: "#00bcd4", audience: "Platform & Architecture Leads" },
  { id: "multi-agent", label: "Multi-Agent & Federation", color: "#ff9800", audience: "DevOps & Infrastructure Teams" },
  { id: "creative", label: "Creative & Vibe Coding", color: "#e91e63", audience: "Frontend & Product Engineers" },
  { id: "ux", label: "UX & Developer Experience", color: "#7c4dff", audience: "Power Users & DX Teams" },
];

const FEATURES = featuresData as Feature[];

export function ShowcaseApp() {
  const [selected, setSelected] = useState(FEATURES[0]);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [blastSelectedId, setBlastSelectedId] = useState("src/utils/auth.ts");
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});

  const filtered = activeCat ? FEATURES.filter((f) => f.category === activeCat) : FEATURES;
  const blastNode = BLAST_GRAPH.nodes.find(n => n.id === blastSelectedId) || BLAST_GRAPH.nodes[0];

  const handleToggleExpand = (catId: string) => {
    setExpandedCats((prev) => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  return (
    <div className="flex h-full">
      <div className="w-[230px] border-r border-hairline bg-cream/50 p-3 overflow-y-auto shrink-0">
        <Eyebrow color="#f54e00">Showcase · {FEATURES.length} Features</Eyebrow>
        <div className="mt-3 space-y-3">
          {CATEGORIES.map((cat) => {
            const allCatFeatures = FEATURES.filter((f) => f.category === cat.id);
            const isExpanded = expandedCats[cat.id] || activeCat === cat.id;
            // Limit to first 5 features if not expanded
            const displayedFeatures = isExpanded ? allCatFeatures : allCatFeatures.slice(0, 5);
            const hasMore = allCatFeatures.length > 5;

            return (
              <div key={cat.id} className="border-b border-hairline/30 pb-2 last:border-b-0">
                <button
                  onClick={() => setActiveCat(activeCat === cat.id ? null : cat.id)}
                  className={`w-full text-left flex items-center justify-between rounded-md px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${activeCat === cat.id ? "bg-white text-ink shadow-sm" : "text-mute hover:text-body"}`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="truncate">{cat.label}</span>
                  </div>
                  <span className="text-[10px] text-mute shrink-0 ml-1">({allCatFeatures.length})</span>
                </button>
                <div className="ml-1 mt-0.5 space-y-0.5">
                  {displayedFeatures.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelected(f)}
                      className={`w-full text-left rounded-md px-2 py-1 text-[11.5px] transition ${selected.id === f.id ? "bg-white font-bold text-ink shadow-sm" : "text-body hover:bg-white/50"}`}
                    >
                      <span className="mr-1">{f.icon}</span>{f.name}
                    </button>
                  ))}
                  {hasMore && !isExpanded && (
                    <button
                      onClick={() => handleToggleExpand(cat.id)}
                      className="w-full text-left rounded-md px-2 py-0.5 text-[10px] font-bold text-blue-500 hover:text-blue-600 transition"
                    >
                      + {allCatFeatures.length - 5} more...
                    </button>
                  )}
                  {hasMore && isExpanded && activeCat !== cat.id && (
                    <button
                      onClick={() => handleToggleExpand(cat.id)}
                      className="w-full text-left rounded-md px-2 py-0.5 text-[10px] font-bold text-blue-500 hover:text-blue-600 transition"
                    >
                      Show less
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <div className="pt-2">
            <a href="https://github.com/UitbreidenOS/UitKit" target="_blank" rel="noopener noreferrer" className="block w-full text-center rounded-md px-2 py-1.5 text-[10.5px] font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 transition">✨ Explore all on GitHub →</a>
          </div>
        </div>
      </div>
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="grid place-items-center size-12 rounded-xl text-2xl" style={{ backgroundColor: selected.color + "1a" }}>
            {selected.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ backgroundColor: selected.color }} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-mute">
                {CATEGORIES.find((c) => c.id === selected.category)?.label}
              </span>
            </div>
            <Eyebrow color={selected.color}>{selected.tagline}</Eyebrow>
            <h2 className="text-xl font-bold text-ink">{selected.name}</h2>
          </div>
        </div>
        <p className="text-[14px] text-body leading-relaxed mb-5">{selected.desc}</p>
        <div className="mb-5">
          <div className="text-[12px] font-bold text-mute uppercase tracking-wider mb-2">How it works</div>
          <p className="text-[13px] text-body leading-relaxed">{selected.how}</p>
        </div>
        <div className="mb-5">
          <div className="text-[12px] font-bold text-mute uppercase tracking-wider mb-2">Example</div>
          <pre className="rounded-lg bg-code-bg text-code-text p-4 text-[11px] font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto">
            {selected.example}
          </pre>
        </div>
        {selected.install && (
          <div className="mb-5">
            <div className="text-[12px] font-bold text-mute uppercase tracking-wider mb-2">Install</div>
            <div className="flex items-center gap-2 rounded-lg bg-code-bg px-4 py-2.5">
              <code className="flex-1 text-[12px] font-mono text-emerald-400">{selected.install}</code>
              <button onClick={() => navigator.clipboard.writeText(selected.install!)}
                className="text-[10px] font-bold text-slate-400 hover:text-white transition shrink-0">Copy</button>
            </div>
          </div>
        )}

        {selected.steps && selected.steps.length > 0 && (
          <div className="mb-5">
            <div className="text-[12px] font-bold text-mute uppercase tracking-wider mb-2">Step-by-Step</div>
            <div className="space-y-2">
              {selected.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-hairline bg-white p-3">
                  <span className="grid place-items-center size-6 rounded-full text-[11px] font-bold shrink-0" style={{ backgroundColor: selected.color + "20", color: selected.color }}>{i + 1}</span>
                  <span className="text-[12.5px] text-body leading-relaxed pt-0.5">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {selected.related && selected.related.length > 0 && (
          <div className="mb-5">
            <div className="text-[12px] font-bold text-mute uppercase tracking-wider mb-2">Related Commands</div>
            <div className="flex flex-wrap gap-2">
              {selected.related.map((cmd) => (
                <span key={cmd} className="inline-flex items-center rounded-md bg-code-bg px-2.5 py-1.5 text-[11px] font-mono font-semibold text-brand-purple">
                  {cmd}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-cream px-2.5 py-1 text-[11px] text-mute">
          Target: {CATEGORIES.find((c) => c.id === selected.category)?.audience}
        </div>

        {selected.id === "blast-radius" && (
          <div className="mt-6">
            <div className="text-[12px] font-bold text-mute uppercase tracking-wider mb-3">Interactive Dependency Graph</div>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 rounded-xl border border-hairline bg-[#1a1b26] relative overflow-hidden min-h-[340px]">
                <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 z-10">
                  # Blast Radius — src/utils/auth.ts (click nodes to inspect)
                </div>
                <svg className="w-full h-full min-h-[340px]">
                  {BLAST_GRAPH.links.map((link, i) => {
                    const s = BLAST_GRAPH.nodes.find(n => n.id === link.source);
                    const t = BLAST_GRAPH.nodes.find(n => n.id === link.target);
                    if (!s || !t) return null;
                    const hl = blastSelectedId === link.source || blastSelectedId === link.target;
                    return <line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke={hl ? "#fabd2f" : "#444b6a"} strokeWidth={hl ? 2 : 1} strokeDasharray={hl ? "none" : "3,3"} className="transition-all duration-300" />;
                  })}
                  {BLAST_GRAPH.nodes.map((node) => {
                    const isSel = blastSelectedId === node.id;
                    return (
                      <g key={node.id} transform={`translate(${node.x},${node.y})`} onClick={() => setBlastSelectedId(node.id)} className="cursor-pointer group">
                        <circle r={isSel ? 12 : 9} fill={RISK_COLORS[node.risk]} stroke={isSel ? "#fff" : "transparent"} strokeWidth={2} className="transition-all duration-300 group-hover:scale-125" />
                        <text y={22} textAnchor="middle" fill={isSel ? "#ffffff" : "#a9b1d6"} className="text-[10px] font-mono select-none font-semibold">{node.label}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="w-full lg:w-64 rounded-xl border border-hairline bg-white p-4 shrink-0">
                <span className="text-[10px] font-bold text-mute uppercase tracking-wider block mb-1">Node Inspector</span>
                <h3 className="text-[13px] font-mono font-bold text-ink truncate mb-2">{blastNode.id}</h3>
                <div className="flex gap-1.5 flex-wrap mb-3">
                  <span className="text-[9px] font-bold uppercase rounded px-1.5 py-0.5" style={{ backgroundColor: RISK_COLORS[blastNode.risk] + "20", color: RISK_COLORS[blastNode.risk] }}>
                    {blastNode.risk} risk
                  </span>
                  <span className="text-[9px] font-bold uppercase rounded px-1.5 py-0.5 bg-slate-100 text-slate-500">
                    depth {blastNode.depth}
                  </span>
                </div>
                <div className="mb-3">
                  <span className="text-[11px] font-bold text-mute uppercase tracking-wider block mb-1.5">Imports ({blastNode.imports.length})</span>
                  <div className="space-y-1">
                    {blastNode.imports.map((imp, i) => (
                      <code key={i} className="block text-[10px] font-mono bg-slate-50 text-slate-600 px-2 py-0.5 rounded">"{imp}"</code>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-mute uppercase tracking-wider block mb-1.5">Downstream Impact</span>
                  <span className="text-[12px] text-body">
                    {BLAST_GRAPH.links.filter(l => l.source === blastNode.id || l.target === blastNode.id).length} direct connections
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-hairline">
                  <div className="text-[10px] font-bold text-mute uppercase tracking-wider mb-2">Risk Legend</div>
                  <div className="space-y-1">
                    {(["critical", "medium", "safe"] as const).map(r => (
                      <div key={r} className="flex items-center gap-1.5">
                        <span className="size-2.5 rounded-full" style={{ backgroundColor: RISK_COLORS[r] }} />
                        <span className="text-[10px] text-body capitalize">{r} path</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
