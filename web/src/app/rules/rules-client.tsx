'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { SearchInput } from '@/components/search-input'
import type { RuleMeta } from '@/lib/content'

const CATEGORY_LABELS: Record<string, string> = {
  common: 'Common Rules',
  'language-specific': 'Language-Specific Rules',
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  common: 'Universal coding, git, security, testing, and performance rules.',
  'language-specific': 'Opinionated rules for Python, TypeScript, and Go.',
}

export function RulesClient({ rules }: { rules: RuleMeta[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  const categories = useMemo(() => [...new Set(rules.map(r => r.category))], [rules])

  const filtered = useMemo(() => {
    let result = rules
    if (category) result = result.filter(r => r.category === category)
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(r => r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q))
    }
    return result
  }, [rules, query, category])

  const byCategory = useMemo(() =>
    filtered.reduce<Record<string, RuleMeta[]>>((acc, r) => {
      if (!acc[r.category]) acc[r.category] = []
      acc[r.category].push(r)
      return acc
    }, {}),
    [filtered]
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-4xl font-black">Rules</h1>
        <p className="text-gray-600 mt-1">{rules.length} always-on guidelines — add to your CLAUDE.md</p>
      </div>

      <SearchInput value={query} onChange={setQuery} placeholder="Search rules..." />

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setCategory(null)} className={`neo-btn px-4 py-2 text-sm ${!category ? 'bg-black text-white' : 'bg-white text-black'}`}>
          All ({rules.length})
        </button>
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(category === cat ? null : cat)}
            className={`neo-btn px-4 py-2 text-sm ${category === cat ? 'bg-black text-white' : 'bg-white text-black'}`}>
            {CATEGORY_LABELS[cat] ?? cat} ({rules.filter(r => r.category === cat).length})
          </button>
        ))}
      </div>

      <div className="neo-card p-5 mb-10 bg-orange-50">
        <p className="text-sm font-medium text-gray-700 leading-relaxed">
          Add rules to your <code className="bg-black text-white px-1.5 py-0.5 text-xs">CLAUDE.md</code>:
          <code className="ml-2 bg-black text-orange-300 px-2 py-0.5 text-xs font-mono">npx claudient add rules --write</code>
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="neo-card p-10 text-center">
          <p className="font-bold text-gray-500 mb-2">No rules match &quot;{query}&quot;</p>
          <button onClick={() => { setQuery(''); setCategory(null) }} className="neo-btn px-4 py-2 bg-orange-500 text-black text-sm">Clear</button>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(byCategory).map(([cat, catRules]) => (
            <div key={cat}>
              <div className="mb-2">
                <h2 className="text-2xl font-black">{CATEGORY_LABELS[cat] ?? cat}</h2>
                <p className="text-gray-500 text-sm mt-1">{CATEGORY_DESCRIPTIONS[cat] ?? ''}</p>
              </div>
              <div className="border-b-2 border-black mb-5" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {catRules.map(rule => (
                  <Link key={rule.id} href={`/rules/${rule.id}`} className="neo-card neo-card-hover p-5 group">
                    <div className="w-6 h-6 bg-black mb-3 group-hover:bg-orange-500 transition-colors"></div>
                    <h3 className="font-black text-base group-hover:underline">{rule.title}</h3>
                    <p className="text-xs font-mono text-gray-400 mt-1">{rule.id}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
