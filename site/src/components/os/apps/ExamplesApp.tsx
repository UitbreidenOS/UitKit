import { useState } from "react";
import { Eyebrow, Tag } from "./ui";

interface ClaudeMdExample {
  id: string;
  name: string;
  icon: string;
  color: string;
  desc: string;
  tech: string;
  snippet: string;
}

interface StarterProject {
  id: string;
  name: string;
  icon: string;
  color: string;
  desc: string;
  tech: string;
  files: string[];
  install: string;
}

const CLAUDE_MD_EXAMPLES: ClaudeMdExample[] = [
  { id: "nextjs-saas", name: "Next.js SaaS", icon: "▲", color: "#000000", desc: "Full SaaS app with auth, billing, and analytics.", tech: "Next.js 15 + TypeScript + Tailwind",
    snippet: "# CLAUDE.md for Next.js SaaS\n- Framework: Next.js 15 App Router\n- Database: Prisma + PostgreSQL\n- Auth: NextAuth.js v5\n- Styling: Tailwind CSS v4\n- Testing: Vitest + Playwright" },
  { id: "fastapi-ai", name: "FastAPI AI App", icon: "🐍", color: "#3776AB", desc: "AI inference API with model serving and rate limiting.", tech: "FastAPI + PyTorch + Redis",
    snippet: "# CLAUDE.md for FastAPI AI\n- Framework: FastAPI 0.115\n- ML: PyTorch 2.4 + Transformers\n- Cache: Redis 7\n- Queue: Celery + RabbitMQ" },
  { id: "cli-tool-rust", name: "CLI Tool (Rust)", icon: "🦀", color: "#CE422B", desc: "High-performance CLI tool with async I/O.", tech: "Rust + clap + tokio",
    snippet: "# CLAUDE.md for Rust CLI\n- Language: Rust 2021 edition\n- CLI: clap v4 derive API\n- Async: tokio runtime\n- Error handling: thiserror + anyhow" },
  { id: "data-pipeline-dbt", name: "dbt Data Pipeline", icon: "🔧", color: "#FF694B", desc: "Analytics engineering with dbt transformations.", tech: "dbt + Snowflake + Airflow",
    snippet: "# CLAUDE.md for dbt Pipeline\n- Tool: dbt-core 1.8\n- Warehouse: Snowflake\n- Orchestration: Airflow 2.9\n- Testing: dbt test + Great Expectations" },
  { id: "ai-agent-app", name: "AI Agent App", icon: "🤖", color: "#b62ad9", desc: "Multi-agent orchestration with tool use.", tech: "Python + LangChain + Anthropic SDK",
    snippet: "# CLAUDE.md for AI Agent App\n- Framework: LangChain 0.2\n- LLM: Claude 3.5 Sonnet\n- Tools: Tavily, Wikipedia, Python REPL\n- Memory: PostgreSQL-backed" },
  { id: "chrome-extension", name: "Chrome Extension", icon: "🌐", color: "#4285F4", desc: "Browser extension with MV3 and content scripts.", tech: "TypeScript + Chrome MV3",
    snippet: "# CLAUDE.md for Chrome Extension\n- Manifest: MV3\n- Build: Vite + CRXJS\n- Permissions: storage, tabs, scripting\n- UI: React 19 popup" },
  { id: "game-development", name: "Game Development", icon: "🎮", color: "#b62ad9", desc: "Game logic, physics, and multiplayer networking.", tech: "Unity/Godot + TypeScript",
    snippet: "# CLAUDE.md for Game Dev\n- Engine: Godot 4.2 / Unity 2023\n- Physics: built-in + custom\n- Networking: WebSocket + authoritative server" },
  { id: "microservices-k8s", name: "Microservices K8s", icon: "☸️", color: "#326CE5", desc: "Distributed services with K8s orchestration.", tech: "Go + Kubernetes + gRPC",
    snippet: "# CLAUDE.md for Microservices\n- Language: Go 1.22\n- Orchestration: Kubernetes 1.30\n- Communication: gRPC + Protobuf\n- Observability: OpenTelemetry" },
  { id: "mobile-react-native", name: "React Native Mobile", icon: "📱", color: "#61DAFB", desc: "Cross-platform mobile with Expo.", tech: "React Native + Expo + TypeScript",
    snippet: "# CLAUDE.md for React Native\n- Framework: Expo SDK 51\n- Navigation: Expo Router v3\n- State: Zustand\n- Testing: Jest + Detox" },
  { id: "monorepo-turborepo", name: "Monorepo (Turborepo)", icon: "📦", color: "#EF4444", desc: "Multi-package monorepo with shared configs.", tech: "Turborepo + pnpm workspaces",
    snippet: "# CLAUDE.md for Monorepo\n- Manager: pnpm workspaces\n- Build: Turborepo\n- Packages: shared UI, utils, config\n- CI: GitHub Actions matrix" },
];

const STARTER_PROJECTS: StarterProject[] = [
  {
    id: "agent-sdk",
    name: "Agent SDK",
    icon: "🤖",
    color: "#b62ad9",
    desc: "Build AI agents with tool use, memory, and orchestration.",
    tech: "Python + TypeScript",
    files: ["agent.py", "agent.ts", "requirements.txt", "package.json"],
    install: "cd examples/agent-sdk/python && pip install -r requirements.txt",
  },
  {
    id: "nextjs-saas",
    name: "Next.js SaaS",
    icon: "▲",
    color: "#000000",
    desc: "Production-ready SaaS starter with auth and billing.",
    tech: "Next.js 15 + TypeScript",
    files: ["CLAUDE.md", "package.json", "tailwind.config.ts"],
    install: "cd examples/nextjs-saas && npm install && npm run dev",
  },
  {
    id: "fastapi-ai-app",
    name: "FastAPI AI",
    icon: "🐍",
    color: "#3776AB",
    desc: "AI inference API with FastAPI and model serving.",
    tech: "Python + FastAPI",
    files: ["CLAUDE.md", "main.py", "requirements.txt"],
    install: "cd examples/fastapi-ai-app && pip install -r requirements.txt",
  },
  {
    id: "go-cli-tool",
    name: "Go CLI Tool",
    icon: "🦫",
    color: "#00ADD8",
    desc: "High-performance CLI tool with Go and cobra.",
    tech: "Go 1.22 + Cobra",
    files: ["CLAUDE.md", "main.go", "go.mod"],
    install: "cd examples/go-cli-tool && go build -o mycli .",
  },
  {
    id: "dbt-pipeline",
    name: "dbt Pipeline",
    icon: "🔧",
    color: "#FF694B",
    desc: "Analytics engineering with dbt transformations.",
    tech: "dbt + Snowflake",
    files: ["CLAUDE.md", "dbt_project.yml", "models/"],
    install: "cd examples/dbt-pipeline && dbt deps && dbt run",
  },
];

type Tab = "claude-md" | "starters" | "structures";

const STRUCTURE_CATEGORIES = [
  { name: "Web Apps", count: 85, examples: "nextjs-saas, react-dashboard, vue-spa..." },
  { name: "Backend APIs", count: 62, examples: "fastapi-crud, express-rest, django-api..." },
  { name: "Data & ML", count: 48, examples: "dbt-pipeline, ml-training, data-lake..." },
  { name: "DevOps & Infra", count: 55, examples: "k8s-cluster, terraform-modules, ci-cd..." },
  { name: "Mobile Apps", count: 38, examples: "react-native, flutter-app, ios-swift..." },
  { name: "AI & Agents", count: 42, examples: "agent-sdk, rag-system, llm-gateway..." },
  { name: "E-Commerce", count: 28, examples: "shopify-store, marketplace, payments..." },
  { name: "Embedded & IoT", count: 22, examples: "firmware-update, iot-gateway, sensor-hub..." },
  { name: "Blockchain & Web3", count: 15, examples: "smart-contract, defi-protocol, nft-market..." },
  { name: "Other", count: 15, examples: "documentation-site, chrome-extension, cli-tool..." },
];

export function ExamplesApp() {
  const [tab, setTab] = useState<Tab>("claude-md");
  const [selected, setSelected] = useState(CLAUDE_MD_EXAMPLES[0]);
  const [selectedStarter, setSelectedStarter] = useState(STARTER_PROJECTS[0]);

  return (
    <div className="h-full flex flex-col sm:flex-row">
      {/* Left sidebar */}
      <aside className="sm:w-52 shrink-0 border-r border-hairline bg-cream flex flex-col overflow-hidden">
        <div className="p-3">
          <Eyebrow color="#3fb950">Examples</Eyebrow>
        </div>
        <div className="px-2 pb-2 space-y-0.5">
          {(["claude-md", "starters", "structures"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`w-full text-left rounded-lg px-2.5 py-2 text-[12px] font-semibold transition capitalize ${
                tab === t ? "bg-white border border-hairline text-ink shadow-sm" : "text-body hover:bg-white/60"
              }`}
            >
              {t === "claude-md" ? "📝 CLAUDE.md" : t === "starters" ? "🚀 Starters" : "🏗️ Structures"}
            </button>
          ))}
        </div>
        {tab === "claude-md" && (
          <div className="flex-1 overflow-auto px-2 pb-2 space-y-0.5">
            {CLAUDE_MD_EXAMPLES.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelected(e)}
                className={`w-full text-left flex items-center gap-2 rounded-lg px-2.5 py-2 text-[12px] font-semibold transition ${
                  selected.id === e.id ? "bg-white border border-hairline text-ink shadow-sm" : "text-body hover:bg-white/60"
                }`}
              >
                <span>{e.icon}</span>
                <span className="truncate">{e.name}</span>
              </button>
            ))}
          </div>
        )}
        {tab === "starters" && (
          <div className="flex-1 overflow-auto px-2 pb-2 space-y-0.5">
            {STARTER_PROJECTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStarter(s)}
                className={`w-full text-left flex items-center gap-2 rounded-lg px-2.5 py-2 text-[12px] font-semibold transition ${
                  selectedStarter.id === s.id ? "bg-white border border-hairline text-ink shadow-sm" : "text-body hover:bg-white/60"
                }`}
              >
                <span>{s.icon}</span>
                <span className="truncate">{s.name}</span>
              </button>
            ))}
          </div>
        )}
        <div className="px-3 py-2.5 border-t border-hairline">
          <div className="text-[11px] font-bold text-ink">{CLAUDE_MD_EXAMPLES.length} examples</div>
          <div className="text-[10px] text-mute">{STARTER_PROJECTS.length} starter projects</div>
        </div>
      </aside>

      {/* Right pane */}
      <div className="flex-1 min-w-0 overflow-auto p-5">
        {tab === "claude-md" && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{selected.icon}</span>
              <div>
                <h2 className="text-lg font-extrabold text-ink">{selected.name}</h2>
                <Tag color={selected.color}>{selected.tech}</Tag>
              </div>
            </div>
            <p className="text-[13px] text-body leading-relaxed mb-4">{selected.desc}</p>

            <div className="mb-4">
              <div className="text-[11px] font-bold text-mute uppercase tracking-wider mb-2">CLAUDE.md Preview</div>
              <pre className="rounded-xl bg-code-bg text-code-text p-4 text-[11px] font-mono leading-relaxed whitespace-pre-wrap overflow-auto max-h-48">
                {selected.snippet}
              </pre>
            </div>

            <div className="rounded-lg border border-hairline bg-cream p-4">
              <div className="text-[11px] font-bold text-mute uppercase tracking-wider mb-1">Browse example</div>
              <pre className="text-[11px] font-mono text-ink">
                <code>{`cat claude-md-examples/${selected.id}.md`}</code>
              </pre>
            </div>
          </div>
        )}

        {tab === "starters" && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{selectedStarter.icon}</span>
              <div>
                <h2 className="text-lg font-extrabold text-ink">{selectedStarter.name}</h2>
                <Tag color={selectedStarter.color}>{selectedStarter.tech}</Tag>
              </div>
            </div>
            <p className="text-[13px] text-body leading-relaxed mb-4">{selectedStarter.desc}</p>

            <div className="mb-4">
              <div className="text-[11px] font-bold text-mute uppercase tracking-wider mb-2">Included Files</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedStarter.files.map((f) => (
                  <span key={f} className="inline-flex items-center rounded-md border border-hairline bg-white px-2.5 py-1 text-[11px] font-mono text-ink">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-[11px] font-bold text-mute uppercase tracking-wider mb-2">Get Started</div>
              <div className="rounded-xl bg-code-bg text-code-text px-4 py-3 text-[11px] font-mono overflow-auto">
                <code>{selectedStarter.install}</code>
              </div>
            </div>

            <a
              href="https://github.com/UitbreidenOS/Claudient/tree/main/examples"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-olive/60 bg-white px-3 py-1.5 text-[12px] font-semibold text-ink hover:bg-cream transition"
            >
              View on GitHub →
            </a>
          </div>
        )}

        {tab === "structures" && (
          <div>
            <h2 className="text-lg font-extrabold text-ink mb-1">Workspace Structures</h2>
            <p className="text-[12.5px] text-mute mb-4">410 blueprint templates for every project type. Drop into your repo and customize.</p>

            <div className="rounded-xl border border-hairline bg-white overflow-hidden mb-4">
              <table className="w-full text-[12px]">
                <thead className="bg-soft border-b border-hairline">
                  <tr>
                    <th className="text-left px-3 py-2 font-bold text-mute">Category</th>
                    <th className="text-center px-3 py-2 font-bold text-mute w-16">Count</th>
                    <th className="text-left px-3 py-2 font-bold text-mute hidden md:table-cell">Examples</th>
                  </tr>
                </thead>
                <tbody>
                  {STRUCTURE_CATEGORIES.map((c) => (
                    <tr key={c.name} className="border-t border-hairline hover:bg-cream/50">
                      <td className="px-3 py-2 font-semibold text-ink">{c.name}</td>
                      <td className="px-3 py-2 text-center font-mono text-brand-purple">{c.count}</td>
                      <td className="px-3 py-2 text-mute hidden md:table-cell text-[11px]">{c.examples}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="text-center rounded-xl border border-brand-orange/30 bg-orange-50 px-4 py-3">
                <div className="text-2xl font-extrabold text-brand-orange">410</div>
                <div className="text-[10px] text-mute font-bold">Total Blueprints</div>
              </div>
              <div className="text-center rounded-xl border border-hairline bg-white px-4 py-3">
                <div className="text-2xl font-extrabold text-ink">10</div>
                <div className="text-[10px] text-mute font-bold">Categories</div>
              </div>
              <div className="text-center rounded-xl border border-hairline bg-white px-4 py-3">
                <div className="text-2xl font-extrabold text-brand-blue">5</div>
                <div className="text-[10px] text-mute font-bold">Languages</div>
              </div>
            </div>

            <div className="rounded-lg border border-hairline bg-cream p-4">
              <div className="text-[11px] font-bold text-mute uppercase tracking-wider mb-1">Browse structures</div>
              <pre className="text-[11px] font-mono text-ink">
                <code>{"ls structures/ | head -20"}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
