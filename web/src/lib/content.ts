import fs from 'fs'
import path from 'path'

// Re-export all client-safe constants from constants.ts
export {
  CATEGORY_LABELS, CATEGORY_COLORS, SKILL_CATEGORIES_LIST,
  SUPPORTED_LANGS, LANG_LABELS,
} from './constants'
export type { SkillMeta, Lang } from './constants'
import type { SkillMeta, Lang } from './constants'
import { SUPPORTED_LANGS, SKILL_CATEGORIES_LIST } from './constants'

const REPO_ROOT = path.resolve(process.cwd(), '..')

// ── Types ─────────────────────────────────────────────────────────────────────

export type GuideMeta = { id: string; slug: string; title: string; filePath: string }
export type AgentMeta = { id: string; category: string; slug: string; title: string; filePath: string }
export type RuleMeta  = { id: string; category: string; slug: string; title: string; filePath: string }
export type PromptMeta = { id: string; category: string; slug: string; title: string; filePath: string }
export type WorkflowMeta = { slug: string; title: string; filePath: string }
export type HookMeta = {
  id: string; category: string; slug: string; title: string
  event: string; mdPath: string; shPath: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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
    .replace(/Spring Boot/, 'Spring Boot')
}

function isLangDir(name: string): boolean {
  return (SUPPORTED_LANGS as readonly string[]).includes(name)
}

function parseFrontmatter(content: string): Record<string, string> {
  if (!content.startsWith('---')) return {}
  const end = content.indexOf('---', 3)
  if (end === -1) return {}
  const yaml = content.slice(3, end).trim()
  const result: Record<string, string> = {}
  for (const line of yaml.split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const val = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '')
    result[key] = val
  }
  return result
}

function readMarkdownFiles(dir: string, prefix = ''): { slug: string; title: string; filePath: string; description?: string }[] {
  const results: { slug: string; title: string; filePath: string; description?: string }[] = []
  if (!fs.existsSync(dir)) return results
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory() && !isLangDir(entry.name)) {
      results.push(...readMarkdownFiles(full, prefix ? `${prefix}/${entry.name}` : entry.name))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const slug = prefix ? `${prefix}/${entry.name.replace(/\.md$/, '')}` : entry.name.replace(/\.md$/, '')
      const content = fs.readFileSync(full, 'utf-8')
      const fm = parseFrontmatter(content)
      results.push({ slug, title: titleFromFilename(entry.name), filePath: full, description: fm.description })
    }
  }
  return results
}

// ── Skills ────────────────────────────────────────────────────────────────────

export function getAllSkills(): SkillMeta[] {
  const skills: SkillMeta[] = []
  for (const category of SKILL_CATEGORIES_LIST) {
    const dir = path.join(REPO_ROOT, 'skills', category)
    for (const f of readMarkdownFiles(dir)) {
      skills.push({ id: `${category}/${f.slug}`, category, slug: f.slug, title: f.title, filePath: f.filePath, description: f.description })
    }
  }
  return skills
}

export function getSkillsByCategory(category: string): SkillMeta[] {
  return readMarkdownFiles(path.join(REPO_ROOT, 'skills', category)).map(f => ({
    id: `${category}/${f.slug}`, category, slug: f.slug, title: f.title, filePath: f.filePath, description: f.description,
  }))
}

export function readSkillContent(filePath: string): string {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : ''
}

// ── Language resolution ───────────────────────────────────────────────────────

export function resolveSkillFilePath(englishFilePath: string, lang: Lang): string {
  if (lang === 'en') return englishFilePath
  const translated = path.join(path.dirname(englishFilePath), lang, path.basename(englishFilePath))
  return fs.existsSync(translated) ? translated : englishFilePath
}

export function resolveGuideFilePath(slug: string, lang: Lang): string {
  if (lang === 'en') return path.join(REPO_ROOT, 'guides', `${slug}.md`)
  const translated = path.join(REPO_ROOT, 'guides', lang, `${slug}.md`)
  return fs.existsSync(translated) ? translated : path.join(REPO_ROOT, 'guides', `${slug}.md`)
}

// ── Guides ────────────────────────────────────────────────────────────────────

export function getAllGuides(lang = 'en'): GuideMeta[] {
  const dir = lang === 'en' ? path.join(REPO_ROOT, 'guides') : path.join(REPO_ROOT, 'guides', lang)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(e => e.isFile() && e.name.endsWith('.md'))
    .map(e => {
      const slug = e.name.replace(/\.md$/, '')
      return { id: slug, slug, title: titleFromFilename(e.name), filePath: path.join(dir, e.name) }
    })
}

// ── Agents ────────────────────────────────────────────────────────────────────

export function getAllAgents(): AgentMeta[] {
  const dir = path.join(REPO_ROOT, 'agents')
  if (!fs.existsSync(dir)) return []
  const results: AgentMeta[] = []
  for (const cat of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!cat.isDirectory() || isLangDir(cat.name)) continue
    for (const f of fs.readdirSync(path.join(dir, cat.name), { withFileTypes: true })) {
      if (!f.isFile() || !f.name.endsWith('.md')) continue
      const slug = f.name.replace(/\.md$/, '')
      results.push({
        id: `${cat.name}/${slug}`, category: cat.name, slug,
        title: titleFromFilename(f.name), filePath: path.join(dir, cat.name, f.name),
      })
    }
  }
  return results
}

// ── Rules ─────────────────────────────────────────────────────────────────────

export function getAllRules(): RuleMeta[] {
  const dir = path.join(REPO_ROOT, 'rules')
  if (!fs.existsSync(dir)) return []
  const results: RuleMeta[] = []
  for (const cat of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!cat.isDirectory() || isLangDir(cat.name)) continue
    for (const f of fs.readdirSync(path.join(dir, cat.name), { withFileTypes: true })) {
      if (!f.isFile() || !f.name.endsWith('.md')) continue
      const slug = f.name.replace(/\.md$/, '')
      results.push({
        id: `${cat.name}/${slug}`, category: cat.name, slug,
        title: titleFromFilename(f.name), filePath: path.join(dir, cat.name, f.name),
      })
    }
  }
  return results
}

// ── Prompts ───────────────────────────────────────────────────────────────────

export function getAllPrompts(): PromptMeta[] {
  const dir = path.join(REPO_ROOT, 'prompts')
  if (!fs.existsSync(dir)) return []
  const results: PromptMeta[] = []
  for (const cat of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!cat.isDirectory() || isLangDir(cat.name)) continue
    for (const f of fs.readdirSync(path.join(dir, cat.name), { withFileTypes: true })) {
      if (!f.isFile() || !f.name.endsWith('.md')) continue
      const slug = f.name.replace(/\.md$/, '')
      results.push({
        id: `${cat.name}/${slug}`, category: cat.name, slug,
        title: titleFromFilename(f.name), filePath: path.join(dir, cat.name, f.name),
      })
    }
  }
  return results
}

// ── Workflows ─────────────────────────────────────────────────────────────────

export function getAllWorkflows(lang: Lang = 'en'): WorkflowMeta[] {
  const dir = lang === 'en' ? path.join(REPO_ROOT, 'workflows') : path.join(REPO_ROOT, 'workflows', lang)
  const src = fs.existsSync(dir) ? dir : path.join(REPO_ROOT, 'workflows')
  if (!fs.existsSync(src)) return []
  return fs.readdirSync(src, { withFileTypes: true })
    .filter(e => e.isFile() && e.name.endsWith('.md'))
    .map(e => ({ slug: e.name.replace(/\.md$/, ''), title: titleFromFilename(e.name), filePath: path.join(src, e.name) }))
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

const HOOK_EVENT_MAP: Record<string, string> = {
  'pre-tool-use': 'PreToolUse',
  'post-tool-use': 'PostToolUse',
  'lifecycle': 'Lifecycle',
}

export function getAllHooks(): HookMeta[] {
  const dir = path.join(REPO_ROOT, 'hooks')
  if (!fs.existsSync(dir)) return []
  const results: HookMeta[] = []
  for (const cat of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!cat.isDirectory()) continue
    const catDir = path.join(dir, cat.name)
    for (const f of fs.readdirSync(catDir, { withFileTypes: true })) {
      if (!f.isFile() || !f.name.endsWith('.md')) continue
      const slug = f.name.replace(/\.md$/, '')
      const shPath = path.join(catDir, `${slug}.sh`)
      results.push({
        id: `${cat.name}/${slug}`, category: cat.name, slug,
        title: titleFromFilename(f.name), event: HOOK_EVENT_MAP[cat.name] ?? cat.name,
        mdPath: path.join(catDir, f.name), shPath: fs.existsSync(shPath) ? shPath : '',
      })
    }
  }
  return results
}
