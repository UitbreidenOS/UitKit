import { useState, useMemo } from "react";
import { Eyebrow, Tag } from "./ui";

interface BenchmarkResult {
  id: string;
  title: string;
  category: string;
  score: number;
  tests_passed: number;
  tests_run: number;
  grade: string;
  last_tested: string;
  notes: string;
}

const results: BenchmarkResult[] = [
  { id: "backend/fastapi-crud", title: "FastAPI CRUD", category: "backend", score: 0.95, tests_passed: 10, tests_run: 10, grade: "A", last_tested: "2026-06-15", notes: "Perfect score on API design, validation, error handling" },
  { id: "finance/dcf-model", title: "DCF Model", category: "finance", score: 0.93, tests_passed: 9, tests_run: 10, grade: "A", last_tested: "2026-06-12", notes: "Excellent on financial projections; one edge case with negative cash flows" },
  { id: "ai-engineering/advanced-tool-use", title: "Advanced Tool Use", category: "ai-engineering", score: 0.92, tests_passed: 9, tests_run: 10, grade: "A", last_tested: "2026-06-10", notes: "Excellent guidance on tool composition; one edge case with parallel execution" },
  { id: "productivity/adr-writer", title: "ADR Writer", category: "productivity", score: 0.92, tests_passed: 9, tests_run: 10, grade: "A", last_tested: "2026-06-13", notes: "Perfect on architecture decision templates; one edge case with legacy system decisions" },
  { id: "git/commit-msg-generator", title: "Commit Message Generator", category: "git", score: 0.91, tests_passed: 9, tests_run: 10, grade: "A", last_tested: "2026-06-13", notes: "Excellent on conventional commits; one edge case with multi-line descriptions" },
  { id: "devops-infra/terraform-modules", title: "Terraform Modules", category: "devops-infra", score: 0.91, tests_passed: 9, tests_run: 10, grade: "A", last_tested: "2026-06-13", notes: "Strong on module design; occasionally misses state management best practices" },
  { id: "database/postgres-optimization", title: "PostgreSQL Optimization", category: "database", score: 0.90, tests_passed: 9, tests_run: 10, grade: "A", last_tested: "2026-06-10", notes: "Excellent on indexing and query plans; one edge case with composite keys" },
  { id: "gtm/sdr-research-brief", title: "SDR Research Brief", category: "gtm", score: 0.90, tests_passed: 9, tests_run: 10, grade: "A", last_tested: "2026-06-14", notes: "Strong on firmographic research; occasionally verbose on smaller companies" },
  { id: "finance-payments/stripe-integration", title: "Stripe Integration", category: "finance-payments", score: 0.89, tests_passed: 9, tests_run: 10, grade: "A", last_tested: "2026-06-11", notes: "Strong on webhook handling; occasionally misses PCI compliance edge cases" },
  { id: "backend/express-middleware", title: "Express Middleware", category: "backend", score: 0.89, tests_passed: 9, tests_run: 10, grade: "A", last_tested: "2026-06-12", notes: "Excellent on middleware patterns; one edge case with async error handling" },
  { id: "automation/browser-automation", title: "Browser Automation", category: "automation", score: 0.88, tests_passed: 9, tests_run: 10, grade: "A", last_tested: "2026-06-09", notes: "Strong on Playwright patterns; occasionally misses edge cases with dynamic content" },
  { id: "data-ml/sql-optimization", title: "SQL Optimization", category: "data-ml", score: 0.88, tests_passed: 9, tests_run: 10, grade: "A", last_tested: "2026-06-11", notes: "Excellent on query optimization; one edge case with complex CTEs" },
  { id: "product/product-discovery", title: "Product Discovery", category: "product", score: 0.88, tests_passed: 9, tests_run: 10, grade: "A", last_tested: "2026-06-11", notes: "Excellent on user research frameworks; one edge case with B2B discovery" },
  { id: "devops-infra/kubernetes-architect", title: "Kubernetes Architect", category: "devops-infra", score: 0.87, tests_passed: 9, tests_run: 10, grade: "A", last_tested: "2026-06-08", notes: "Strong on manifests and scaling; occasionally under-specifies resource limits" },
  { id: "sdr/cold-email-sequence", title: "Cold Email Sequence", category: "sdr", score: 0.87, tests_passed: 9, tests_run: 10, grade: "A", last_tested: "2026-06-12", notes: "Strong on personalization; occasionally misses compliance with CAN-SPAM" },
  { id: "legal/gdpr-compliance", title: "GDPR Compliance", category: "legal", score: 0.86, tests_passed: 8, tests_run: 10, grade: "B", last_tested: "2026-06-09", notes: "Good on data protection frameworks; occasionally misses regional variations" },
  { id: "data-ml/pandas-polars", title: "Pandas / Polars", category: "data-ml", score: 0.85, tests_passed: 8, tests_run: 10, grade: "B", last_tested: "2026-06-11", notes: "Strong on data transformation; occasionally misses memory optimization for large datasets" },
  { id: "small-business/invoice-chaser", title: "Invoice Chaser", category: "small-business", score: 0.85, tests_passed: 8, tests_run: 10, grade: "B", last_tested: "2026-06-08", notes: "Good on payment reminders; sometimes too aggressive in tone" },
  { id: "marketing/seo-audit", title: "SEO Audit", category: "marketing", score: 0.84, tests_passed: 8, tests_run: 10, grade: "B", last_tested: "2026-06-10", notes: "Strong on on-page SEO; sometimes over-focuses on technical vs. content quality" },
  { id: "computer-use/ui-testing", title: "UI Testing", category: "computer-use", score: 0.80, tests_passed: 8, tests_run: 10, grade: "B", last_tested: "2026-06-12", notes: "Good on visual assertions; sometimes over-complicates mobile testing" },
];

// Pre-compute category counts
const catCounts: Record<string, number> = {};
results.forEach((r) => { catCounts[r.category] = (catCounts[r.category] || 0) + 1; });
const categories = Object.keys(catCounts).sort();
const avgScore = results.reduce((s, r) => s + r.score, 0) / results.length;

const gradeColor = (g: string) =>
  g === "A" ? "#3fb950" : g === "B" ? "#1d4aff" : g === "C" ? "#f5b800" : "#ef4444";

export function BenchmarksApp() {
  const [cat, setCat] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"score" | "name" | "grade">("score");

  const filtered = useMemo(() => {
    let list = cat === "all" ? results : results.filter((r) => r.category === cat);
    if (sortBy === "score") list = [...list].sort((a, b) => b.score - a.score);
    else if (sortBy === "name") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    else list = [...list].sort((a, b) => a.grade.localeCompare(b.grade) || b.score - a.score);
    return list;
  }, [cat, sortBy]);

  const catAvg = filtered.length > 0
    ? (filtered.reduce((s, r) => s + r.score, 0) / filtered.length * 100).toFixed(0)
    : "0";

  return (
    <div className="h-full flex flex-col sm:flex-row">
      {/* Left sidebar */}
      <aside className="sm:w-52 shrink-0 border-r border-hairline bg-cream flex flex-col overflow-hidden">
        <div className="p-3">
          <Eyebrow color="#8b5cf6">Skill Evals</Eyebrow>
        </div>
        <div className="flex-1 overflow-auto px-2 pb-2 space-y-0.5">
          <button
            onClick={() => setCat("all")}
            className={`w-full text-left flex items-center justify-between rounded-lg px-2.5 py-2 text-[12px] font-semibold transition ${
              cat === "all" ? "bg-white border border-hairline text-ink shadow-sm" : "text-body hover:bg-white/60"
            }`}
          >
            <span>All</span>
            <span className="text-[10px] text-mute">{results.length}</span>
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`w-full text-left flex items-center justify-between rounded-lg px-2.5 py-2 text-[12px] font-semibold transition ${
                cat === c ? "bg-white border border-hairline text-ink shadow-sm" : "text-body hover:bg-white/60"
              }`}
            >
              <span className="truncate capitalize">{c}</span>
              <span className="text-[10px] text-mute shrink-0 ml-1">{catCounts[c]}</span>
            </button>
          ))}
        </div>
        <div className="px-3 py-2.5 border-t border-hairline space-y-0.5">
          <div className="text-[11px] font-bold text-ink">{results.length} benchmarked</div>
          <div className="text-[10px] text-mute">{(avgScore * 100).toFixed(1)}% avg score</div>
        </div>
      </aside>

      {/* Right pane */}
      <div className="flex-1 min-w-0 overflow-auto flex flex-col">
        {/* Header */}
        <div className="shrink-0 border-b border-hairline px-5 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-[15px] font-extrabold text-ink capitalize">
              {cat === "all" ? "All Skills" : cat} ({filtered.length})
            </h2>
            <Tag color="#8b5cf6">Avg: {catAvg}%</Tag>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "score" | "name" | "grade")}
            className="rounded-md border border-hairline bg-white px-2.5 py-1.5 text-[11px] text-ink outline-none"
          >
            <option value="score">Sort by Score</option>
            <option value="grade">Sort by Grade</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="flex-1 grid place-items-center p-8 text-center text-mute text-[13px]">
            Not yet benchmarked for this category.
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-5">
            <div className="rounded-xl border border-hairline bg-white overflow-hidden">
              <table className="w-full text-[12px]">
                <thead className="bg-soft border-b border-hairline">
                  <tr>
                    <th className="text-left px-3 py-2 font-bold text-mute">Skill</th>
                    <th className="text-center px-3 py-2 font-bold text-mute w-16">Grade</th>
                    <th className="text-center px-3 py-2 font-bold text-mute w-24">Score</th>
                    <th className="text-center px-3 py-2 font-bold text-mute w-16">Tests</th>
                    <th className="text-left px-3 py-2 font-bold text-mute w-24 hidden md:table-cell">Last Tested</th>
                    <th className="text-left px-3 py-2 font-bold text-mute hidden lg:table-cell">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-b border-hairline last:border-0 hover:bg-cream/50">
                      <td className="px-3 py-2.5 font-semibold text-ink">{r.title}</td>
                      <td className="px-3 py-2.5 text-center">
                        <span
                          className="inline-flex items-center justify-center size-6 rounded-full text-[11px] font-extrabold text-white"
                          style={{ backgroundColor: gradeColor(r.grade) }}
                        >
                          {r.grade}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="w-14 h-1.5 rounded-full bg-hairline overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${r.score * 100}%`, backgroundColor: gradeColor(r.grade) }}
                            />
                          </div>
                          <span className="font-mono font-bold text-ink w-8">{(r.score * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono text-body">{r.tests_passed}/{r.tests_run}</td>
                      <td className="px-3 py-2.5 text-mute hidden md:table-cell">{r.last_tested}</td>
                      <td className="px-3 py-2.5 text-mute hidden lg:table-cell max-w-[220px] truncate">{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="shrink-0 border-t border-hairline px-5 py-2.5 bg-cream/50">
          <div className="text-[11px] text-mute">
            <strong>Methodology:</strong> Each skill tested on 10 real-world prompts. Score = correct outputs / total tests.
          </div>
        </div>
      </div>
    </div>
  );
}
