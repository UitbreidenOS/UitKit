'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { SearchInput } from '@/components/search-input'
import type { PromptMeta } from '@/lib/content'

const CATEGORY_LABELS: Record<string, string> = {
  'system-prompts': 'System Prompts',
  'project-starters': 'Project Starters',
  'task-specific': 'Task-Specific',
}

const CATEGORY_COLORS: Record<string, string> = {
  'system-prompts': 'bg-purple-400',
  'project-starters': 'bg-blue-400',
  'task-specific': 'bg-green-400',
}

export function PromptsClient({ prompts }: { prompts: PromptMeta[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  const categories = useMemo(() => [...new Set(prompts.map(p => p.category))], [prompts])

  const filtered = useMemo(() => {
    let result = prompts
    if (category) result = result.filter(p => p.category === category)
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
    }
    return result
  }, [prompts, query, category])

  const byCategory = useMemo(() =>
    filtered.reduce<Record<string, PromptMeta[]>>((acc, p) => {
      if (!acc[p.category]) acc[p.category] = []
      acc[p.category].push(p)
      return acc
    }, {}),
    [filtered]
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-4xl font-black">Prompts</h1>
        <p className="text-gray-600 mt-1">{prompts.length} reusable prompt templates — copy and adapt for your project</p>
      </div>

      <SearchInput value={query} onChange={setQuery} placeholder="Search prompts..." />

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button onClick={() => setCategory(null)} className={`neo-btn px-4 py-2 text-sm ${!category ? 'bg-black text-white' : 'bg-white text-black'}`}>
          All ({prompts.length})
        </button>
        {categories.map(cat => {
          const color = CATEGORY_COLORS[cat] ?? 'bg-gray-300'
          return (
            <button key={cat} onClick={() => setCategory(category === cat ? null : cat)}
              className={`neo-btn px-4 py-2 text-sm flex items-center gap-1.5 ${category === cat ? 'bg-black text-white' : 'bg-white text-black'}`}>
              <span className={`w-2.5 h-2.5 ${color} border border-black`}></span>
              {CATEGORY_LABELS[cat] ?? cat}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="neo-card p-10 text-center">
          <p className="font-bold text-gray-500 mb-2">No prompts match &quot;{query}&quot;</p>
          <button onClick={() => { setQuery(''); setCategory(null) }} className="neo-btn px-4 py-2 bg-orange-500 text-black text-sm">Clear</button>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(byCategory).map(([cat, catPrompts]) => {
            const color = CATEGORY_COLORS[cat] ?? 'bg-gray-300'
            return (
              <div key={cat}>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`w-3 h-3 ${color} border-2 border-black`}></span>
                  <h2 className="text-2xl font-black">{CATEGORY_LABELS[cat] ?? cat}</h2>
                </div>
                <div className="border-b-2 border-black mb-5" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catPrompts.map(prompt => (
                    <Link key={prompt.id} href={`/prompts/${prompt.id}`} className="neo-card neo-card-hover p-5 group">
                      <div className={`w-8 h-2 ${color} border border-black mb-4`}></div>
                      <h3 className="font-black text-base group-hover:underline">{prompt.title}</h3>
                      <p className="text-xs font-mono text-gray-400 mt-1">{prompt.id}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
