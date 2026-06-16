import type { WindowManager } from "../useWindows";
import { Eyebrow, YellowButton, GhostButton, Tag } from "./ui";

const features = [
  { icon: "⚡", name: "400+ Skills", desc: "Domain knowledge that activates automatically.", color: "#1d4aff", app: "skills" as const },
  { icon: "🤖", name: "182+ Agents", desc: "Specialist agents with scoped tools.", color: "#b62ad9", app: "agents" as const },
  { icon: "📦", name: "50 Stacks", desc: "Pre-wired workspaces for every role.", color: "#3fb950", app: "stacks" as const },
  { icon: "🔌", name: "41 MCP Configs", desc: "Ready-to-install server configs.", color: "#1078a3", app: "mcp" as const },
  { icon: "📚", name: "100+ Guides", desc: "In-depth docs for every feature.", color: "#f54e00", app: "guides" as const },
  { icon: "🌍", name: "5 Languages", desc: "EN, FR, DE, NL, ES localization.", color: "#f97316", app: "about" as const },
  { icon: "🪝", name: "48 Hooks", desc: "Event-driven automation for Claude Code.", color: "#1078a3", app: "hooks" as const },
  { icon: "📜", name: "32 Rules", desc: "Behavioral rules for consistent output.", color: "#b62ad9", app: "rules" as const },
  { icon: "⚡", name: "100 Commands", desc: "Slash commands for every workflow.", color: "#1d4aff", app: "commands" as const },
  { icon: "🔄", name: "55 Workflows", desc: "Multi-step processes across domains.", color: "#3fb950", app: "workflows" as const },
  { icon: "🧩", name: "22 Plugins", desc: "Bundle, domain & business extensions.", color: "#f5b800", app: "plugins" as const },
  { icon: "🎭", name: "10 Personas", desc: "Role-optimized AI behavior profiles.", color: "#b62ad9", app: "personas" as const },
];

const highlights = [
  {
    icon: "🟢",
    title: "Context & Cost Optimization",
    color: "#3fb950",
    pitch: "Stop paying Claude to read your lockfiles. Our ecosystem templates slash your token costs by 40-70% per request.",
    features: [".claudeignore Templates", "Context Compactor", "Caveman Mode"],
    audience: "CTOs & Power Users",
  },
  {
    icon: "🔵",
    title: "Resilience & Zero-Hallucination",
    color: "#1d4aff",
    pitch: "Zero syntax hallucinations. Claudient intercepts AI edits, runs your actual compiler, and forces the AI to fix its own typos before returning control.",
    features: ["Shadow Compiler", "Safe Commit Hook", "Spec-First Enforcer", "Chaos Monkey"],
    audience: "DevSecOps & QA Leads",
  },
  {
    icon: "🟣",
    title: "Enterprise Architecture",
    color: "#b62ad9",
    pitch: "Enterprise-grade architecture at intern-grade API costs. Use Opus for the blueprints, and Haiku for the bricks.",
    features: ["Grill Me", "Stunt Double", "Architect/Mason", "ADR Generator", "Historian", "Blast Radius", "Legacy Strangler"],
    audience: "Architects & Staff Engineers",
  },
  {
    icon: "🟠",
    title: "Multi-Agent Swarms",
    color: "#f54e00",
    pitch: "You don't need a chatbot, you need a team. Spawn an entire virtual engineering department to execute massive epics.",
    features: ["Night Shift", "Hive Orchestrator", "Tribunal Review", "Codebase Sweeper", "Time-Travel Debugger"],
    audience: "Lead Developers",
  },
  {
    icon: "🟡",
    title: "Environment & Context Engineering",
    color: "#f5b800",
    pitch: "Context windows aren't a problem when the AI dynamically injects exactly the dependencies it needs, just in time.",
    features: ["Auto-TDD Hook", "Dev Doctor", "JIT Context Injector"],
    audience: "Onboarding & Daily Contributors",
  },
];

export function HomeApp({ wm }: { wm: WindowManager }) {
  return (
    <div className="px-7 py-7 max-w-3xl mx-auto">
      <Eyebrow>The Claude Code knowledge system</Eyebrow>
      <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] text-ink">
        Stop explaining your stack to Claude <span className="text-brand-red">every session.</span>
      </h1>
      <p className="mt-4 text-[15px] text-body leading-relaxed">
        Claudient is the largest open-source knowledge base for Claude Code.
        400+ skills, 182+ agents, 50 workspace stacks — all installable in 30 seconds.
        Open any window below to explore. 🧠
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <YellowButton onClick={() => wm.open("install")}>Get Started →</YellowButton>
        <GhostButton onClick={() => wm.open("skills")}>Browse Skills</GhostButton>
        <GhostButton onClick={() => wm.open("agents")}>See Agents 🤖</GhostButton>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-[12px] text-mute">
        <Tag color="#3fb950">Open source</Tag>
        <Tag color="#1d4aff">AGPL-3.0 + CC-BY-SA-4.0</Tag>
        <Tag color="#f54e00">v1.10.1</Tag>
      </div>

      <h2 className="mt-9 text-lg font-bold text-ink">Everything Claude Code needs</h2>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        {features.map((f) => (
          <button
            key={f.name}
            onClick={() => wm.open(f.app)}
            className="text-left rounded-xl border border-hairline bg-white p-4 hover:border-olive/70 hover:-translate-y-0.5 transition"
          >
            <div className="flex items-start gap-3">
              <div className="grid place-items-center size-9 rounded-lg text-lg shrink-0" style={{ backgroundColor: f.color + "1a" }}>
                {f.icon}
              </div>
              <div>
                <div className="text-[14px] font-bold text-ink">{f.name}</div>
                <div className="text-[12.5px] text-mute mt-0.5">{f.desc}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 5 Feature Highlight Categories */}
      <h2 className="mt-9 text-lg font-bold text-ink">Tier-1 Enterprise AI Orchestrator</h2>
      <p className="mt-1 text-[12.5px] text-mute">22 advanced features that transform Claudient from a prompt library into a full orchestration platform.</p>
      <div className="mt-4 space-y-3">
        {highlights.map((h) => (
          <button
            key={h.title}
            onClick={() => wm.open("showcase")}
            className="w-full text-left rounded-xl border border-hairline bg-white p-4 hover:border-olive/70 hover:-translate-y-0.5 transition"
          >
            <div className="flex items-start gap-3">
              <div className="grid place-items-center size-10 rounded-lg text-xl shrink-0" style={{ backgroundColor: h.color + "1a" }}>
                {h.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[14px] font-bold text-ink">{h.title}</div>
                  <span className="text-[10px] font-semibold text-mute whitespace-nowrap">🎯 {h.audience}</span>
                </div>
                <p className="mt-1 text-[12px] text-body leading-relaxed">{h.pitch}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {h.features.map((f) => (
                    <span key={f} className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: h.color + "15", color: h.color }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-9 rounded-xl border border-olive/50 bg-cream p-5 flex items-start gap-4">
        <span className="text-5xl shrink-0">🧠</span>
        <div>
          <div className="text-[15px] font-bold text-ink">Built by the community, for the community</div>
          <p className="text-[12.5px] text-body mt-1 leading-relaxed">
            100% open source. Install via Plugin Marketplace, npm, or git clone.
            Multi-language support across 5 languages. The only multilingual Claude Code resource.
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            <a
              href="https://github.com/Claudient/Claudient"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-ink px-3 py-1.5 text-[12px] font-bold text-white hover:bg-body transition"
            >
              <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              Star on GitHub
            </a>
            <a
              href="https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#FF0000] px-3 py-1.5 text-[12px] font-bold text-white hover:bg-[#CC0000] transition"
            >
              <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              Subscribe on YouTube
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
