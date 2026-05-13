import fs from 'fs'
import path from 'path'

const REPO_ROOT = path.resolve(process.cwd(), '..')

export type SkillMeta = {
  id: string
  category: string
  slug: string
  title: string
  filePath: string
}

export type GuideMeta = {
  id: string
  slug: string
  title: string
  filePath: string
}

export type AgentMeta = {
  id: string
  category: string
  slug: string
  title: string
  filePath: string
}

const SKILL_CATEGORIES = [
  'backend',
  'devops-infra',
  'data-ml',
  'database',
  'finance-payments',
  'ai-engineering',
]

function titleFromFilename(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .replace(/Dotnet/, '.NET')
    .replace(/Csharp/, 'C#')
    .replace(/Nodejs/, 'Node.js')
    .replace(/Graphql/, 'GraphQL')
    .replace(/Dbt/, 'dbt')
}

function readMarkdownFiles(dir: string, prefix: string = ''): { slug: string; title: string; filePath: string }[] {
  const results: { slug: string; title: string; filePath: string }[] = []
  if (!fs.existsSync(dir)) return results

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    // Skip language subdirs
    if (entry.isDirectory() && ['fr', 'de', 'nl', 'es'].includes(entry.name)) continue
    if (entry.isDirectory()) {
      results.push(...readMarkdownFiles(fullPath, prefix ? `${prefix}/${entry.name}` : entry.name))
    } else if (entry.name.endsWith('.md')) {
      const slug = prefix ? `${prefix}/${entry.name.replace(/\.md$/, '')}` : entry.name.replace(/\.md$/, '')
      results.push({ slug, title: titleFromFilename(entry.name), filePath: fullPath })
    }
  }
  return results
}

export function getAllSkills(): SkillMeta[] {
  const skills: SkillMeta[] = []
  for (const category of SKILL_CATEGORIES) {
    const dir = path.join(REPO_ROOT, 'skills', category)
    const files = readMarkdownFiles(dir)
    for (const f of files) {
      skills.push({
        id: `${category}/${f.slug}`,
        category,
        slug: f.slug,
        title: f.title,
        filePath: f.filePath,
      })
    }
  }
  return skills
}

export function getSkillsByCategory(category: string): SkillMeta[] {
  const dir = path.join(REPO_ROOT, 'skills', category)
  return readMarkdownFiles(dir).map(f => ({
    id: `${category}/${f.slug}`,
    category,
    slug: f.slug,
    title: f.title,
    filePath: f.filePath,
  }))
}

export function readSkillContent(filePath: string): string {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : ''
}

export const SUPPORTED_LANGS = ['en', 'fr', 'de', 'nl', 'es'] as const
export type Lang = typeof SUPPORTED_LANGS[number]

export const LANG_LABELS: Record<Lang, string> = {
  en: 'EN',
  fr: 'FR',
  de: 'DE',
  nl: 'NL',
  es: 'ES',
}

/**
 * Resolves the file path for a skill in a given language.
 * Translated files live in a `{lang}/` subdirectory next to the English file.
 * Falls back to English if the translation doesn't exist.
 */
export function resolveSkillFilePath(englishFilePath: string, lang: Lang): string {
  if (lang === 'en') return englishFilePath
  const dir = path.dirname(englishFilePath)
  const filename = path.basename(englishFilePath)
  const translated = path.join(dir, lang, filename)
  return fs.existsSync(translated) ? translated : englishFilePath
}

/**
 * Resolves the file path for a guide in a given language.
 */
export function resolveGuideFilePath(slug: string, lang: Lang): string {
  if (lang === 'en') {
    return path.join(REPO_ROOT, 'guides', `${slug}.md`)
  }
  const translated = path.join(REPO_ROOT, 'guides', lang, `${slug}.md`)
  const fallback = path.join(REPO_ROOT, 'guides', `${slug}.md`)
  return fs.existsSync(translated) ? translated : fallback
}

export function getAllGuides(lang: string = 'en'): GuideMeta[] {
  const dir = lang === 'en'
    ? path.join(REPO_ROOT, 'guides')
    : path.join(REPO_ROOT, 'guides', lang)
  const results: GuideMeta[] = []
  if (!fs.existsSync(dir)) return results

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) continue
    if (!entry.name.endsWith('.md')) continue
    const slug = entry.name.replace(/\.md$/, '')
    results.push({ id: slug, slug, title: titleFromFilename(entry.name), filePath: path.join(dir, entry.name) })
  }
  return results
}

export function getAllAgents(): AgentMeta[] {
  const agentsDir = path.join(REPO_ROOT, 'agents')
  const results: AgentMeta[] = []
  if (!fs.existsSync(agentsDir)) return results

  for (const catEntry of fs.readdirSync(agentsDir, { withFileTypes: true })) {
    if (!catEntry.isDirectory()) continue
    const catDir = path.join(agentsDir, catEntry.name)
    for (const fileEntry of fs.readdirSync(catDir, { withFileTypes: true })) {
      if (!fileEntry.name.endsWith('.md')) continue
      const slug = fileEntry.name.replace(/\.md$/, '')
      results.push({
        id: `${catEntry.name}/${slug}`,
        category: catEntry.name,
        slug,
        title: titleFromFilename(fileEntry.name),
        filePath: path.join(catDir, fileEntry.name),
      })
    }
  }
  return results
}

export const CATEGORY_LABELS: Record<string, string> = {
  'backend': 'Backend',
  'devops-infra': 'DevOps & Infra',
  'data-ml': 'Data & ML',
  'database': 'Database',
  'finance-payments': 'Finance & Payments',
  'ai-engineering': 'AI Engineering',
}

export const CATEGORY_COLORS: Record<string, string> = {
  'backend': 'bg-blue-400',
  'devops-infra': 'bg-orange-400',
  'data-ml': 'bg-purple-400',
  'database': 'bg-green-400',
  'finance-payments': 'bg-yellow-400',
  'ai-engineering': 'bg-pink-400',
}

export const SKILL_CATEGORIES_LIST = SKILL_CATEGORIES
