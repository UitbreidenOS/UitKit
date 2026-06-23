import type { WindowManager } from "../useWindows";
import { Eyebrow, YellowButton } from "./ui";

const stats = [
  { v: "1000+", l: "Skills" },
  { v: "700+", l: "Agents" },
  { v: "50", l: "Stacks" },
  { v: "41", l: "MCP Configs" },
  { v: "117", l: "Guides" },
  { v: "5", l: "Languages" },
  { v: "100", l: "Commands" },
  { v: "19", l: "Plugins" },
  { v: "36", l: "CLI Scripts" },
  { v: "410", l: "Structures" },
  { v: "48", l: "Hooks" },
  { v: "3", l: "Compliance Stacks" },
];

export function AboutApp({ wm }: { wm: WindowManager }) {
  return (
    <div className="px-7 py-7 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <span className="text-5xl">🧠</span>
        <div>
          <Eyebrow color="#76786c">About</Eyebrow>
          <h1 className="text-2xl font-extrabold text-ink mt-1">
            The largest open-source knowledge base for Claude Code
          </h1>
        </div>
      </div>

      <p className="mt-4 text-[14px] text-body leading-relaxed">
        Claudient delivers domain-specific knowledge, specialist agents, workspace stacks, 
        and MCP configurations to Claude Code. Everything is installable in 30 seconds and 
        works across 5 languages. Built by the community, for the community.
      </p>

      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.l} className="rounded-xl border border-hairline bg-white p-4 text-center">
            <div className="text-xl font-extrabold text-ink">{s.v}</div>
            <div className="text-[11.5px] text-mute">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-olive/50 bg-cream p-5">
        <div className="text-[14px] font-bold text-ink">Our values</div>
        <ul className="mt-2 space-y-1.5 text-[13px] text-body">
          <li>🧠 Domain-first — knowledge over instructions.</li>
          <li>🌍 Multilingual — 5 languages, not just English.</li>
          <li>🔓 Open source — AGPL-3.0 (code) + CC-BY-SA-4.0 (content).</li>
          <li>⚡ Fast install — 30 seconds from zero to productive.</li>
        </ul>
      </div>

      <div className="mt-6 flex gap-3">
        <YellowButton onClick={() => wm.open("install")}>Get Started →</YellowButton>
        <button
          onClick={() => window.open("https://github.com/UitbreidenOS/Claudient", "_blank")}
          className="inline-flex items-center gap-1.5 rounded-md border border-olive/60 bg-white px-4 py-2 text-[13px] font-semibold text-ink hover:bg-cream transition"
        >
          GitHub
        </button>
      </div>
    </div>
  );
}
