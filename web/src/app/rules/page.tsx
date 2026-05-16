import { getAllRules } from '@/lib/content'
import { RulesClient } from './rules-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Rules' }

export default function RulesPage() {
  const rules = getAllRules()
  return <RulesClient rules={rules} />
}
