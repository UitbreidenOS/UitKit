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
  'gtm',
  'git',
  'productivity',
  'automation',
  'legal',
  'finance',
]

export const CATEGORY_LABELS: Record<string, string> = {
  'backend': 'Backend',
  'devops-infra': 'DevOps & Infra',
  'data-ml': 'Data & ML',
  'database': 'Database',
  'finance-payments': 'Finance & Payments',
  'ai-engineering': 'AI Engineering',
  'gtm': 'GTM & RevOps',
  'git': 'Git Workflows',
  'productivity': 'Productivity',
  'automation': 'Automation',
  'legal': 'Legal',
  'finance': 'Finance',
}

export const CATEGORY_COLORS: Record<string, string> = {
  'backend': 'bg-blue-400',
  'devops-infra': 'bg-orange-400',
  'data-ml': 'bg-purple-400',
  'database': 'bg-green-400',
  'finance-payments': 'bg-yellow-400',
  'ai-engineering': 'bg-pink-400',
  'gtm': 'bg-cyan-500',
  'git': 'bg-gray-700',
  'productivity': 'bg-teal-400',
  'automation': 'bg-indigo-400',
  'legal': 'bg-slate-500',
  'finance': 'bg-emerald-500',
}

export const SUPPORTED_LANGS = ['en', 'fr', 'de', 'nl', 'es'] as const
export type Lang = typeof SUPPORTED_LANGS[number]

export const LANG_LABELS: Record<Lang, string> = {
  en: 'EN', fr: 'FR', de: 'DE', nl: 'NL', es: 'ES',
}
