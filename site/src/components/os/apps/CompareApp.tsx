import { useState } from "react";
import { Eyebrow } from "./ui";

interface CompareRow {
  feature: string;
  claudient: string;
  ecc: string;
  volt: string;
  alireza: string;
  aider: string;
  cursor: string;
  copilot: string;
  sweep: string;
  opendevin: string;
  melty: string;
  gptpilot: string;
  mentat: string;
  moat?: boolean;
}

const ROWS: CompareRow[] = [
  { feature: "Skills", claudient: "1000+", ecc: "~150", volt: "~30", alireza: "~20", aider: "✗", cursor: "✗", copilot: "✗", sweep: "✗", opendevin: "✗", melty: "✗", gptpilot: "✗", mentat: "✗" },
  { feature: "Agents", claudient: "182+", ecc: "~50", volt: "~15", alireza: "~10", aider: "✗", cursor: "✗", copilot: "✗", sweep: "✗", opendevin: "✓ (Multiple)", melty: "✗", gptpilot: "✓ (Role-based)", mentat: "✗" },
  { feature: "Slash Commands", claudient: "100+", ecc: "~40", volt: "~10", alireza: "~5", aider: "Basic (CLI)", cursor: "✗", copilot: "✗", sweep: "✗", opendevin: "✗", melty: "✗", gptpilot: "✗", mentat: "Basic" },
  { feature: "Hooks", claudient: "48", ecc: "~20", volt: "~5", alireza: "~3", aider: "✗", cursor: "✗", copilot: "✗", sweep: "Basic (Actions)", opendevin: "✗", melty: "✗", gptpilot: "✗", mentat: "✗" },
  { feature: "Personas", claudient: "10", ecc: "3", volt: "0", alireza: "0", aider: "✗", cursor: "✗", copilot: "✗", sweep: "✗", opendevin: "✗", melty: "✗", gptpilot: "✗", mentat: "✗" },
  { feature: "Rules", claudient: "32", ecc: "~15", volt: "~5", alireza: "~2", aider: "✗", cursor: "1 (Single file)", copilot: "✗", sweep: "✗", opendevin: "✗", melty: "✗", gptpilot: "✗", mentat: "✗" },
  { feature: "MCP Configs", claudient: "41", ecc: "~10", volt: "~8", alireza: "~3", aider: "✓ (via config)", cursor: "✗", copilot: "✗", sweep: "✗", opendevin: "✗", melty: "✗", gptpilot: "✗", mentat: "✗" },
  { feature: "Workspace Stacks", claudient: "50", ecc: "~12", volt: "0", alireza: "0", aider: "✗", cursor: "✗", copilot: "✗", sweep: "✗", opendevin: "✗", melty: "✗", gptpilot: "✗", mentat: "✗" },
  { feature: "Plugins", claudient: "22", ecc: "~8", volt: "0", alireza: "0", aider: "✗", cursor: "✗", copilot: "✗", sweep: "✗", opendevin: "✗", melty: "✗", gptpilot: "✗", mentat: "✗" },
  { feature: "Localization", claudient: "5 languages", ecc: "English only", volt: "English only", alireza: "English only", aider: "English only", cursor: "English only", copilot: "English only", sweep: "English only", opendevin: "English only", melty: "English only", gptpilot: "English only", mentat: "English only", moat: true },
  { feature: "Business-domain Stacks", claudient: "42 domains", ecc: "~5", volt: "0", alireza: "0", aider: "✗", cursor: "✗", copilot: "✗", sweep: "✗", opendevin: "✗", melty: "✗", gptpilot: "✗", mentat: "✗", moat: true },
  { feature: "Artifact-type Span", claudient: "Widest (15+)", ecc: "~8", volt: "~4", alireza: "~3", aider: "✗", cursor: "✗", copilot: "Basic", sweep: "✗", opendevin: "✗", melty: "✗", gptpilot: "✗", mentat: "✗", moat: true },
  { feature: "Dual Distribution", claudient: "Marketplace + npm", ecc: "GitHub only", volt: "GitHub only", alireza: "GitHub only", aider: "✗", cursor: "✗", copilot: "✗", sweep: "✗", opendevin: "✗", melty: "✗", gptpilot: "✗", mentat: "✗", moat: true },
  { feature: "Cross-harness Export", claudient: "✓ .cursorrules, .windsurfrules", ecc: "✗", volt: "✗", alireza: "✗", aider: "✗", cursor: "✗", copilot: "✗", sweep: "✗", opendevin: "✗", melty: "✗", gptpilot: "✗", mentat: "✗", moat: true },
  { feature: "Statuslines & Themes", claudient: "6 presets + themes", ecc: "✗", volt: "✗", alireza: "✗", aider: "✗", cursor: "✗", copilot: "✗", sweep: "✗", opendevin: "✗", melty: "✗", gptpilot: "✗", mentat: "✗" },
  { feature: "B2B Pricing Tiers", claudient: "4 tiers", ecc: "✗", volt: "✗", alireza: "✗", aider: "✗", cursor: "✗", copilot: "✗", sweep: "✗", opendevin: "✗", melty: "✗", gptpilot: "✗", mentat: "✗" },
  { feature: "AI-Readiness Scorecard", claudient: "✓ (claudient score)", ecc: "✗", volt: "✗", alireza: "✗", aider: "✗", cursor: "✗", copilot: "✗", sweep: "✗", opendevin: "✗", melty: "✗", gptpilot: "✗", mentat: "✗" },
  { feature: "Compliance Stacks", claudient: "✓ SOC2, GDPR, HIPAA", ecc: "✗", volt: "✗", alireza: "✗", aider: "✗", cursor: "✗", copilot: "✗", sweep: "✗", opendevin: "✗", melty: "✗", gptpilot: "✗", mentat: "✗" },
  { feature: "Multi-agent Swarms", claudient: "✓ 5 swarm patterns", ecc: "✗", volt: "✗", alireza: "✗", aider: "✗", cursor: "✗", copilot: "✗", sweep: "✗", opendevin: "✗", melty: "✗", gptpilot: "✗", mentat: "✗" },
  { feature: "CLI Tooling", claudient: "9 commands", ecc: "~3", volt: "✗", alireza: "✗", aider: "Basic", cursor: "✗", copilot: "✗", sweep: "✗", opendevin: "✗", melty: "✗", gptpilot: "✗", mentat: "Basic" },
];

const FEATURE_DETAILS: Record<string, { value: string; alt: string; impact: string }> = {
  "Skills": {
    value: "1000+ discrete, modular skills organized in nested directories (e.g. backend, database, frontend, DevOps) that can be imported individually without prompt length exhaustion.",
    alt: "Competitors bundle prompts in unstructured markdown repositories. You must manually copy-paste or load a giant rules file containing everything, wasting tokens.",
    impact: "Reduces token usage by ~60% by selectively importing only the instructions relevant to the active context."
  },
  "Agents": {
    value: "182+ dedicated specialist agents configured with tailored system instructions, model routing preferences, and limited tool configurations.",
    alt: "Other repositories provide basic, generic prompts or a single generalist agent, leading to high hallucination rates during complex refactorings.",
    impact: "Guarantees high task accuracy by routing frontend code to style specialists, schema migrations to database experts, etc."
  },
  "Slash Commands": {
    value: "Over 100 customized interactive commands (e.g. `/goal`, `/grill-me`, `/schedule`) configured to trigger automated workflows, planning reviews, or diagnostic sweeps.",
    alt: "Competitors rely purely on standard Claude Code defaults, offering no interactive custom prompt macros or CLI hooks.",
    impact: "Short-circuits complex multi-turn developer prompts into a single slash trigger, saving developer time and context window."
  },
  "Hooks": {
    value: "48 automated event interceptors mapping to `PreToolUse`, `PostToolUse`, and `Stop` execution milestones inside Claude Code configuration.",
    alt: "No automated runtime hooks or execution interceptors exist in competing prompt libraries.",
    impact: "Acts as a local compiler/type-safety guardrail, catching and repairing syntax errors before modifications are finalized."
  },
  "Personas": {
    value: "10 customized agent personas adapting system-level tone, length, conciseness, and formatting guidelines.",
    alt: "Competitors offer zero custom personality or formatting profile options.",
    impact: "Allows developers to switch between verbose diagnostic modes and ultra-concise 'Caveman' output structures."
  },
  "Rules": {
    value: "32 structured project compliance rules matching languages, frameworks, and workspace configurations.",
    alt: "Others provide a single unstructured `.cursorrules` text dump containing all rules concurrently.",
    impact: "Keeps instructions modular, loading rules dynamically only when relevant files are open."
  },
  "MCP Configs": {
    value: "41 pre-built Model Context Protocol configurations connecting Claude to Docker, databases, design tools, and local utilities.",
    alt: "Competitors offer no MCP configurations or dynamic connection mappings.",
    impact: "Enables natural language interactions with local databases, Figma assets, and external runtime logs."
  },
  "Workspace Stacks": {
    value: "50 pre-packaged workspace environments matching specific configurations (e.g., FastAPI AI stack, NextJS SaaS stack).",
    alt: "No workspace environmental bundles are provided by standard rules directories.",
    impact: "Standardizes team-wide developer environments and pre-commit checks in under 30 seconds."
  },
  "Plugins": {
    value: "22 downloadable plugin modules to extend active CLI command arguments and terminal integrations.",
    alt: "Competitors contain no plug-and-play CLI extensibility features.",
    impact: "Enables seamless extensions for monitoring, CI healing, and local debugging tools."
  },
  "Localization": {
    value: "Every skill, agent, rule, and guide is translated into English, French, German, Spanish, and Dutch.",
    alt: "Competing repositories are written strictly in English.",
    impact: "Ensures international development teams can collaborate and implement instructions in their native languages."
  },
  "Business-domain Stacks": {
    value: "42 domain-specific configurations mapping business logic requirements (e.g. Fintech stack, Healthcare stack).",
    alt: "Competing prompt libraries focus solely on basic technical tools.",
    impact: "Guides agents on domain safety, industry compliance codes, and logic flow requirements."
  },
  "Artifact-type Span": {
    value: "Recognizes and manages over 15 distinct artifact types (reports, diffs, plans, diagrams) for cleaner structured outputs.",
    alt: "Competitors support only raw text or default markdown representations.",
    impact: "Improves readability of complex audit findings and system planning logs."
  },
  "Dual Distribution": {
    value: "Installable via npm (`npx claudient add`) or downloadable directly from the Claude Code marketplace.",
    alt: "Competitors are restricted to raw GitHub file downloads.",
    impact: "Simplifies workspace updates and plugin management through standardized terminal package managers."
  },
  "Cross-harness Export": {
    value: "Native compilers to export Claudient workspace configs into `.cursorrules` or `.windsurfrules` files on demand.",
    alt: "Competitors lock rules to a single target IDE environment.",
    impact: "Provides layout flexibility, allowing developers to switch between Claude Code, Cursor, and Windsurf harnesses seamlessly."
  },
  "Statuslines & Themes": {
    value: "6 statusline overlays (e.g., Cost Watch, Context Budget) and 10 custom visual themes (Dracula, Gruvbox, Nord, Solarized, etc.).",
    alt: "No visual customization, theme overrides, or real-time cost status overlays are supported elsewhere.",
    impact: "Reduces visual fatigue and alerts developers of API budget spending in real-time."
  },
  "B2B Pricing Tiers": {
    value: "Structured enterprise plans (Community, Team, Business, Enterprise) to govern workspace licensing.",
    alt: "Competitors have no corporate integration path or seat governance.",
    impact: "Provides startups and enterprises path to standardizing AI tooling safely with SAML/SSO."
  },
  "AI-Readiness Scorecard": {
    value: "Automated analysis tool (`claudient score`) mapping codebase configuration quality and agent ease-of-use.",
    alt: "No evaluation, scoring, or benchmarking frameworks are available in competing prompt directories.",
    impact: "Identifies and repairs missing context files or oversized lockfiles that degrade agent performance."
  },
  "Compliance Stacks": {
    value: "Pre-audited security setups complying with SOC2, GDPR, HIPAA, and the EU-AI-Act.",
    alt: "Competing libraries focus purely on syntax generation without compliance guardrails.",
    impact: "Allows regulated teams to safely deploy AI coding agents without violating corporate governance standards."
  },
  "Multi-agent Swarms": {
    value: "5 pre-built collaboration topologies (Orchestrator/Worker, Swarm Sandbox, Consensus Debate) routing tasks to specialized experts.",
    alt: "Competitors operate purely inside single-agent loops.",
    impact: "Solves complex architecture audits and debugging scenarios by simulating developer team collaborations."
  },
  "CLI Tooling": {
    value: "9 terminal commands (`claudient doctor`, `claudient repair`, `claudient score`, etc.) for active workspace audit.",
    alt: "Competitors contain no CLI tooling or executable shell modules.",
    impact: "Automates linting, context pruning, and dependency sweeps directly from the terminal."
  }
};

const COMPETITORS = [
  { id: "claudient", label: "Claudient", color: "#f54e00" },
  { id: "ecc", label: "ECC", color: "#6b7280" },
  { id: "volt", label: "VoltAgent", color: "#6b7280" },
  { id: "alireza", label: "alirezarezvani", color: "#6b7280" },
  { id: "aider", label: "Aider CLI", color: "#6b7280" },
  { id: "cursor", label: "Cursor/Windsurf Rules", color: "#6b7280" },
  { id: "copilot", label: "Copilot Workspace", color: "#6b7280" },
  { id: "sweep", label: "Sweep AI", color: "#6b7280" },
  { id: "opendevin", label: "OpenDevin", color: "#6b7280" },
  { id: "melty", label: "Melty AI", color: "#6b7280" },
  { id: "gptpilot", label: "GPT Pilot", color: "#6b7280" },
  { id: "mentat", label: "Mentat", color: "#6b7280" }
];

type Filter = "all" | "moats";

export function CompareApp() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedFeature, setSelectedFeature] = useState<string | null>("Skills");
  const rows = filter === "moats" ? ROWS.filter((r) => r.moat) : ROWS;

  const activeDetail = selectedFeature ? FEATURE_DETAILS[selectedFeature] : null;

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="w-full lg:w-[180px] border-b lg:border-b-0 lg:border-r border-hairline bg-cream/50 p-3 overflow-y-auto shrink-0">
        <Eyebrow color="#f54e00">Compare</Eyebrow>
        <p className="mt-2 text-[11px] text-mute leading-relaxed">
          Honest feature comparison across the Claude Code ecosystem. Click any row to inspect details.
        </p>
        <div className="mt-4 space-y-1">
          <button
            onClick={() => setFilter("all")}
            className={`w-full text-left rounded-md px-2.5 py-1.5 text-[12px] transition ${filter === "all" ? "bg-white font-bold text-ink shadow-sm" : "text-body hover:bg-white/50"}`}
          >
            All Features ({ROWS.length})
          </button>
          <button
            onClick={() => setFilter("moats")}
            className={`w-full text-left rounded-md px-2.5 py-1.5 text-[12px] transition ${filter === "moats" ? "bg-white font-bold text-ink shadow-sm" : "text-body hover:bg-white/50"}`}
          >
            🏆 Our Moats ({ROWS.filter((r) => r.moat).length})
          </button>
        </div>
        <div className="mt-5 space-y-2 hidden lg:block">
          {COMPETITORS.map((c) => (
            <div key={c.id} className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ backgroundColor: c.color }} />
              <span className="text-[11px] font-semibold text-body">{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Table + Detail Panel */}
      <div className="flex-1 flex flex-col p-4 min-h-0 overflow-y-auto">
        <div className="rounded-lg border border-hairline overflow-hidden overflow-x-auto shrink-0 mb-4">
          <table className="w-full text-[12px] min-w-[1100px]">
            <thead>
              <tr className="bg-cream border-b border-hairline">
                <th className="text-left px-3 py-2.5 font-bold text-ink w-[180px]">Feature</th>
                <th className="text-left px-3 py-2.5 font-bold text-brand-orange">Claudient</th>
                <th className="text-left px-3 py-2.5 font-semibold text-mute">ECC</th>
                <th className="text-left px-3 py-2.5 font-semibold text-mute">VoltAgent</th>
                <th className="text-left px-3 py-2.5 font-semibold text-mute">alirezarezvani</th>
                <th className="text-left px-3 py-2.5 font-semibold text-mute">Aider CLI</th>
                <th className="text-left px-3 py-2.5 font-semibold text-mute">Cursor Rules</th>
                <th className="text-left px-3 py-2.5 font-semibold text-mute">Copilot Workspace</th>
                <th className="text-left px-3 py-2.5 font-semibold text-mute">Sweep AI</th>
                <th className="text-left px-3 py-2.5 font-semibold text-mute">OpenDevin</th>
                <th className="text-left px-3 py-2.5 font-semibold text-mute">Melty AI</th>
                <th className="text-left px-3 py-2.5 font-semibold text-mute">GPT Pilot</th>
                <th className="text-left px-3 py-2.5 font-semibold text-mute">Mentat</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const isSelected = selectedFeature === row.feature;
                return (
                  <tr
                    key={row.feature}
                    onClick={() => setSelectedFeature(row.feature)}
                    className={`border-b border-hairline cursor-pointer transition ${
                      isSelected 
                        ? "bg-brand-orange/10 ring-1 ring-inset ring-brand-orange/30" 
                        : row.moat 
                          ? "bg-emerald-50/50 hover:bg-emerald-50" 
                          : i % 2 === 0 
                            ? "bg-white hover:bg-slate-50" 
                            : "bg-cream/30 hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-3 py-2 font-semibold text-ink flex items-center gap-1.5">
                      {row.moat && <span className="text-[10px]">🏆</span>}
                      {row.feature}
                    </td>
                    <td className="px-3 py-2 font-semibold text-ink">{row.claudient}</td>
                    <td className="px-3 py-2 text-mute">{row.ecc}</td>
                    <td className="px-3 py-2 text-mute">{row.volt}</td>
                    <td className="px-3 py-2 text-mute">{row.alireza}</td>
                    <td className="px-3 py-2 text-mute">{row.aider}</td>
                    <td className="px-3 py-2 text-mute">{row.cursor}</td>
                    <td className="px-3 py-2 text-mute">{row.copilot}</td>
                    <td className="px-3 py-2 text-mute">{row.sweep}</td>
                    <td className="px-3 py-2 text-mute">{row.opendevin}</td>
                    <td className="px-3 py-2 text-mute">{row.melty}</td>
                    <td className="px-3 py-2 text-mute">{row.gptpilot}</td>
                    <td className="px-3 py-2 text-mute">{row.mentat}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Feature Detail Inspector */}
        {activeDetail ? (
          <div className="rounded-lg border-2 border-brand-orange/20 bg-white p-4 shadow-sm">
            <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider block mb-1">Feature Inspector</span>
            <h3 className="text-sm font-extrabold text-ink mb-3">{selectedFeature}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] font-bold text-ink block mb-1">How Claudient Does It:</span>
                <p className="text-[12px] text-body leading-relaxed">{activeDetail.value}</p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-mute block mb-1">Alternative Approaches:</span>
                <p className="text-[12px] text-mute leading-relaxed">{activeDetail.alt}</p>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-hairline flex items-start gap-1.5">
              <span className="text-base leading-none">🎯</span>
              <div>
                <span className="text-[11px] font-bold text-ink block">Productivity & Cost Impact:</span>
                <p className="text-[12px] text-body mt-0.5 leading-relaxed">{activeDetail.impact}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-hairline bg-cream p-4 text-center text-mute text-[12px]">
            Click on any row in the comparison table to inspect exact features and value metrics.
          </div>
        )}
      </div>
    </div>
  );
}
