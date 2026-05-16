// Client-safe constants — no fs imports

export type SkillMeta = {
  id: string
  category: string
  slug: string
  title: string
  filePath: string
  description?: string
}

export const SKILL_CATEGORIES_LIST = [
  'backend',
  'devops-infra',
  'data-ml',
  'database',
  'finance-payments',
  'ai-engineering',
  'productivity',
]

export const CATEGORY_LABELS: Record<string, string> = {
  'backend': 'Backend',
  'devops-infra': 'DevOps & Infra',
  'data-ml': 'Data & ML',
  'database': 'Database',
  'finance-payments': 'Finance & Payments',
  'ai-engineering': 'AI Engineering',
  'productivity': 'Productivity',
}

export const CATEGORY_COLORS: Record<string, string> = {
  'backend': 'bg-blue-400',
  'devops-infra': 'bg-orange-400',
  'data-ml': 'bg-purple-400',
  'database': 'bg-green-400',
  'finance-payments': 'bg-yellow-400',
  'ai-engineering': 'bg-pink-400',
  'productivity': 'bg-teal-400',
}

export const SUPPORTED_LANGS = ['en', 'fr', 'de', 'nl', 'es'] as const
export type Lang = typeof SUPPORTED_LANGS[number]

export const LANG_LABELS: Record<Lang, string> = {
  en: 'EN', fr: 'FR', de: 'DE', nl: 'NL', es: 'ES',
}
