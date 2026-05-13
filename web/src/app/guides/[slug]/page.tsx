import { notFound } from 'next/navigation'
import Link from 'next/link'
import { marked } from 'marked'
import {
  getAllGuides,
  readSkillContent,
  resolveGuideFilePath,
  SUPPORTED_LANGS,
  LANG_LABELS,
  type Lang,
} from '@/lib/content'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lang?: string }>
}

export async function generateStaticParams() {
  const guides = getAllGuides()
  return guides.map(g => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guides = getAllGuides()
  const guide = guides.find(g => g.slug === slug)
  if (!guide) return { title: 'Not Found' }
  return { title: guide.title }
}

export default async function GuidePage({ params, searchParams }: Props) {
  const { slug } = await params
  const { lang: langParam } = await searchParams
  const lang: Lang = SUPPORTED_LANGS.includes(langParam as Lang) ? (langParam as Lang) : 'en'

  const guides = getAllGuides()
  const guide = guides.find(g => g.slug === slug)
  if (!guide) notFound()

  const filePath = resolveGuideFilePath(slug, lang)
  const content = readSkillContent(filePath)
  const html = await marked(content)

  const guideUrl = `/guides/${slug}`

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/guides" className="font-bold hover:underline text-gray-500">Guides</Link>
        <span className="text-gray-400">/</span>
        <span className="font-bold">{guide.title}</span>
      </div>

      {/* Header */}
      <div className="neo-card p-6 mb-6 bg-orange-500">
        <h1 className="text-3xl font-black">{guide.title}</h1>
      </div>

      {/* Language switcher */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        <span className="text-sm font-bold text-gray-500">Language:</span>
        {SUPPORTED_LANGS.map(l => (
          <Link
            key={l}
            href={l === 'en' ? guideUrl : `${guideUrl}?lang=${l}`}
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

      <div className="mt-8">
        <Link href="/guides" className="neo-btn px-4 py-2 bg-orange-500 text-black text-sm">
          ← All Guides
        </Link>
      </div>
    </div>
  )
}
