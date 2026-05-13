import { notFound } from 'next/navigation'
import Link from 'next/link'
import { marked } from 'marked'
import {
  getAllSkills,
  readSkillContent,
  CATEGORY_LABELS,
  SKILL_CATEGORIES_LIST,
  SUPPORTED_LANGS,
  LANG_LABELS,
  resolveSkillFilePath,
  type Lang,
} from '@/lib/content'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ category: string; slug: string[] }>
  searchParams: Promise<{ lang?: string }>
}

export async function generateStaticParams() {
  const skills = getAllSkills()
  return skills.map(skill => ({
    category: skill.category,
    slug: skill.slug.split('/'),
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params
  const skills = getAllSkills()
  const skill = skills.find(s => s.category === category && s.slug === slug.join('/'))
  if (!skill) return { title: 'Not Found' }
  return { title: `${skill.title} — ${CATEGORY_LABELS[category]} Skill` }
}

export default async function SkillPage({ params, searchParams }: Props) {
  const { category, slug } = await params
  const { lang: langParam } = await searchParams
  const lang: Lang = SUPPORTED_LANGS.includes(langParam as Lang) ? (langParam as Lang) : 'en'

  const slugStr = slug.join('/')
  const skills = getAllSkills()
  const skill = skills.find(s => s.category === category && s.slug === slugStr)
  if (!skill) notFound()

  const filePath = resolveSkillFilePath(skill.filePath, lang)
  const content = readSkillContent(filePath)
  const html = await marked(content)

  const skillUrl = `/skills/${category}/${slugStr}`

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/skills" className="font-bold hover:underline text-gray-500">Skills</Link>
        <span className="text-gray-400">/</span>
        <Link href={`/skills/${category}`} className="font-bold hover:underline text-gray-500">
          {CATEGORY_LABELS[category]}
        </Link>
        <span className="text-gray-400">/</span>
        <span className="font-bold">{skill.title}</span>
      </div>

      {/* Header */}
      <div className="neo-card p-6 mb-6 bg-orange-500">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black">{skill.title}</h1>
            <p className="font-mono text-sm text-gray-700 mt-2">/{category}/{slugStr}</p>
          </div>
          <span className="neo-btn px-3 py-1 bg-black text-white text-xs text-center shrink-0">
            {CATEGORY_LABELS[category]}
          </span>
        </div>
      </div>

      {/* Language switcher */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        <span className="text-sm font-bold text-gray-500">Language:</span>
        {SUPPORTED_LANGS.map(l => (
          <Link
            key={l}
            href={l === 'en' ? skillUrl : `${skillUrl}?lang=${l}`}
            className={`text-xs font-bold px-3 py-1.5 border-2 border-black transition-colors ${
              lang === l
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-orange-500 hover:text-white'
            }`}
          >
            {LANG_LABELS[l]}
          </Link>
        ))}
      </div>

      {/* Content */}
      <div
        className="neo-card p-8 prose-retro"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Navigation */}
      <div className="mt-8 flex gap-4">
        <Link href={`/skills/${category}`} className="neo-btn px-4 py-2 bg-orange-500 text-black text-sm">
          ← Back to {CATEGORY_LABELS[category]}
        </Link>
        <Link href="/skills" className="neo-btn px-4 py-2 bg-white text-black text-sm">
          All Skills
        </Link>
      </div>
    </div>
  )
}
