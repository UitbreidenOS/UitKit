import Link from 'next/link'
import { getAllSkills, getAllAgents, getAllGuides, CATEGORY_LABELS, CATEGORY_COLORS, SKILL_CATEGORIES_LIST } from '@/lib/content'

export default async function HomePage() {
  const skills = getAllSkills()
  const agents = getAllAgents()
  const guides = getAllGuides()

  const categoryStats = SKILL_CATEGORIES_LIST.map(cat => ({
    id: cat,
    label: CATEGORY_LABELS[cat],
    color: CATEGORY_COLORS[cat],
    count: skills.filter(s => s.category === cat).length,
  }))

  return (
    <div>
      {/* Hero */}
      <section className="border-b-2 border-black bg-orange-500 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-block neo-card px-4 py-1 text-sm font-black mb-6 bg-white text-black">
              v0.1.0 — Open Source
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-6">
              The Claude Code<br />Knowledge System
            </h1>
            <p className="text-lg md:text-xl font-medium text-gray-800 mb-8 max-w-2xl">
              Skills, agents, hooks, rules, and workflows that multiply your Claude Code output.
              Drop in any skill. Zero install friction.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/skills" className="neo-btn px-6 py-3 bg-black text-orange-100 text-base">
                Browse Skills
              </Link>
              <a
                href="https://github.com/Claudient/Claudient"
                target="_blank"
                rel="noopener noreferrer"
                className="neo-btn px-6 py-3 bg-white text-black text-base"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-y-2 md:divide-y-0 divide-black">
            {[
              { label: 'Skills', value: skills.length.toString() },
              { label: 'Agents', value: agents.length.toString() },
              { label: 'Guides', value: guides.length.toString() },
              { label: 'Languages', value: '5' },
            ].map(stat => (
              <div key={stat.label} className="py-6 px-6 text-center">
                <div className="text-4xl font-black">{stat.value}</div>
                <div className="text-sm font-bold text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick install */}
      <section className="border-b-2 border-black bg-black text-orange-100 py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col gap-8">

          {/* Guided setup */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black px-2 py-0.5 bg-orange-500 text-black">NEW</span>
                <h2 className="text-xl font-black">First time? Use guided setup</h2>
              </div>
              <p className="text-orange-200 text-sm">Interactive 5-step wizard — picks language, skills, agents, hooks, and rules</p>
            </div>
            <code className="neo-card bg-orange-950 border-orange-500 text-orange-300 px-4 py-3 font-mono text-sm w-full md:w-72 shrink-0">
              npx claudient init
            </code>
          </div>

          <div className="border-t border-orange-900" />

          {/* Manual install */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black mb-1">Or install directly</h2>
              <p className="text-orange-200 text-sm">Add all skills, or pick a specific category</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <code className="neo-card bg-orange-950 border-orange-600 text-orange-100 px-4 py-3 font-mono text-sm md:w-72">
                npx claudient add all
              </code>
              <code className="neo-card bg-orange-950 border-orange-600 text-orange-100 px-4 py-3 font-mono text-sm md:w-64">
                npx claudient add backend
              </code>
            </div>
          </div>

        </div>
      </section>

      {/* Skill categories */}
      <section className="py-16 border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black">Skill Categories</h2>
              <p className="text-gray-600 mt-1">{skills.length} skills across {categoryStats.length} categories</p>
            </div>
            <Link href="/skills" className="neo-btn px-4 py-2 bg-orange-500 text-black text-sm">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categoryStats.map(cat => (
              <Link
                key={cat.id}
                href={`/skills?category=${cat.id}`}
                className="neo-card neo-card-hover p-5 group"
              >
                <div className={`w-10 h-10 ${cat.color} border-2 border-black mb-3 flex items-center justify-center font-black text-lg`}>
                  {cat.label.charAt(0)}
                </div>
                <h3 className="font-black text-base group-hover:underline">{cat.label}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{cat.count} skills</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-b-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-black mb-2">Built for how developers actually work</h2>
          <p className="text-gray-600 mb-10 text-lg">Every piece of Claudient is designed to drop into your workflow with zero friction.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: 'One command to install',
                body: 'npx claudient add all copies every skill into your Claude Code setup instantly. No cloning, no manual copying.',
                accent: 'bg-orange-500',
              },
              {
                title: 'Full ecosystem coverage',
                body: 'Python, TypeScript, Go, C#/.NET, Kubernetes, Terraform, GraphQL, dbt, Stripe — every major stack has a complete skill.',
                accent: 'bg-blue-400',
              },
              {
                title: '5 languages',
                body: 'Every skill, guide, workflow, and prompt is available in English, French, German, Dutch, and Spanish.',
                accent: 'bg-green-400',
              },
              {
                title: 'End-to-end workflows',
                body: '5 complete multi-step workflows covering feature development, debugging, code review, refactoring, and project bootstrap.',
                accent: 'bg-purple-400',
              },
              {
                title: 'Agent-ready',
                body: 'Planner, Architect, Code Reviewer, and Security Reviewer subagents — each with a specific tool subset and model guidance.',
                accent: 'bg-pink-400',
              },
              {
                title: 'Maximum efficiency, built in',
                body: 'The /lean-claude skill activates token-efficient mode in one prompt — right model, right context, right agent pattern.',
                accent: 'bg-teal-400',
              },
              {
                title: 'Open source, MIT licensed',
                body: 'Backed by Uitbreiden. Fork it, extend it, contribute skills. Join us on Reddit · YouTube.',
                accent: 'bg-orange-300',
              },
            ].map(f => (
              <div key={f.title} className="neo-card p-6">
                <div className={`w-10 h-3 ${f.accent} border-2 border-black mb-4`}></div>
                <h3 className="font-black text-lg mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guides preview */}
      <section className="py-16 border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black">Guides</h2>
              <p className="text-gray-600 mt-1">In-depth documentation in 5 languages</p>
            </div>
            <Link href="/guides" className="neo-btn px-4 py-2 bg-orange-500 text-black text-sm">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {guides.slice(0, 6).map(guide => (
              <Link
                key={guide.id}
                href={`/guides/${guide.slug}`}
                className="neo-card neo-card-hover p-5 group"
              >
                <div className="w-8 h-8 bg-black mb-3"></div>
                <h3 className="font-black text-base group-hover:underline">{guide.title}</h3>
                <p className="text-xs text-gray-400 font-mono mt-2">EN · FR · DE · NL · ES</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-black text-orange-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-4">Start using Claudient today</h2>
          <p className="text-orange-200 mb-8 text-lg">Open source, zero runtime dependencies. Works with any Claude Code setup.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://github.com/Claudients/Claudient" target="_blank" rel="noopener noreferrer"
              className="neo-btn px-6 py-4 bg-orange-500 text-black text-base">
              Star on GitHub
            </a>
            <a href="https://www.reddit.com/r/uitbreiden/" target="_blank" rel="noopener noreferrer"
              className="neo-btn px-6 py-4 border-2 border-orange-300 text-orange-100 text-base">
              Reddit
            </a>
            <a href="https://www.youtube.com/@UITBREIDEN" target="_blank" rel="noopener noreferrer"
              className="neo-btn px-6 py-4 border-2 border-orange-300 text-orange-100 text-base">
              YouTube
            </a>
            <Link href="/skills" className="neo-btn px-6 py-4 border-2 border-orange-500 text-orange-100 text-base">
              Browse Skills
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
