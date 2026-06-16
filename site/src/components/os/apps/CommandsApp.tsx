import { useState } from "react";
import { Eyebrow } from "./ui";

interface Cmd { name: string; cat: string; desc: string; }

const CMDS: Cmd[] = [
  // AI Engineering (6)
  { name: "agent-scaffold", cat: "AI Engineering", desc: "Scaffold a new agent with tools, memory, and system prompt." },
  { name: "eval-harness", cat: "AI Engineering", desc: "Set up evaluation harness for testing LLM outputs." },
  { name: "mcp-server-gen", cat: "AI Engineering", desc: "Generate MCP server boilerplate from API spec." },
  { name: "prompt-improve", cat: "AI Engineering", desc: "Refine prompts using chain-of-thought and few-shot examples." },
  { name: "rag-setup", cat: "AI Engineering", desc: "Configure RAG pipeline with embeddings and retrieval." },
  { name: "token-optimize", cat: "AI Engineering", desc: "Analyze and reduce token usage in prompts." },
  // API (8)
  { name: "endpoint-gen", cat: "API", desc: "Generate REST endpoint with validation and error handling." },
  { name: "error-schema", cat: "API", desc: "Design standardized error response schema." },
  { name: "openapi-spec", cat: "API", desc: "Generate OpenAPI 3.0 spec from existing routes." },
  { name: "pagination", cat: "API", desc: "Implement cursor or offset pagination." },
  { name: "rate-limit", cat: "API", desc: "Add rate limiting middleware with token bucket." },
  { name: "sdk-gen", cat: "API", desc: "Generate client SDK from API specification." },
  { name: "versioning-plan", cat: "API", desc: "Plan API versioning strategy with migration guide." },
  { name: "webhook-handler", cat: "API", desc: "Build webhook receiver with signature verification." },
  // Database (8)
  { name: "backup-plan", cat: "Database", desc: "Design backup strategy with RPO/RTO targets." },
  { name: "er-diagram", cat: "Database", desc: "Generate entity-relationship diagram from schema." },
  { name: "index-advisor", cat: "Database", desc: "Analyze queries and suggest optimal indexes." },
  { name: "migration-gen", cat: "Database", desc: "Generate safe migration with rollback plan." },
  { name: "n-plus-one-finder", cat: "Database", desc: "Detect and fix N+1 query patterns." },
  { name: "query-optimize", cat: "Database", desc: "Rewrite slow queries with EXPLAIN analysis." },
  { name: "schema-review", cat: "Database", desc: "Review schema for normalization and constraints." },
  { name: "seed-data", cat: "Database", desc: "Generate realistic seed data for development." },
  // Debug (8)
  { name: "add-logging", cat: "Debug", desc: "Add structured logging to trace execution flow." },
  { name: "bisect-helper", cat: "Debug", desc: "Automate git bisect to find regression commits." },
  { name: "explain-error", cat: "Debug", desc: "Decode cryptic error messages with root cause." },
  { name: "memory-leak", cat: "Debug", desc: "Identify and fix memory leak patterns." },
  { name: "perf-profile", cat: "Debug", desc: "Profile application and identify bottlenecks." },
  { name: "race-condition", cat: "Debug", desc: "Detect and resolve race conditions." },
  { name: "repro-steps", cat: "Debug", desc: "Generate minimal reproduction steps from logs." },
  { name: "stacktrace-analyze", cat: "Debug", desc: "Parse and explain stack traces with fix suggestions." },
  // DevOps (10)
  { name: "ci-pipeline", cat: "DevOps", desc: "Generate CI pipeline with test, lint, build stages." },
  { name: "compose-gen", cat: "DevOps", desc: "Generate docker-compose for multi-service setups." },
  { name: "dockerfile-gen", cat: "DevOps", desc: "Create optimized multi-stage Dockerfile." },
  { name: "env-audit", cat: "DevOps", desc: "Audit environment variables for consistency." },
  { name: "github-action", cat: "DevOps", desc: "Create GitHub Action workflow from requirements." },
  { name: "healthcheck", cat: "DevOps", desc: "Add health check endpoints and monitoring." },
  { name: "helm-chart", cat: "DevOps", desc: "Generate Helm chart with configurable values." },
  { name: "k8s-manifest", cat: "DevOps", desc: "Create Kubernetes manifests with best practices." },
  { name: "rollback-plan", cat: "DevOps", desc: "Design rollback procedure for deployments." },
  { name: "terraform-module", cat: "DevOps", desc: "Create reusable Terraform module with variables." },
  // Docs (8)
  { name: "adr-write", cat: "Docs", desc: "Write Architecture Decision Record with context." },
  { name: "api-docs", cat: "Docs", desc: "Generate API documentation from code annotations." },
  { name: "architecture-doc", cat: "Docs", desc: "Create system architecture document with diagrams." },
  { name: "comment-explain", cat: "Docs", desc: "Add explanatory comments to complex code sections." },
  { name: "contributing-gen", cat: "Docs", desc: "Generate CONTRIBUTING.md with project standards." },
  { name: "docstring-add", cat: "Docs", desc: "Add docstrings to functions with param/return types." },
  { name: "onboarding-doc", cat: "Docs", desc: "Create developer onboarding guide." },
  { name: "readme-gen", cat: "Docs", desc: "Generate comprehensive README from project analysis." },
  // Frontend (8)
  { name: "a11y-audit", cat: "Frontend", desc: "Audit accessibility and fix WCAG violations." },
  { name: "component-gen", cat: "Frontend", desc: "Generate React/Vue component with props and tests." },
  { name: "css-cleanup", cat: "Frontend", desc: "Remove unused CSS and consolidate duplicate styles." },
  { name: "form-validation", cat: "Frontend", desc: "Add client-side form validation with error messages." },
  { name: "lighthouse-pass", cat: "Frontend", desc: "Optimize for Lighthouse performance score." },
  { name: "responsive-fix", cat: "Frontend", desc: "Fix responsive layout issues across breakpoints." },
  { name: "state-refactor", cat: "Frontend", desc: "Refactor state management for clarity and performance." },
  { name: "storybook-gen", cat: "Frontend", desc: "Generate Storybook stories for components." },
  // Git (10)
  { name: "blame-explain", cat: "Git", desc: "Explain git blame context for code sections." },
  { name: "branch-cleanup", cat: "Git", desc: "Clean up stale branches and squash merge." },
  { name: "changelog", cat: "Git", desc: "Generate changelog from commit history." },
  { name: "commit-msg", cat: "Git", desc: "Write conventional commit message from diff." },
  { name: "conflict-resolver", cat: "Git", desc: "Resolve merge conflicts with context-aware strategy." },
  { name: "gitignore-gen", cat: "Git", desc: "Generate .gitignore for project tech stack." },
  { name: "pr-description", cat: "Git", desc: "Write PR description with summary and test plan." },
  { name: "rebase-helper", cat: "Git", desc: "Interactive rebase with conflict resolution." },
  { name: "release-notes", cat: "Git", desc: "Generate release notes with breaking changes." },
  { name: "squash-guide", cat: "Git", desc: "Guide for squashing commits into logical units." },
  // Productivity (6)
  { name: "decision-doc", cat: "Productivity", desc: "Document decision with options and trade-offs." },
  { name: "email-draft", cat: "Productivity", desc: "Draft professional email from bullet points." },
  { name: "meeting-summary", cat: "Productivity", desc: "Summarize meeting notes with action items." },
  { name: "standup-notes", cat: "Productivity", desc: "Generate standup update from git log." },
  { name: "task-breakdown", cat: "Productivity", desc: "Break epic into actionable tasks with estimates." },
  { name: "weekly-review", cat: "Productivity", desc: "Compile weekly accomplishments from commits/PRs." },
  // Refactor (10)
  { name: "dedupe", cat: "Refactor", desc: "Find and eliminate duplicate code across codebase." },
  { name: "extract-function", cat: "Refactor", desc: "Extract reusable function from inline code." },
  { name: "inline", cat: "Refactor", desc: "Inline unnecessary abstractions for clarity." },
  { name: "modernize-syntax", cat: "Refactor", desc: "Update to modern language syntax patterns." },
  { name: "reduce-complexity", cat: "Refactor", desc: "Reduce cyclomatic complexity of functions." },
  { name: "remove-dead-code", cat: "Refactor", desc: "Identify and remove unreachable dead code." },
  { name: "rename-symbol", cat: "Refactor", desc: "Rename symbol across all references safely." },
  { name: "simplify", cat: "Refactor", desc: "Simplify overly clever or complex logic." },
  { name: "split-file", cat: "Refactor", desc: "Split large file into focused modules." },
  { name: "tighten-types", cat: "Refactor", desc: "Replace any/unknown with precise types." },
  // Security (8)
  { name: "authz-review", cat: "Security", desc: "Review authorization logic for privilege escalation." },
  { name: "cors-config", cat: "Security", desc: "Configure CORS with least-privilege origins." },
  { name: "dep-audit", cat: "Security", desc: "Audit dependencies for known vulnerabilities." },
  { name: "input-validation", cat: "Security", desc: "Add input validation and sanitization." },
  { name: "owasp-check", cat: "Security", desc: "Check code against OWASP Top 10 vulnerabilities." },
  { name: "secret-scan", cat: "Security", desc: "Scan codebase for hardcoded secrets and keys." },
  { name: "security-scan", cat: "Security", desc: "Full security scan with remediation plan." },
  { name: "threat-model", cat: "Security", desc: "Create threat model with STRIDE analysis." },
  // Testing (10)
  { name: "assertion-improve", cat: "Testing", desc: "Strengthen test assertions for better coverage." },
  { name: "e2e-scaffold", cat: "Testing", desc: "Scaffold end-to-end test with Playwright/Cypress." },
  { name: "fix-failing-test", cat: "Testing", desc: "Diagnose and fix failing tests." },
  { name: "flaky-finder", cat: "Testing", desc: "Identify and fix flaky tests." },
  { name: "mock-gen", cat: "Testing", desc: "Generate mocks for external dependencies." },
  { name: "snapshot-review", cat: "Testing", desc: "Review snapshot test diffs for regressions." },
  { name: "tdd-start", cat: "Testing", desc: "Start TDD cycle with failing test first." },
  { name: "test-coverage", cat: "Testing", desc: "Analyze coverage gaps and suggest missing tests." },
  { name: "test-plan", cat: "Testing", desc: "Create test plan with scenarios and edge cases." },
  { name: "write-tests", cat: "Testing", desc: "Write unit/integration tests for existing code." },
];

const CAT_COLORS: Record<string, string> = {
  "AI Engineering": "#1078a3", API: "#1d4aff", Database: "#3fb950", Debug: "#ef4444",
  DevOps: "#f54e00", Docs: "#b62ad9", Frontend: "#f5b800", Git: "#76786c",
  Productivity: "#1078a3", Refactor: "#1d4aff", Security: "#ef4444", Testing: "#3fb950",
};

export function CommandsApp() {
  const cats = ["All", ...new Set(CMDS.map((c) => c.cat))];
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const filtered = CMDS.filter((c) => {
    if (filter !== "All" && c.cat !== filter) return false;
    if (search && !c.name.includes(search.toLowerCase()) && !c.desc.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const catCounts = cats.map((c) => ({ name: c, count: c === "All" ? CMDS.length : CMDS.filter((x) => x.cat === c).length }));

  return (
    <div className="flex h-full">
      <div className="w-[180px] border-r border-hairline bg-cream/50 p-3 overflow-y-auto shrink-0">
        <Eyebrow color="#1d4aff">Category</Eyebrow>
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
        <div className="flex items-center justify-between mb-3">
          <div>
            <Eyebrow color="#1d4aff">Slash Commands</Eyebrow>
            <h2 className="text-lg font-bold text-ink mt-1">{filtered.length} commands</h2>
          </div>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
            className="rounded-md border border-hairline bg-white px-3 py-1.5 text-[12px] w-48 focus:outline-none focus:ring-2 focus:ring-brand-blue/30" />
        </div>
        <div className="space-y-1.5">
          {filtered.map((c) => (
            <div key={c.name + c.cat} className="flex items-center gap-3 rounded-lg border border-hairline bg-white px-3 py-2 hover:border-olive/70 transition">
              <code className="text-[12px] font-mono font-bold text-brand-blue shrink-0">/{c.name}</code>
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold text-white shrink-0" style={{ backgroundColor: CAT_COLORS[c.cat] || "#76786c" }}>{c.cat}</span>
              <span className="text-[12px] text-mute truncate">{c.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
