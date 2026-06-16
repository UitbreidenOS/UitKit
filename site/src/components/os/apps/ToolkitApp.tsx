import { useState } from "react";
import { Eyebrow } from "./ui";

type Tab = "Themes" | "Statuslines" | "Keybindings" | "Output Styles" | "Routines" | "Settings";

const THEMES = [
  { name: "Claudient Brand", id: "claudient-brand", colors: ["#f5b800", "#f54e00", "#1d4aff"] },
  { name: "Catppuccin", id: "catppuccin", colors: ["#cba6f7", "#89b4fa", "#a6e3a1"] },
  { name: "Dracula", id: "dracula", colors: ["#bd93f9", "#ff79c6", "#50fa7b"] },
  { name: "Gruvbox", id: "gruvbox", colors: ["#fabd2f", "#fb4934", "#b8bb26"] },
  { name: "Monokai", id: "monokai", colors: ["#f92672", "#a6e22e", "#66d9ef"] },
  { name: "Nord", id: "nord", colors: ["#88c0d0", "#81a1c1", "#5e81ac"] },
  { name: "Rose Pine", id: "rose-pine", colors: ["#c4a7e7", "#eb6f92", "#f6c177"] },
  { name: "Solarized Dark", id: "solarized-dark", colors: ["#268bd2", "#b58900", "#dc322f"] },
  { name: "Solarized Light", id: "solarized-light", colors: ["#268bd2", "#b58900", "#2aa198"] },
  { name: "Tokyo Night", id: "tokyo-night", colors: ["#7aa2f7", "#bb9af7", "#9ece6a"] },
];

const STATUSLINES = [
  { name: "Minimal", id: "minimal", desc: "Clean statusline with just branch and file." },
  { name: "Cost Watch", id: "cost-watch", desc: "Real-time cost tracking per session." },
  { name: "Context Budget", id: "context-budget", desc: "Visual context window usage indicator." },
  { name: "Git Focused", id: "git-focused", desc: "Branch, status, last commit, and diff stats." },
  { name: "Full", id: "full", desc: "Everything: cost, git, context, model, tokens." },
  { name: "Rate Limit", id: "rate-limit", desc: "Rate limit countdown and usage warnings." },
];

const KEYBINDINGS = [
  { name: "Default", id: "default", desc: "Standard Claude Code keybindings." },
  { name: "Vim", id: "vim", desc: "Vim-style modal navigation and editing." },
  { name: "Emacs", id: "emacs", desc: "Emacs-style chord keybindings." },
  { name: "Power User", id: "power-user", desc: "Advanced shortcuts for power users." },
  { name: "Ergonomic", id: "ergonomic", desc: "Easy-reach keys to reduce strain." },
];

const OUTPUT_STYLES = [
  { name: "Concise", id: "concise", desc: "Short, direct responses. No preamble." },
  { name: "Code Reviewer", id: "code-reviewer", desc: "Structured review format with severity levels." },
  { name: "Architect", id: "architect", desc: "Architecture-first thinking with diagrams." },
  { name: "Diagram First", id: "diagram-first", desc: "Always start with visual diagrams." },
  { name: "Mentor", id: "mentor", desc: "Teaching tone with explanations and examples." },
  { name: "Plain Operator", id: "plain-operator", desc: "Minimal output, just execute the task." },
  { name: "Security Paranoid", id: "security-paranoid", desc: "Security-first analysis before any action." },
  { name: "TDD Enforcer", id: "tdd-enforcer", desc: "Test-first approach, no code without tests." },
];

const ROUTINES = [
  { name: "PR Triage", id: "pr-triage", desc: "Auto-triage PRs by size, risk, and reviewer." },
  { name: "Dependency Audit", id: "dependency-audit", desc: "Weekly dependency vulnerability scan." },
  { name: "Daily Standup", id: "daily-standup", desc: "Generate standup notes from git activity." },
  { name: "Weekly Retro", id: "weekly-retro", desc: "Compile weekly retrospective report." },
  { name: "Sprint Planning", id: "sprint-planning", desc: "Prioritize and scope sprint backlog." },
  { name: "Security Scan", id: "security-scan", desc: "Scheduled security scan with alerts." },
  { name: "Cost Audit", id: "cost-audit", desc: "Review token usage and cost optimization." },
  { name: "Incident Watch", id: "incident-watch", desc: "Monitor for recurring incident patterns." },
];

const SETTINGS = [
  { name: "Minimal", id: "minimal", desc: "Bare minimum settings for quick start." },
  { name: "Standard", id: "standard", desc: "Recommended settings for most projects." },
  { name: "Enterprise", id: "enterprise", desc: "Full governance with audit and compliance." },
  { name: "Open Source", id: "open-source", desc: "Settings optimized for OSS contributors." },
  { name: "Agency", id: "agency", desc: "Multi-client settings with project isolation." },
];

const TAB_ICONS: Record<Tab, string> = {
  Themes: "🎨", Statuslines: "📊", Keybindings: "⌨️", "Output Styles": "💬", Routines: "🔄", Settings: "⚙️",
};

export function ToolkitApp() {
  const [tab, setTab] = useState<Tab>("Themes");
  const tabs: Tab[] = ["Themes", "Statuslines", "Keybindings", "Output Styles", "Routines", "Settings"];

  return (
    <div className="flex h-full">
      <div className="w-[170px] border-r border-hairline bg-cream/50 p-3 overflow-y-auto shrink-0">
        <Eyebrow color="#f54e00">Toolkit</Eyebrow>
        <div className="mt-3 space-y-0.5">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`w-full text-left rounded-md px-2.5 py-1.5 text-[12px] flex items-center gap-2 transition ${tab === t ? "bg-white font-bold text-ink shadow-sm" : "text-body hover:bg-white/50"}`}>
              <span>{TAB_ICONS[t]}</span> {t}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <Eyebrow color="#f54e00">UI Toolkit</Eyebrow>
        <h2 className="text-lg font-bold text-ink mt-1 mb-4">{tab}</h2>

        {tab === "Themes" && (
          <div className="grid sm:grid-cols-2 gap-3">
            {THEMES.map((t) => (
              <div key={t.id} className="rounded-lg border border-hairline bg-white p-3 hover:border-olive/70 transition">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-ink">{t.name}</span>
                  <code className="text-[10px] text-mute font-mono">{t.id}</code>
                </div>
                <div className="mt-2 flex gap-1">
                  {t.colors.map((c, i) => (
                    <div key={i} className="size-5 rounded-md" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Statuslines" && (
          <div className="space-y-2">
            {STATUSLINES.map((s) => (
              <div key={s.id} className="rounded-lg border border-hairline bg-white p-3 hover:border-olive/70 transition">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-ink">{s.name}</span>
                  <code className="text-[10px] text-mute font-mono">{s.id}.sh</code>
                </div>
                <p className="mt-1 text-[12px] text-mute">{s.desc}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "Keybindings" && (
          <div className="space-y-2">
            {KEYBINDINGS.map((k) => (
              <div key={k.id} className="rounded-lg border border-hairline bg-white p-3 hover:border-olive/70 transition">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-ink">{k.name}</span>
                  <code className="text-[10px] text-mute font-mono">{k.id}.json</code>
                </div>
                <p className="mt-1 text-[12px] text-mute">{k.desc}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "Output Styles" && (
          <div className="grid sm:grid-cols-2 gap-2">
            {OUTPUT_STYLES.map((o) => (
              <div key={o.id} className="rounded-lg border border-hairline bg-white p-3 hover:border-olive/70 transition">
                <span className="text-[13px] font-bold text-ink">{o.name}</span>
                <p className="mt-1 text-[12px] text-mute">{o.desc}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "Routines" && (
          <div className="space-y-2">
            {ROUTINES.map((r) => (
              <div key={r.id} className="rounded-lg border border-hairline bg-white p-3 hover:border-olive/70 transition">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-ink">{r.name}</span>
                  <code className="text-[10px] text-mute font-mono">{r.id}.md</code>
                </div>
                <p className="mt-1 text-[12px] text-mute">{r.desc}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "Settings" && (
          <div className="space-y-2">
            {SETTINGS.map((s) => (
              <div key={s.id} className="rounded-lg border border-hairline bg-white p-3 hover:border-olive/70 transition">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-ink">{s.name}</span>
                  <code className="text-[10px] text-mute font-mono">{s.id}.json</code>
                </div>
                <p className="mt-1 text-[12px] text-mute">{s.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
