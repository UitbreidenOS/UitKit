import { useState } from "react";
import { Eyebrow } from "./ui";

interface Persona { name: string; icon: string; tagline: string; desc: string; skills: string[]; }

const PERSONAS: Persona[] = [
  { name: "Solo Founder", icon: "🚀", tagline: "Ship fast, validate faster",
    desc: "You're building a SaaS solo. Every minute counts. This persona optimizes for speed — MVPs, landing pages, Stripe integration, and growth experiments.",
    skills: ["landing-page-gen", "stripe-integration", "analytics-setup", "copywriting", "seo-basics"] },
  { name: "Startup CTO", icon: "🏗️", tagline: "Scale without breaking things",
    desc: "Technical co-founder mode. Architecture decisions, team hiring docs, technical due diligence, and scaling infrastructure.",
    skills: ["architecture-doc", "scaling-review", "hiring-brief", "tech-debt-audit", "incident-runbook"] },
  { name: "Enterprise Architect", icon: "🏛️", tagline: "Govern everything",
    desc: "Large org with compliance requirements. SOC2, audit trails, RBAC, and multi-team coordination are your daily bread.",
    skills: ["compliance-reporter", "access-audit", "threat-model", "adr-writer", "governance-review"] },
  { name: "Indie Hacker", icon: "💡", tagline: "Turn ideas into income",
    desc: "Side projects and micro-SaaS. Focus on revenue-generating features, launch pages, and automation over perfection.",
    skills: ["mvp-scaffold", "stripe-checkout", "email-sequence", "landing-copy", "pricing-page"] },
  { name: "Growth Marketer", icon: "📈", tagline: "Data-driven growth",
    desc: "A/B tests, funnel optimization, content strategy, and channel expansion. Every decision backed by metrics.",
    skills: ["ab-test-design", "funnel-analysis", "content-brief", "seo-research", "campaign-plan"] },
  { name: "Agency Operator", icon: "🏢", tagline: "Deliver at scale",
    desc: "Running a dev or design agency. Client management, project scoping, SOWs, and team utilization are key.",
    skills: ["sow-generator", "project-scoper", "client-brief", "invoice-gen", "retro-facilitator"] },
  { name: "DevRel Advocate", icon: "📣", tagline: "Educate and inspire",
    desc: "Developer relations and advocacy. Blog posts, talks, demos, and community engagement with technical depth.",
    skills: ["blog-draft", "talk-outline", "demo-builder", "tutorial-gen", "community-reply"] },
  { name: "Data-Driven PM", icon: "📊", tagline: "Decisions over opinions",
    desc: "Product manager who lives in metrics. PRDs, prioritization frameworks, user research synthesis, and roadmap planning.",
    skills: ["prd-writer", "user-story-gen", "metric-dashboard", "roadmap-prioritize", "research-synthesis"] },
  { name: "Fractional Exec", icon: "🎯", tagline: "Impact in hours, not months",
    desc: "Part-time CTO/VP/CISO. Strategic assessments, team audits, architecture reviews, and executive summaries.",
    skills: ["tech-audit", "team-assessment", "exec-summary", "risk-assessment", "strategy-doc"] },
  { name: "AI Product Builder", icon: "🤖", tagline: "Build the AI, not just with it",
    desc: "Building AI-powered products. RAG systems, agent orchestration, prompt engineering, and evaluation pipelines.",
    skills: ["rag-pipeline", "agent-design", "prompt-engineer", "eval-harness", "token-optimizer"] },
];

export function PersonasApp() {
  const [selected, setSelected] = useState<Persona>(PERSONAS[0]);

  return (
    <div className="flex h-full">
      <div className="w-[200px] border-r border-hairline bg-cream/50 p-3 overflow-y-auto shrink-0">
        <Eyebrow color="#b62ad9">Personas</Eyebrow>
        <div className="mt-3 space-y-1">
          {PERSONAS.map((p) => (
            <button key={p.name} onClick={() => setSelected(p)}
              className={`w-full text-left rounded-md px-2.5 py-2 text-[12px] transition ${selected.name === p.name ? "bg-white font-bold text-ink shadow-sm" : "text-body hover:bg-white/50"}`}>
              <span className="mr-1.5">{p.icon}</span> {p.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{selected.icon}</span>
          <div>
            <Eyebrow color="#b62ad9">Persona</Eyebrow>
            <h2 className="text-xl font-bold text-ink">{selected.name}</h2>
            <p className="text-[13px] text-mute italic">{selected.tagline}</p>
          </div>
        </div>
        <p className="text-[14px] text-body leading-relaxed mb-5">{selected.desc}</p>
        <div className="mb-4">
          <div className="text-[12px] font-bold text-mute uppercase tracking-wider mb-2">Optimized Skills</div>
          <div className="flex flex-wrap gap-2">
            {selected.skills.map((s) => (
              <span key={s} className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold text-white" style={{ backgroundColor: "#b62ad9" }}>
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-ink text-[11px] text-[#e6e6e6] p-3 font-mono leading-relaxed">
          <div className="text-brand-yellow">~/.claude/CLAUDE.md</div>
          <div className="mt-1 text-mute"># Persona: {selected.name}</div>
          <div className="text-[#e6e6e6]">Optimized for: {selected.tagline}</div>
          <div className="text-[#e6e6e6]">Priorities: speed, quality, revenue</div>
        </div>
      </div>
    </div>
  );
}
