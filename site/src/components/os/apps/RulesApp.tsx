import { useState } from "react";
import { Eyebrow } from "./ui";

interface Rule { name: string; cat: string; desc: string; }

const RULES: Rule[] = [
  { name: "Accessibility", cat: "Common", desc: "WCAG 2.1 AA compliance, ARIA labels, keyboard navigation." },
  { name: "Agent Design", cat: "Common", desc: "Multi-agent systems with proper delegation and error handling." },
  { name: "AI/LLM", cat: "Common", desc: "Prompt engineering, context management, token optimization." },
  { name: "API Design", cat: "Common", desc: "RESTful conventions, versioning, error responses, pagination." },
  { name: "CI/CD", cat: "Common", desc: "Pipeline design, deployment strategies, rollback procedures." },
  { name: "Code Review", cat: "Common", desc: "Review checklist, PR etiquette, constructive feedback patterns." },
  { name: "Coding Style", cat: "Common", desc: "Consistent formatting, naming conventions, code organization." },
  { name: "Commit Conventions", cat: "Common", desc: "Conventional commits, semantic versioning, changelog generation." },
  { name: "Data Privacy", cat: "Common", desc: "PII handling, data minimization, encryption at rest and transit." },
  { name: "Database Migrations", cat: "Common", desc: "Migration safety, rollback plans, zero-downtime strategies." },
  { name: "Dependency Management", cat: "Common", desc: "Version pinning, security audits, license compliance." },
  { name: "Docker", cat: "Common", desc: "Multi-stage builds, layer caching, security hardening." },
  { name: "Documentation", cat: "Common", desc: "Doc-driven development, API docs, architecture decision records." },
  { name: "Error Handling", cat: "Common", desc: "Structured errors, retry logic, circuit breakers." },
  { name: "Frontend Performance", cat: "Common", desc: "Core Web Vitals, lazy loading, bundle splitting." },
  { name: "Git", cat: "Common", desc: "Branch strategy, rebasing, conflict resolution, monorepo workflows." },
  { name: "GraphQL", cat: "Common", desc: "Schema design, resolver patterns, N+1 prevention, federation." },
  { name: "Kubernetes", cat: "Common", desc: "Resource limits, health checks, rolling updates, namespaces." },
  { name: "Logging", cat: "Common", desc: "Structured logging, log levels, correlation IDs, PII redaction." },
  { name: "Observability", cat: "Common", desc: "Metrics, traces, SLOs/SLIs, alerting strategies." },
  { name: "Performance", cat: "Common", desc: "Profiling, benchmarking, caching, algorithmic optimization." },
  { name: "REST API", cat: "Common", desc: "HTTP methods, status codes, rate limiting, CORS." },
  { name: "Secrets Management", cat: "Common", desc: "Vault integration, secret rotation, zero-trust access." },
  { name: "Security", cat: "Common", desc: "OWASP top 10, input validation, auth patterns, CSP headers." },
  { name: "SQL", cat: "Common", desc: "Query optimization, indexing, transactions, connection pooling." },
  { name: "Terraform", cat: "Common", desc: "State management, module design, drift detection." },
  { name: "Testing", cat: "Common", desc: "Test pyramid, unit/integration/e2e, mocking, coverage targets." },
  { name: "Go", cat: "Language", desc: "Error handling, goroutine patterns, interface design, modules." },
  { name: "Python", cat: "Language", desc: "Type hints, virtual environments, async patterns, packaging." },
  { name: "React", cat: "Language", desc: "Component patterns, hooks, state management, performance." },
  { name: "Rust", cat: "Language", desc: "Ownership model, error handling, async, FFI patterns." },
  { name: "TypeScript", cat: "Language", desc: "Strict types, generics, utility types, declaration files." },
];

export function RulesApp() {
  const [filter, setFilter] = useState("All");
  const cats = ["All", "Common", "Language"];
  const filtered = filter === "All" ? RULES : RULES.filter((r) => r.cat === filter);

  return (
    <div className="flex h-full">
      <div className="w-[160px] border-r border-hairline bg-cream/50 p-3 overflow-y-auto shrink-0">
        <Eyebrow color="#b62ad9">Category</Eyebrow>
        <div className="mt-3 space-y-0.5">
          {cats.map((c) => (
            <button key={c} onClick={() => setFilter(c)}
              className={`w-full text-left rounded-md px-2.5 py-1.5 text-[12px] flex items-center justify-between transition ${filter === c ? "bg-white font-bold text-ink shadow-sm" : "text-body hover:bg-white/50"}`}>
              <span>{c}</span>
              <span className="text-[10px] text-mute font-mono">{c === "All" ? RULES.length : RULES.filter((r) => r.cat === c).length}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-lg bg-ink text-[11px] text-[#e6e6e6] p-3 font-mono leading-relaxed">
          <div className="text-brand-yellow">.claude/rules.md</div>
          <div className="mt-1 text-mute"># Rules</div>
          <div className="text-[#e6e6e6]">- Always write tests</div>
          <div className="text-[#e6e6e6]">- Prefer immutability</div>
          <div className="text-[#e6e6e6]">- No console.log in prod</div>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <Eyebrow color="#b62ad9">Rules Engine</Eyebrow>
        <h2 className="text-lg font-bold text-ink mt-1 mb-4">{filtered.length} rules{filter !== "All" ? ` — ${filter}` : ""}</h2>
        <div className="grid gap-2">
          {filtered.map((r) => (
            <div key={r.name} className="rounded-lg border border-hairline bg-white p-3 hover:border-olive/70 transition">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: r.cat === "Language" ? "#f54e00" : "#b62ad9" }}>{r.cat}</span>
                <span className="text-[13px] font-bold text-ink">{r.name}</span>
              </div>
              <p className="mt-1 text-[12px] text-mute leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
