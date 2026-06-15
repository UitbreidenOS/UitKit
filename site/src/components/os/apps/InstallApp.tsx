import { useState } from "react";
import { Eyebrow, YellowButton, GhostButton } from "./ui";

const methods = [
  { title: "Plugin Marketplace", cmd: "/plugin marketplace add Claudient/Claudient", desc: "Recommended — installs all plugins", recommended: true },
  { title: "npm CLI", cmd: "npx claudient add skills backend", desc: "Cherry-pick specific categories" },
  { title: "Git Clone", cmd: "git clone https://github.com/Claudient/Claudient.git", desc: "Full repository access" },
];

const stats = [
  { label: "Skills", value: "400+", icon: "🧩", color: "#1d4aff" },
  { label: "Agents", value: "190+", icon: "🤖", color: "#b62ad9" },
  { label: "MCP Configs", value: "41", icon: "🔌", color: "#1078a3" },
  { label: "Guides", value: "103", icon: "📖", color: "#f5b800" },
  { label: "Workspace Stacks", value: "50", icon: "📦", color: "#f1a82c" },
  { label: "Commands", value: "80+", icon: "⌨️", color: "#f54e00" },
];

const tiers = [
  { name: "Community", price: "Free", color: "#3fb950", desc: "All public skills, agents, stacks", features: ["400+ skills", "190+ agents", "50 workspace stacks", "41 MCP configs", "5 languages"] },
  { name: "Team", price: "$15–25/seat", color: "#1d4aff", desc: "Private stacks + weekly updates", features: ["Everything in Community", "Private stack hosting", "Weekly auto-updates", "Priority requests", "Email support (24h)"] },
  { name: "Business", price: "Custom", color: "#f5b800", desc: "Certified marketplace + SSO", features: ["Everything in Team", "Governance & audit hooks", "SSO (SAML/OAuth)", "Usage analytics", "Slack support (2h)"] },
  { name: "Enterprise", price: "Annual", color: "#b62ad9", desc: "VPC + compliance + dedicated", features: ["Everything in Business", "Self-hosted / VPC", "SOC2/GDPR/EU-AI-Act", "Dedicated engineer", "White-label option"] },
];

export function InstallApp() {
  const [copied, setCopied] = useState<number | null>(null);

  const copy = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto overflow-auto h-full">
      <Eyebrow color="#f97316">Installation</Eyebrow>
      <h1 className="mt-2 text-2xl font-extrabold text-ink">Install in 30 seconds</h1>
      <p className="mt-2 text-[13px] text-body">
        Three ways to get started. Pick what works for your workflow.
      </p>

      {/* Stats grid */}
      <div className="mt-5 grid grid-cols-3 sm:grid-cols-6 gap-2">
        {stats.map(s => (
          <div key={s.label} className="rounded-lg border border-hairline bg-white p-2.5 text-center">
            <div className="text-lg">{s.icon}</div>
            <div className="text-[14px] font-bold text-ink mt-0.5">{s.value}</div>
            <div className="text-[10px] text-mute">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {methods.map((m, i) => (
          <div key={m.title} className={`relative rounded-xl border bg-white p-4 ${m.recommended ? "border-2 border-brand-yellow" : "border-hairline"}`}>
            {m.recommended && (
              <span className="absolute -top-2.5 left-4 rounded-full bg-brand-yellow px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
                Recommended
              </span>
            )}
            <div className="flex items-center gap-3 mb-2.5">
              <div className="grid place-items-center size-7 rounded-full bg-brand-orange/10 text-brand-red text-[13px] font-bold">{i + 1}</div>
              <div>
                <div className="text-[13px] font-bold text-ink">{m.title}</div>
                <div className="text-[11px] text-mute">{m.desc}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <pre className="flex-1 rounded-lg bg-[#1d1f27] text-[#e6e6e6] px-3 py-2 text-[11px] font-mono overflow-auto">
                <code>{m.cmd}</code>
              </pre>
              <button
                onClick={() => copy(i, m.cmd)}
                className="shrink-0 rounded-md border border-olive/60 bg-white px-2.5 py-2 text-[11px] font-semibold text-ink hover:bg-cream transition"
              >
                {copied === i ? "✓" : "Copy"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-olive/50 bg-cream p-4">
        <div className="text-[13px] font-bold text-ink">FAQ</div>
        <div className="mt-2.5 space-y-2 text-[12px] text-body">
          <div><strong>Is Claudient free?</strong> Yes. Open source under AGPL-3.0 and CC-BY-SA-4.0.</div>
          <div><strong>What version of Claude Code?</strong> Works with Claude Code v1.0+. We track latest features.</div>
          <div><strong>Does it send my code anywhere?</strong> No. Everything runs locally. Skills are markdown files read by Claude Code.</div>
          <div><strong>What's included?</strong> 400+ skills, 190+ agents, 41 MCP configs, 103 guides, 50 workspace stacks, and 80+ commands.</div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <YellowButton onClick={() => copy(99, "/plugin marketplace add Claudient/Claudient")}>
          {copied === 99 ? "✓ Copied!" : "Quick Install →"}
        </YellowButton>
        <GhostButton onClick={() => window.open("https://github.com/Claudient/Claudient", "_blank")}>
          GitHub
        </GhostButton>
      </div>

      {/* Pricing Tiers */}
      <div className="mt-6 pt-5 border-t border-hairline">
        <Eyebrow color="#b62ad9">Plans & Pricing</Eyebrow>
        <p className="mt-1 text-[12px] text-mute">Start free, grow with Claudient.</p>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {tiers.map((t) => (
            <div key={t.name} className="rounded-xl border border-hairline bg-white p-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: t.color }}>{t.name}</span>
              </div>
              <div className="mt-1.5 text-[15px] font-extrabold text-ink">{t.price}</div>
              <div className="text-[10px] text-mute">{t.desc}</div>
              <ul className="mt-2 space-y-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-[10px] text-body">
                    <span className="text-[#3fb950]">✓</span> {f}
                  </li>
                ))}
              </ul>
              {t.name === "Enterprise" && (
                <a href="mailto:enterprise@claudient.ai" className="mt-2 inline-flex items-center rounded-md bg-brand-purple px-2 py-1 text-[10px] font-bold text-white hover:bg-brand-purple/90 transition w-full text-center justify-center">
                  Contact Sales
                </a>
              )}
              {t.name === "Team" && (
                <a href="https://github.com/Claudient/Claudient" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center rounded-md border border-olive/60 bg-white px-2 py-1 text-[10px] font-semibold text-ink hover:bg-cream transition w-full text-center justify-center">
                  Learn More
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
