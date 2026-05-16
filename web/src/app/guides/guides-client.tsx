'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { SearchInput } from '@/components/search-input'
import type { GuideMeta } from '@/lib/content'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'es', label: 'Español' },
]

export function GuidesClient({ guides }: { guides: GuideMeta[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return guides
    const q = query.toLowerCase()
    return guides.filter(g => g.title.toLowerCase().includes(q) || g.slug.toLowerCase().includes(q))
  }, [guides, query])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-4xl font-black">Guides</h1>
        <p className="text-gray-600 mt-1">{guides.length} guides — in-depth Claude Code documentation in 5 languages</p>
      </div>

      <SearchInput value={query} onChange={setQuery} placeholder="Search guides..." />

      <div className="neo-card p-4 mb-8 flex flex-wrap gap-3">
        {LANGUAGES.map(lang => (
          <span key={lang.code} className="neo-btn px-3 py-1 bg-black text-white text-sm">{lang.label}</span>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(guide => (
            <Link key={guide.id} href={`/guides/${guide.slug}`} className="neo-card neo-card-hover p-6 group">
              <div className="w-8 h-8 bg-black mb-4 group-hover:bg-orange-500 transition-colors"></div>
              <h2 className="font-black text-lg group-hover:underline mb-2">{guide.title}</h2>
              <div className="flex gap-1 flex-wrap">
                {LANGUAGES.map(lang => (
                  <span key={lang.code} className="text-xs font-bold px-1.5 py-0.5 border border-black bg-orange-100">
                    {lang.code.toUpperCase()}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="neo-card p-10 text-center">
          <p className="font-bold text-gray-500 mb-2">No guides match &quot;{query}&quot;</p>
          <button onClick={() => setQuery('')} className="neo-btn px-4 py-2 bg-orange-500 text-black text-sm">Clear</button>
        </div>
      )}
    </div>
  )
}
