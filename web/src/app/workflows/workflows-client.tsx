'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { SearchInput } from '@/components/search-input'
import type { WorkflowMeta } from '@/lib/content'

const WORKFLOW_DESCRIPTIONS: Record<string, string> = {
  'feature-development': 'End-to-end process for taking a feature from idea to merged PR.',
  'debugging-session': 'Structured approach to diagnosing and fixing bugs systematically.',
  'code-review': 'How to use Claude to review PRs thoroughly and consistently.',
  'refactor-safely': 'Incremental refactoring with test coverage at every step.',
  'new-project-bootstrap': 'Scaffold a new project with the right structure from day one.',
}

const WORKFLOW_COLORS: Record<string, string> = {
  'feature-development': 'bg-blue-400',
  'debugging-session': 'bg-red-400',
  'code-review': 'bg-green-400',
  'refactor-safely': 'bg-purple-400',
  'new-project-bootstrap': 'bg-orange-400',
}

const LANGUAGES = [
  { code: 'en', label: 'EN' }, { code: 'fr', label: 'FR' },
  { code: 'de', label: 'DE' }, { code: 'nl', label: 'NL' }, { code: 'es', label: 'ES' },
]

export function WorkflowsClient({ workflows }: { workflows: WorkflowMeta[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return workflows
    const q = query.toLowerCase()
    return workflows.filter(w => w.title.toLowerCase().includes(q) || w.slug.toLowerCase().includes(q))
  }, [workflows, query])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-4xl font-black">Workflows</h1>
        <p className="text-gray-600 mt-1">{workflows.length} end-to-end processes — reference before starting a complex task</p>
      </div>

      <SearchInput value={query} onChange={setQuery} placeholder="Search workflows..." />

      <div className="neo-card p-4 mb-10 bg-orange-50 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <p className="text-sm font-bold text-gray-700">Workflows are reference documents, not slash commands. Read one before starting a complex task.</p>
        <div className="flex gap-1 shrink-0">
          {LANGUAGES.map(l => (
            <span key={l.code} className="text-xs font-bold px-2 py-1 border border-black bg-white">{l.label}</span>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="neo-card p-10 text-center">
          <p className="font-bold text-gray-500 mb-2">No workflows match &quot;{query}&quot;</p>
          <button onClick={() => setQuery('')} className="neo-btn px-4 py-2 bg-orange-500 text-black text-sm">Clear</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(wf => (
            <Link key={wf.slug} href={`/workflows/${wf.slug}`} className="neo-card neo-card-hover p-6 group flex gap-4">
              <div className={`w-12 h-12 shrink-0 ${WORKFLOW_COLORS[wf.slug] ?? 'bg-gray-300'} border-2 border-black flex items-center justify-center font-black text-lg`}>
                {wf.title.charAt(0)}
              </div>
              <div>
                <h2 className="font-black text-lg group-hover:underline">{wf.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{WORKFLOW_DESCRIPTIONS[wf.slug] ?? ''}</p>
                <div className="flex gap-1 mt-3">
                  {LANGUAGES.map(l => (
                    <span key={l.code} className="text-xs font-bold px-1.5 py-0.5 border border-black bg-orange-100">{l.label}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
