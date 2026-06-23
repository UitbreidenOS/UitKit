import { useState } from "react";
import { Eyebrow, Tag } from "./ui";

// ── Pricing Tiers ──
interface Tier {
  id: string;
  name: string;
  price: string;
  priceNote: string;
  tagline: string;
  color: string;
  highlighted: boolean;
  features: string[];
  cta: { label: string; href: string };
}

const TIERS: Tier[] = [
  {
    id: "community",
    name: "Community",
    price: "Free",
    priceNote: "Forever open source",
    tagline: "Everything you need to supercharge Claude Code",
    color: "#3fb950",
    highlighted: false,
    features: [
      "1400+ public skills & 700+ agents",
      "50 workspace stacks",
      "41 MCP configurations",
      "100+ slash commands",
      "48 hooks & 32 rules",
      "5-language localization",
      "Community support via GitHub",
      "AGPL-3.0 + CC-BY-SA-4.0 license",
    ],
    cta: { label: "Get Started →", href: "#install" },
  },
  {
    id: "team",
    name: "Team",
    price: "$15–25",
    priceNote: "per seat / month",
    tagline: "Private stacks and priority support for growing teams",
    color: "#1d4aff",
    highlighted: false,
    features: [
      "Everything in Community",
      "Private stack hosting & sharing",
      "Priority feature requests",
      "Localized skill packs (EN/FR/DE/NL/ES)",
      "Team usage analytics dashboard",
      "Shared team CLAUDE.md templates",
      "Slack/Discord integration hooks",
      "Email support (48h SLA)",
    ],
    cta: { label: "Start Free Trial", href: "mailto:ceo@uitbreiden.com?subject=Team%20Plan%20Trial" },
  },
  {
    id: "business",
    name: "Business",
    price: "Custom",
    priceNote: "tailored to your org",
    tagline: "Governance, compliance, and certified marketplace access",
    color: "#b62ad9",
    highlighted: false,
    features: [
      "Everything in Team",
      "Certified marketplace access",
      "Governance hooks & audit trails",
      "SSO / SAML integration",
      "Custom compliance stacks (SOC2, GDPR)",
      "Advanced analytics & reporting",
      "Dedicated account manager",
      "Onboarding & training sessions",
    ],
    cta: { label: "Contact Sales", href: "mailto:ceo@uitbreiden.com?subject=Business%20Plan%20Inquiry" },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Annual",
    priceNote: "contract · custom SLA",
    tagline: "Self-hosted, air-gapped, with a dedicated stack engineer",
    color: "#f54e00",
    highlighted: true,
    features: [
      "Everything in Business",
      "Self-hosted / VPC deployment",
      "Air-gapped environment support",
      "Custom compliance stacks",
      "SLA-backed uptime guarantee",
      "Dedicated stack engineer",
      "White-glove onboarding",
      "Priority incident response",
    ],
    cta: { label: "Book a Demo", href: "mailto:ceo@uitbreiden.com?subject=Enterprise%20Demo%20Request" },
  },
];

// ── Compliance Frameworks ──
interface ComplianceFramework {
  id: string;
  name: string;
  icon: string;
  color: string;
  desc: string;
  controls: { name: string; status: "implemented" | "partial" | "planned" }[];
  evidence: string;
  cli: string;
}

const FRAMEWORKS: ComplianceFramework[] = [
  {
    id: "soc2",
    name: "SOC2 Type II",
    icon: "🔒",
    color: "#1d4aff",
    desc: "Service Organization Control 2 — security, availability, processing integrity, confidentiality, and privacy.",
    evidence: "~/.claude/audit-logs/",
    cli: "claudient audit --framework soc2",
    controls: [
      { name: "Access Control (CC6.1)", status: "implemented" },
      { name: "Encryption at Rest (CC6.7)", status: "implemented" },
      { name: "Audit Trail (CC7.2)", status: "implemented" },
      { name: "Change Management (CC8.1)", status: "implemented" },
      { name: "Incident Response (CC7.3)", status: "implemented" },
      { name: "MFA Enforcement", status: "implemented" },
      { name: "Session Timeout", status: "implemented" },
      { name: "Vendor Risk Assessment", status: "partial" },
    ],
  },
  {
    id: "gdpr",
    name: "GDPR",
    icon: "🇪🇺",
    color: "#3fb950",
    desc: "General Data Protection Regulation — data minimization, consent management, right to erasure, and breach notification.",
    evidence: "~/.claude/gdpr-consent.jsonl",
    cli: "claudient audit --framework gdpr",
    controls: [
      { name: "Data Minimization (Art.5)", status: "implemented" },
      { name: "Consent Management (Art.7)", status: "implemented" },
      { name: "Right to Erasure (Art.17)", status: "implemented" },
      { name: "Data Portability (Art.20)", status: "partial" },
      { name: "Breach Notification (Art.33)", status: "implemented" },
      { name: "PII Scanning in Skills", status: "implemented" },
      { name: "Data Retention Policies", status: "implemented" },
      { name: "Cross-Border Transfer", status: "planned" },
    ],
  },
  {
    id: "eu-ai-act",
    name: "EU AI Act",
    icon: "🤖",
    color: "#b62ad9",
    desc: "EU Artificial Intelligence Act — transparency, risk classification, human oversight, and model documentation.",
    evidence: "~/.claude/eu-ai-risk-log.jsonl",
    cli: "claudient audit --framework eu-ai-act",
    controls: [
      { name: "Risk Classification (Art.6)", status: "implemented" },
      { name: "Transparency Logs (Art.13)", status: "implemented" },
      { name: "Human Oversight (Art.14)", status: "implemented" },
      { name: "Data Governance (Art.10)", status: "implemented" },
      { name: "Model Cards & Documentation", status: "implemented" },
      { name: "Bias Auditing", status: "partial" },
      { name: "Conformity Assessment", status: "partial" },
      { name: "Post-Market Monitoring", status: "planned" },
    ],
  },
];

// ── Enterprise Features ──
const ENTERPRISE_FEATURES = [
  { icon: "🔐", name: "SSO (SAML 2.0)", desc: "Okta, Azure AD, Google Workspace integration. MFA enforcement + session management." },
  { icon: "👥", name: "RBAC", desc: "4 roles: admin, developer, auditor, viewer. Granular permission scoping." },
  { icon: "📋", name: "Audit Trails", desc: "Append-only, 7-year retention. Every action logged with timestamp + user context." },
  { icon: "🛡️", name: "PII Scanning", desc: "6 built-in patterns + custom regex. Scans skills, prompts, and outputs for personal data." },
  { icon: "💰", name: "Cost Governance", desc: "Per-team daily spend caps ($500 default). Automatic alerts at 80% threshold." },
  { icon: "🏗️", name: "Air-Gap Deploy", desc: "Self-hosted or VPC deployment. No outbound network required." },
  { icon: "🔒", name: "Encryption", desc: "AES-256 at rest, TLS 1.3 in transit. Customer-managed encryption keys (CMEK)." },
  { icon: "📊", name: "Compliance Reports", desc: "Monthly automated reports. SOC2 evidence bundles, GDPR logs, AI Act risk assessments." },
];

// ── Settings Templates ──
const SETTINGS_TEMPLATES = [
  { name: "Enterprise", file: "enterprise.json", desc: "Full governance with audit, compliance, and RBAC." },
  { name: "Security Hardened", file: "security-hardened.json", desc: "Maximum security: PII scanning, block dangerous, cost caps." },
  { name: "Team", file: "team.json", desc: "Shared settings for 5-50 person engineering teams." },
  { name: "Solo Dev", file: "solo-dev.json", desc: "Lightweight config for individual developers." },
  { name: "Minimal", file: "minimal.json", desc: "Bare minimum — just CLAUDE.md + core hooks." },
];

type Tab = "plans" | "compliance" | "features" | "settings";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "plans", label: "Plans", icon: "💰" },
  { id: "compliance", label: "Compliance", icon: "🏛️" },
  { id: "features", label: "Features", icon: "⚙️" },
  { id: "settings", label: "Settings", icon: "📋" },
];

export function PricingApp() {
  const [tab, setTab] = useState<Tab>("plans");
  const [selectedTier, setSelectedTier] = useState("enterprise");
  const [selectedFramework, setSelectedFramework] = useState(FRAMEWORKS[0]);

  const statusIcon = (s: string) =>
    s === "implemented" ? "✅" : s === "partial" ? "🟡" : "⬜";

  return (
    <div className="h-full flex flex-col">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-4 pt-3 pb-2 border-b border-hairline bg-cream">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11.5px] font-semibold transition ${
              tab === t.id
                ? "bg-white border border-hairline text-ink shadow-sm"
                : "text-body hover:bg-white/60"
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-5">
        {/* ── PLANS TAB ── */}
        {tab === "plans" && (
          <div>
            <Eyebrow color="#f54e00">Pricing</Eyebrow>
            <h2 className="mt-2 text-2xl font-extrabold text-ink">
              From open source to enterprise-grade
            </h2>
            <p className="mt-2 text-[13.5px] text-body leading-relaxed max-w-2xl">
              Start free with 1400+ skills, 700+ agents, and 50 workspace stacks.
              Scale to private hosting, governance hooks, and dedicated engineering support.
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {TIERS.map((tier) => {
                const isActive = selectedTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`text-left rounded-xl border p-5 transition hover:-translate-y-0.5 ${
                      tier.highlighted
                        ? "border-2 border-brand-orange bg-gradient-to-br from-orange-50 to-white win-shadow"
                        : isActive
                          ? "border-olive/70 bg-white shadow-sm"
                          : "border-hairline bg-white hover:border-olive/70"
                    }`}
                  >
                    {tier.highlighted && (
                      <span className="inline-block mb-2 rounded-full bg-brand-orange/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                        Most Popular
                      </span>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-[15px] font-bold text-ink">{tier.name}</span>
                      <span className="text-2xl font-extrabold" style={{ color: tier.color }}>{tier.price}</span>
                    </div>
                    <div className="text-[11px] text-mute mt-0.5">{tier.priceNote}</div>
                    <p className="mt-2 text-[12.5px] text-body leading-relaxed">{tier.tagline}</p>
                    <ul className="mt-3 space-y-1.5">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-[12px] text-body">
                          <span className="shrink-0 mt-0.5" style={{ color: tier.color }}>✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={tier.cta.href}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-[12px] font-bold transition"
                      style={{
                        backgroundColor: tier.highlighted ? tier.color : tier.color + "15",
                        color: tier.highlighted ? "#fff" : tier.color,
                        borderBottom: tier.highlighted ? `2px solid ${tier.color}99` : "none",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {tier.cta.label}
                    </a>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl border border-hairline bg-cream p-5">
              <div className="flex items-start gap-4">
                <span className="text-4xl shrink-0">🏢</span>
                <div>
                  <div className="text-[14px] font-bold text-ink">Not sure which tier fits?</div>
                  <p className="mt-1 text-[12.5px] text-body leading-relaxed">
                    Run <code className="rounded bg-white px-1.5 py-0.5 text-[11px] font-mono text-brand-purple">claudient score</code> to
                    get your AI-Readiness Score (0–100 across 8 dimensions). We'll recommend the right tier based on your results.
                  </p>
                  <a
                    href="mailto:ceo@uitbreiden.com?subject=Pricing%20Question"
                    className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-bold text-brand-orange hover:underline"
                  >
                    Talk to us →
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── COMPLIANCE TAB ── */}
        {tab === "compliance" && (
          <div className="h-full flex flex-col sm:flex-row gap-4">
            {/* Framework selector */}
            <aside className="sm:w-48 shrink-0 space-y-1">
              <Eyebrow color="#1d4aff">Frameworks</Eyebrow>
              <div className="mt-2 space-y-0.5">
                {FRAMEWORKS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFramework(f)}
                    className={`w-full text-left flex items-center gap-2 rounded-lg px-2.5 py-2 text-[12px] font-semibold transition ${
                      selectedFramework.id === f.id
                        ? "bg-white border border-hairline text-ink shadow-sm"
                        : "text-body hover:bg-white/60"
                    }`}
                  >
                    <span>{f.icon}</span>
                    <span className="truncate">{f.name}</span>
                  </button>
                ))}
              </div>
            </aside>

            {/* Framework detail */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{selectedFramework.icon}</span>
                <div>
                  <h2 className="text-lg font-extrabold text-ink">{selectedFramework.name}</h2>
                  <Tag color={selectedFramework.color}>Compliance Framework</Tag>
                </div>
              </div>
              <p className="text-[13px] text-body leading-relaxed mb-4">{selectedFramework.desc}</p>

              <div className="mb-4">
                <div className="text-[11px] font-bold text-mute uppercase tracking-wider mb-2">
                  Controls ({selectedFramework.controls.length})
                </div>
                <div className="rounded-xl border border-hairline bg-white overflow-hidden">
                  <table className="w-full text-[12px]">
                    <thead className="bg-soft border-b border-hairline">
                      <tr>
                        <th className="text-left px-3 py-2 font-bold text-mute">Control</th>
                        <th className="text-center px-3 py-2 font-bold text-mute w-24">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedFramework.controls.map((c) => (
                        <tr key={c.name} className="border-t border-hairline hover:bg-cream/50">
                          <td className="px-3 py-2 font-semibold text-ink">{c.name}</td>
                          <td className="px-3 py-2 text-center">
                            <span className="text-[12px]">{statusIcon(c.status)}</span>
                            <span className="ml-1 text-[10px] text-mute capitalize">{c.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-hairline bg-white p-3">
                  <div className="text-[11px] font-bold text-mute uppercase tracking-wider mb-1">Evidence Location</div>
                  <code className="text-[11px] font-mono text-brand-purple">{selectedFramework.evidence}</code>
                </div>
                <div className="rounded-lg border border-hairline bg-white p-3">
                  <div className="text-[11px] font-bold text-mute uppercase tracking-wider mb-1">Audit Command</div>
                  <code className="text-[11px] font-mono text-brand-purple">{selectedFramework.cli}</code>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── FEATURES TAB ── */}
        {tab === "features" && (
          <div>
            <h2 className="text-lg font-extrabold text-ink mb-1">Enterprise Features</h2>
            <p className="text-[12.5px] text-mute mb-4">
              Governance, security, and compliance for organizations at scale.
              Included in Business and Enterprise plans.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {ENTERPRISE_FEATURES.map((f) => (
                <div key={f.name} className="rounded-xl border border-hairline bg-white p-4 hover:border-brand-blue/40 transition">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-lg">{f.icon}</span>
                    <span className="text-[13px] font-bold text-ink">{f.name}</span>
                  </div>
                  <p className="text-[11.5px] text-body leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-hairline bg-cream p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📞</span>
                <div>
                  <div className="text-[13px] font-bold text-ink">Need a custom feature?</div>
                  <p className="text-[11.5px] text-body mt-0.5">
                    Enterprise plan includes a dedicated stack engineer for custom integrations.
                  </p>
                  <a
                    href="mailto:ceo@uitbreiden.com?subject=Enterprise%20Custom%20Features"
                    className="mt-1.5 inline-flex text-[11px] font-bold text-brand-orange hover:underline"
                  >
                    Contact Sales →
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === "settings" && (
          <div>
            <h2 className="text-lg font-extrabold text-ink mb-1">Settings Templates</h2>
            <p className="text-[12.5px] text-mute mb-4">
              Pre-built settings for different team sizes and security profiles.
              Ships in <code className="text-[11px] font-mono text-brand-purple">settings-templates/</code>.
            </p>
            <div className="space-y-2">
              {SETTINGS_TEMPLATES.map((s) => (
                <div key={s.file} className="rounded-xl border border-hairline bg-white p-4 hover:border-brand-blue/40 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[13px] font-bold text-ink">{s.name}</span>
                      <p className="text-[11.5px] text-mute mt-0.5">{s.desc}</p>
                    </div>
                    <code className="text-[10px] font-mono text-brand-purple shrink-0">{s.file}</code>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-hairline bg-cream p-4">
              <div className="text-[11px] font-bold text-mute uppercase tracking-wider mb-1">Install</div>
              <pre className="text-[11px] font-mono text-ink">
                <code>{"cp settings-templates/enterprise.json .claude/settings.json"}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
