import { useState, useEffect } from "react";
import { Eyebrow } from "./ui";

type Tab = "Themes" | "Statuslines" | "Keybindings" | "Output Styles" | "Routines" | "Settings" | "Playground" | "Harness" | "Codebase Map";

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
  { name: "Ghost Shell", id: "ghost-shell", colors: ["#c0c0c0", "#4a4a4a", "#00ff41"] },
  { name: "Claudient Neon", id: "claudient-neon", colors: ["#00ff41", "#ff00ff", "#00ffff"] },
];

const STATUSLINES = [
  { name: "Minimal", id: "minimal", desc: "Clean statusline with just branch and file." },
  { name: "Cost Watch", id: "cost-watch", desc: "Real-time cost tracking per session." },
  { name: "Context Budget", id: "context-budget", desc: "Visual context window usage indicator." },
  { name: "Git Focused", id: "git-focused", desc: "Branch, status, last commit, and diff stats." },
  { name: "Full", id: "full", desc: "Everything: cost, git, context, model, tokens." },
  { name: "Rate Limit", id: "rate-limit", desc: "Rate limit countdown and usage warnings." },
  { name: "Pulse", id: "pulse", desc: "Real-time swarm status, context budget, and map density." },
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
  { name: "Shadow PR", id: "shadow-pr", desc: "Generate shadow refactored branch for continuous quality." },
  { name: "Code Review Rotation", id: "code-review-rotation", desc: "Auto-rotate reviewers across PRs to distribute load." },
  { name: "Changelog Generator", id: "changelog-generator", desc: "Auto-generate structured changelogs from git history." },
];

const SETTINGS = [
  { name: "Minimal", id: "minimal", desc: "Bare minimum settings for quick start." },
  { name: "Standard", id: "standard", desc: "Recommended settings for most projects." },
  { name: "Enterprise", id: "enterprise", desc: "Full governance with audit and compliance." },
  { name: "Open Source", id: "open-source", desc: "Settings optimized for OSS contributors." },
  { name: "Agency", id: "agency", desc: "Multi-client settings with project isolation." },
];

const CODEBASE_MAP = {
  nodes: [
    { id: "scripts/cli.js", label: "cli.js", group: "CLI", x: 60, y: 50, color: "#f54e00", functions: ["initCommand", "doctorCommand", "auditCommand", "scoreCommand"], imports: ["fs", "path", "os", "child_process"] },
    { id: "scripts/council.js", label: "council.js", group: "CLI", x: 60, y: 150, color: "#f54e00", functions: ["main", "parseClaudeMd", "promptObjective"], imports: ["fs", "path", "readline"] },
    { id: "scripts/chart.js", label: "chart.js", group: "CLI", x: 60, y: 250, color: "#f54e00", functions: ["main", "walk", "parseFile"], imports: ["fs", "path"] },
    { id: "scripts/translate-assets.js", label: "translate.js", group: "CLI", x: 60, y: 350, color: "#f54e00", functions: ["translateFile", "main"], imports: ["fs", "path"] },
    
    { id: "index.json", label: "index.json", group: "Core Data", x: 200, y: 100, color: "#1078a3", functions: [], imports: [] },
    { id: "professional-stacks", label: "stacks/", group: "Core Data", x: 200, y: 280, color: "#1078a3", functions: [], imports: [] },
    
    { id: "site/src/components/os/ClaudientOS.tsx", label: "ClaudientOS.tsx", group: "Website", x: 350, y: 50, color: "#b62ad9", functions: ["ClaudientOS"], imports: ["React", "useWindows"] },
    { id: "site/src/components/os/apps/CliApp.tsx", label: "CliApp.tsx", group: "Website", x: 350, y: 150, color: "#b62ad9", functions: ["CliApp"], imports: ["React", "ui"] },
    { id: "site/src/components/os/apps/SwarmApp.tsx", label: "SwarmApp.tsx", group: "Website", x: 350, y: 250, color: "#b62ad9", functions: ["SwarmApp"], imports: ["React", "ui"] },
    { id: "site/src/components/os/apps/ToolkitApp.tsx", label: "ToolkitApp.tsx", group: "Website", x: 350, y: 350, color: "#b62ad9", functions: ["ToolkitApp"], imports: ["React"] },
  ],
  links: [
    { source: "scripts/cli.js", target: "scripts/council.js" },
    { source: "scripts/cli.js", target: "scripts/chart.js" },
    { source: "scripts/cli.js", target: "scripts/translate-assets.js" },
    { source: "scripts/council.js", target: "professional-stacks" },
    { source: "site/src/components/os/ClaudientOS.tsx", target: "site/src/components/os/apps/CliApp.tsx" },
    { source: "site/src/components/os/ClaudientOS.tsx", target: "site/src/components/os/apps/SwarmApp.tsx" },
    { source: "site/src/components/os/ClaudientOS.tsx", target: "site/src/components/os/apps/ToolkitApp.tsx" },
  ]
};

const TAB_ICONS: Record<Tab, string> = {
  Themes: "🎨", Statuslines: "📊", Keybindings: "⌨️", "Output Styles": "💬", Routines: "🔄", Settings: "⚙️", Playground: "🎮", Harness: "🔗", "Codebase Map": "🗺️",
};

export function ToolkitApp() {
  const [tab, setTab] = useState<Tab>("Themes");
  const [currentTheme, setCurrentTheme] = useState("claudient-brand");
  const tabs: Tab[] = ["Themes", "Statuslines", "Keybindings", "Output Styles", "Routines", "Settings", "Playground", "Harness", "Codebase Map"];

  useEffect(() => {
    const saved = localStorage.getItem("claudient-theme") || "claudient-brand";
    setCurrentTheme(saved);
  }, []);

  const handleThemeSelect = (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem("claudient-theme", themeId);
    document.documentElement.setAttribute("data-theme", themeId);
  };

  const [selectedStatusline, setSelectedStatusline] = useState("cost-watch");
  const [simCost, setSimCost] = useState(0.42);
  const [simAdded, setSimAdded] = useState(120);
  const [simRemoved, setSimRemoved] = useState(40);
  const [simCtx, setSimCtx] = useState(28);
  const [simTokens, setSimTokens] = useState(56000);
  const [simRateLimit, setSimRateLimit] = useState(15);
  const [simBranch, setSimBranch] = useState("main");
  const [simFile, setSimFile] = useState("index.ts");

  const [pgCost, setPgCost] = useState(0.42);
  const [pgAdded, setPgAdded] = useState(120);
  const [pgRemoved, setPgRemoved] = useState(40);
  const [pgCtx, setPgCtx] = useState(28);
  const [pgMcp, setPgMcp] = useState(2);
  const [pgPreset, setPgPreset] = useState("cost-watch");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("scripts/cli.js");

  const renderPlaygroundLine = () => {
    const ctxColor = pgCtx >= 80 ? "text-red-400 font-bold" : pgCtx >= 50 ? "text-yellow-400" : "text-emerald-400";
    const makeBar = (pct: number, w = 10) => "▓".repeat(Math.max(0, Math.round((pct/100)*w))) + "░".repeat(Math.max(0, w - Math.round((pct/100)*w)));
    switch (pgPreset) {
      case "minimal": return <span>[<span className="text-sky-400">main</span>] index.ts</span>;
      case "cost-watch": return <span><span className="text-emerald-400 font-semibold">${pgCost.toFixed(2)}</span> | <span className="text-cyan-400">+{pgAdded}/-{pgRemoved} lines</span> | <span className={ctxColor}>CTX {pgCtx}%</span> | MCP: <span className="text-purple-400">{pgMcp}</span></span>;
      case "context-budget": return <span>CTX [<span className={ctxColor}>{makeBar(pgCtx)}</span>] <span className={ctxColor}>{pgCtx}%</span> | <span className="text-purple-400">{(pgCtx * 2000).toLocaleString()}</span>/200K tokens</span>;
      case "full": return <span><span className="text-indigo-400">[sonnet]</span> claudient:<span className="text-sky-400">main</span> | <span className="text-emerald-400 font-semibold">${pgCost.toFixed(2)}</span> | <span className="text-cyan-400">+{pgAdded}/-{pgRemoved}</span> | [<span className={ctxColor}>{makeBar(pgCtx)}</span>] {pgCtx}% | MCP:<span className="text-purple-400">{pgMcp}</span></span>;
      case "pulse": return <span>Swarm: <span className="text-emerald-400 font-semibold">{pgMcp} active</span> | Density: <span className="text-purple-400">{Math.min(99, pgCtx + 20)}%</span> | Budget: <span className="text-emerald-400">${pgCost.toFixed(2)}</span> | CTX: [<span className={ctxColor}>{makeBar(pgCtx)}</span>]</span>;
      default: return <span><span className="text-emerald-400">${pgCost.toFixed(2)}</span> | CTX {pgCtx}%</span>;
    }
  };

  const renderStatuslinePreview = () => {
    const ctxColor = simCtx >= 80 ? "text-red-500 font-bold" : simCtx >= 50 ? "text-yellow-500" : "text-emerald-500";
    
    const makeBar = (pct: number, width = 10) => {
      const filled = Math.round((pct / 100) * width);
      const empty = width - filled;
      return "▓".repeat(Math.max(0, filled)) + "░".repeat(Math.max(0, empty));
    };

    switch (selectedStatusline) {
      case "minimal":
        return (
          <span>
            [<span className="text-sky-400 font-medium">{simBranch}</span>] {simFile}
          </span>
        );
      case "cost-watch":
        return (
          <span>
            <span className="text-emerald-500 font-semibold">${simCost.toFixed(2)}</span>
            {" | "}
            <span className="text-cyan-400">+{simAdded}/-{simRemoved} lines</span>
            {" | "}
            <span className={ctxColor}>CTX {simCtx}%</span>
          </span>
        );
      case "context-budget":
        return (
          <span>
            CTX [<span className={ctxColor}>{makeBar(simCtx)}</span>] <span className={ctxColor}>{simCtx}%</span>
            {" | "}
            <span className="text-purple-400">{(simTokens / 1000).toFixed(0)}K</span>/200K tokens
          </span>
        );
      case "git-focused":
        return (
          <span>
            [<span className="text-sky-400 font-medium">{simBranch}</span>] <span className="text-yellow-500">●</span> 1 commit ahead | <span className="text-cyan-400">+{simAdded}/-{simRemoved}</span>
          </span>
        );
      case "full":
        return (
          <span>
            <span className="text-indigo-400">[sonnet]</span> claudient:<span className="text-sky-400">{simBranch}</span>
            {" | "}
            <span className="text-emerald-500 font-semibold">${simCost.toFixed(2)}</span>
            {" | "}
            <span className="text-cyan-400">+{simAdded}/-{simRemoved}</span>
            {" | "}
            <span className="text-slate-400">[{makeBar(simCtx)}] {simCtx}%</span>
          </span>
        );
      case "rate-limit":
        return (
          <span>
            5h: [<span className="text-amber-500">{makeBar(simRateLimit * 6.6, 10)}</span>] <span className="text-amber-500">{Math.round(simRateLimit * 6.6)}%</span>
            {" | "}
            <span className="text-indigo-400">[sonnet]</span> <span className="text-emerald-500">${simCost.toFixed(2)}</span>
          </span>
        );
      case "pulse":
        return (
          <span>
            Swarm: <span className="text-emerald-500 font-semibold">2 active</span> | Density: <span className="text-purple-400">84%</span> | Budget: <span className="text-emerald-500">${simCost.toFixed(2)}</span>
          </span>
        );
      default:
        return <span>Unknown statusline</span>;
    }
  };

  const selectedNode = CODEBASE_MAP.nodes.find(n => n.id === selectedNodeId) || CODEBASE_MAP.nodes[0];

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
      <div className="flex-1 p-4 overflow-y-auto min-w-0">
        <Eyebrow color="#f54e00">UI Toolkit</Eyebrow>
        <h2 className="text-lg font-bold text-ink mt-1 mb-4">{tab}</h2>

        {tab === "Themes" && (
          <div className="grid sm:grid-cols-2 gap-3">
            {THEMES.map((t) => {
              const isSelected = currentTheme === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => handleThemeSelect(t.id)}
                  className={`rounded-lg border p-3 cursor-pointer transition ${
                    isSelected
                      ? "border-brand-yellow ring-2 ring-brand-yellow/30 bg-cream/30"
                      : "border-hairline bg-white hover:border-olive/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-ink flex items-center gap-1.5">
                      {t.name}
                      {isSelected && (
                        <span className="text-[10px] bg-brand-yellow/20 text-brand-orange px-1.5 py-0.5 rounded-full font-bold">
                          Active
                        </span>
                      )}
                    </span>
                    <code className="text-[10px] text-mute font-mono">{t.id}</code>
                  </div>
                  <div className="mt-2 flex gap-1">
                    {t.colors.map((c, i) => (
                      <div key={i} className="size-5 rounded-md" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              );
            })}
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

        {tab === "Playground" && (
          <div>
            <p className="text-[12px] text-mute mb-4">Adjust the sliders to see a live statusline preview. Download or copy the config when ready.</p>
            <div className="rounded-lg bg-[#1a1b26] p-4 font-mono text-[12px] text-slate-300 mb-4">
              <div className="text-slate-500 text-[10px] mb-2"># statusline preview ({pgPreset})</div>
              <div>{renderPlaygroundLine()}</div>
            </div>
            <div className="flex gap-2 mb-5">
              <button onClick={() => {
                const config = `# Claudient Statusline — ${pgPreset}\n# Generated by Claudient Toolkit\nCLAUDIENT_PRESET="${pgPreset}"\nCLAUDIENT_SHOW_COST=true\nCLAUDIENT_SHOW_CONTEXT=true\nCLAUDIENT_SHOW_MCP=true\nCLAUDIENT_CONTEXT_WARN=${pgCtx >= 80 ? 80 : pgCtx >= 50 ? 50 : 80}\n# Install: cp statusline-${pgPreset}.sh ~/.claude/statusline.sh`;
                const blob = new Blob([config], { type: "text/plain" });
                const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `statusline-${pgPreset}.sh`; a.click();
              }} className="rounded-md bg-brand-orange text-white px-3 py-1.5 text-[11px] font-bold hover:brightness-105 transition">⬇ Download .sh</button>
              <button onClick={() => {
                navigator.clipboard.writeText(`CLAUDIENT_PRESET="${pgPreset}"\nCLAUDIENT_SHOW_COST=true\nCLAUDIENT_SHOW_CONTEXT=true\nCLAUDIENT_SHOW_MCP=true`);
              }} className="rounded-md border border-hairline bg-white px-3 py-1.5 text-[11px] font-bold text-ink hover:bg-cream transition">📋 Copy Config</button>
            </div>
            <div className="mb-4">
              <label className="text-[11px] font-bold text-mute uppercase tracking-wider">Preset</label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {["minimal","cost-watch","context-budget","full","pulse"].map((p) => (
                  <button key={p} onClick={() => setPgPreset(p)}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${pgPreset === p ? "bg-brand-orange text-white" : "bg-cream text-body hover:bg-white"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: "Session Cost", value: pgCost, set: setPgCost, min: 0, max: 10, step: 0.01, fmt: `$${pgCost.toFixed(2)}` },
                { label: "Lines Added", value: pgAdded, set: setPgAdded, min: 0, max: 1000, step: 10, fmt: `+${pgAdded}` },
                { label: "Lines Removed", value: pgRemoved, set: setPgRemoved, min: 0, max: 500, step: 5, fmt: `-${pgRemoved}` },
                { label: "Context Utilization", value: pgCtx, set: setPgCtx, min: 0, max: 100, step: 1, fmt: `${pgCtx}%` },
                { label: "Active MCP Servers", value: pgMcp, set: setPgMcp, min: 0, max: 8, step: 1, fmt: `${pgMcp}` },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[12px] font-semibold text-ink">{s.label}</span>
                    <span className="text-[11px] font-mono text-brand-purple">{s.fmt}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                    onChange={(e) => s.set(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none bg-cream accent-brand-orange cursor-pointer" />
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Harness" && (
          <div>
            <p className="text-[12.5px] text-body leading-relaxed mb-5">
              Claudient is <strong>harness-neutral</strong> — works with Claude Code, Cursor, Windsurf, Codex, GitHub Copilot, and Cline.
              Download the config for your harness below.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {(() => {
                const harnesses = [
                  { name: "Claude Code", file: "CLAUDE.md", desc: "Native format — works out of the box.", color: "#f54e00",
                    config: `# CLAUDE.md — Generated by Claudient\n# Install: cp CLAUDE.md ~/.claude/CLAUDE.md\n\n## Identity\nYou are using Claudient, the largest open-source Claude Code knowledge system.\n\n## Active Skills: 1400+\n## Active Agents: 700+\n## Stacks: 50\n\n## Rules\n- Always check .claudeignore before reading files\n- Run /doctor before starting any session\n- Use /save-state before clearing context` },
                  { name: "Cursor", file: ".cursorrules", desc: "Drop into your repo root for instant context.", color: "#1d4aff",
                    config: `# .cursorrules — Generated by Claudient\n# Install: cp .cursorrules ./\n\nYou are an expert engineer using Claudient context.\n- Always run diagnostics before editing\n- Use spec-first approach\n- Check blast radius before breaking changes\n- 1400+ skills available, 700+ agents` },
                  { name: "Windsurf", file: ".windsurfrules", desc: "Compatible with Windsurf's Cascade engine.", color: "#3fb950",
                    config: `# .windsurfrules — Generated by Claudient\n# Install: cp .windsurfrules ./\n\nCascade should use Claudient context:\n- 1400+ skills, 700+ agents, 50 stacks\n- Spec-first enforcement active\n- Shadow compiler on every edit` },
                  { name: "GitHub Copilot", file: ".github/copilot-instructions.md", desc: "Project-level instructions for Copilot.", color: "#b62ad9",
                    config: `# Copilot Instructions — Generated by Claudient\n# Install: mkdir -p .github && cp copilot-instructions.md .github/\n\n- Use Claudient skill context for all suggestions\n- Prefer spec-first architecture patterns\n- Run shadow compiler validation` },
                  { name: "Codex", file: "AGENTS.md", desc: "OpenAI Codex agent configuration.", color: "#1078a3",
                    config: `# AGENTS.md — Generated by Claudient\n# Install: cp AGENTS.md ./\n\n## Agent Configuration\n- Framework: Claudient Knowledge System\n- Skills: 1400+ available\n- Agents: 700+ specialist agents\n- Compliance: SOC2/GDPR/EU-AI-Act ready` },
                  { name: "Cline", file: ".clinerules", desc: "Cline-specific rules and context.", color: "#f5b800",
                    config: `# .clinerules — Generated by Claudient\n# Install: cp .clinerules ./\n\n- Use Claudient context for all operations\n- 1400+ skills, 700+ agents available\n- Spec-first enforcement\n- Shadow compiler validation` },
                ];
                return harnesses.map((h) => (
                  <div key={h.name} className="rounded-xl border border-hairline bg-white p-4 hover:border-olive/70 transition">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="size-2.5 rounded-full" style={{ backgroundColor: h.color }} />
                      <span className="text-[13px] font-bold text-ink">{h.name}</span>
                    </div>
                    <code className="text-[10px] font-mono text-mute">{h.file}</code>
                    <p className="mt-1.5 text-[11.5px] text-mute">{h.desc}</p>
                    <div className="mt-2.5 flex gap-1.5">
                      <button onClick={() => {
                        const blob = new Blob([h.config], { type: "text/plain" });
                        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = h.file.split("/").pop() || h.file; a.click();
                      }} className="rounded bg-brand-orange/10 text-brand-orange px-2 py-1 text-[10px] font-bold hover:bg-brand-orange/20 transition">⬇ Download</button>
                      <button onClick={() => navigator.clipboard.writeText(h.config)}
                        className="rounded bg-slate-100 text-slate-600 px-2 py-1 text-[10px] font-bold hover:bg-slate-200 transition">📋 Copy</button>
                    </div>
                  </div>
                ));
              })()}
            </div>
            <div className="mt-5 rounded-lg border border-hairline bg-cream p-4">
              <div className="text-[12px] font-bold text-ink mb-1">Cross-harness export</div>
              <p className="text-[11.5px] text-body leading-relaxed">
                Run <code className="rounded bg-white px-1.5 py-0.5 text-[11px] font-mono text-brand-purple">claudient export --harness cursor</code> to
                convert any Claudient skill or stack into the target harness format.
              </p>
            </div>
            <div className="mt-4 rounded-lg border border-brand-purple/30 bg-brand-purple/5 p-4">
              <div className="text-[12px] font-bold text-brand-purple mb-1">🔗 Harness Neutral</div>
              <p className="text-[11.5px] text-body leading-relaxed">
                Claudient rules, skills, and agents are format-agnostic. Write once in CLAUDE.md format, export to any harness.
                No vendor lock-in — your knowledge system works everywhere.
              </p>
            </div>
          </div>
        )}

        {tab === "Codebase Map" && (
          <div className="flex flex-col xl:flex-row gap-4 h-[450px] overflow-hidden">
            <div className="flex-1 rounded-xl border border-hairline bg-[#1a1b26] relative overflow-hidden flex flex-col min-h-0">
              <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 z-10">
                # Dependency Graph Map (Click Node to Inspect)
              </div>
              <div className="flex-1 min-h-0 relative">
                <svg className="w-full h-full min-h-[350px]">
                  {CODEBASE_MAP.links.map((link, i) => {
                    const sourceNode = CODEBASE_MAP.nodes.find(n => n.id === link.source);
                    const targetNode = CODEBASE_MAP.nodes.find(n => n.id === link.target);
                    if (!sourceNode || !targetNode) return null;
                    const isHighlighted = selectedNodeId === link.source || selectedNodeId === link.target;
                    return (
                      <line
                        key={i}
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke={isHighlighted ? "#fabd2f" : "#444b6a"}
                        strokeWidth={isHighlighted ? 2 : 1}
                        strokeDasharray={isHighlighted ? "none" : "3,3"}
                        className="transition-all duration-300"
                      />
                    );
                  })}
                  {CODEBASE_MAP.nodes.map((node) => {
                    const isSelected = selectedNodeId === node.id;
                    return (
                      <g
                        key={node.id}
                        transform={`translate(${node.x},${node.y})`}
                        onClick={() => setSelectedNodeId(node.id)}
                        className="cursor-pointer group"
                      >
                        <circle
                          r={isSelected ? 10 : 8}
                          fill={node.color}
                          stroke={isSelected ? "#ffffff" : "transparent"}
                          strokeWidth={2}
                          className="transition-all duration-300 group-hover:scale-125"
                        />
                        <text
                          y={20}
                          textAnchor="middle"
                          fill={isSelected ? "#ffffff" : "#a9b1d6"}
                          className="text-[10px] font-mono select-none transition-all duration-300 font-semibold"
                        >
                          {node.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
            <div className="w-full xl:w-72 rounded-xl border border-hairline bg-white p-4 flex flex-col overflow-y-auto shrink-0">
              <span className="text-[10px] font-bold text-mute uppercase tracking-wider block mb-1">
                Node Inspector
              </span>
              <h3 className="text-[14px] font-mono font-bold text-ink truncate mb-2">
                {selectedNode.id}
              </h3>
              <div className="flex gap-1.5 flex-wrap mb-4">
                <span className="text-[9px] font-bold uppercase rounded px-1.5 py-0.5 bg-brand-yellow/20 text-brand-orange">
                  {selectedNode.group}
                </span>
              </div>
              <div className="mb-4">
                <span className="text-[11px] font-bold text-mute uppercase tracking-wider block mb-1.5">
                  Functions / Exports ({selectedNode.functions.length})
                </span>
                {selectedNode.functions.length > 0 ? (
                  <div className="space-y-1">
                    {selectedNode.functions.map((f, i) => (
                      <code key={i} className="block text-[10px] font-mono bg-slate-50 text-indigo-500 px-2 py-0.5 rounded border border-slate-100">
                        {f}()
                      </code>
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] text-mute italic">No exported functions</span>
                )}
              </div>
              <div>
                <span className="text-[11px] font-bold text-mute uppercase tracking-wider block mb-1.5">
                  Import Dependencies ({selectedNode.imports.length})
                </span>
                {selectedNode.imports.length > 0 ? (
                  <div className="space-y-1">
                    {selectedNode.imports.map((imp, i) => (
                      <code key={i} className="block text-[10px] font-mono bg-slate-50 text-slate-600 px-2 py-0.5 rounded truncate">
                        "{imp}"
                      </code>
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] text-mute italic">No imports declared</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
