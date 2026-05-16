import Link from 'next/link'
import type { SkillMeta } from '@/lib/constants'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/constants'

export function SkillCard({ skill }: { skill: SkillMeta }) {
  const categoryColor = CATEGORY_COLORS[skill.category] ?? 'bg-gray-200'
  const categoryLabel = CATEGORY_LABELS[skill.category] ?? skill.category

  return (
    <Link
      href={`/skills/${skill.category}/${skill.slug}`}
      className="neo-card neo-card-hover flex flex-col p-5 group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-black text-base leading-tight group-hover:underline">
          {skill.title}
        </h3>
        <span className={`shrink-0 text-xs font-bold px-2 py-0.5 border border-black ${categoryColor}`}>
          {categoryLabel}
        </span>
      </div>
      {skill.description && (
        <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2">{skill.description}</p>
      )}
      <span className="text-xs text-gray-400 font-mono mt-auto">/{skill.category}/{skill.slug}</span>
    </Link>
  )
}
