import { getAllHooks } from '@/lib/content'
import { HooksClient } from './hooks-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Hooks' }

export default function HooksPage() {
  const hooks = getAllHooks()
  return <HooksClient hooks={hooks} />
}
