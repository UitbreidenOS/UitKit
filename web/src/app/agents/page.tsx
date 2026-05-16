import { getAllAgents } from '@/lib/content'
import { AgentsClient } from './agents-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Agents' }

export default function AgentsPage() {
  const agents = getAllAgents()
  return <AgentsClient agents={agents} />
}
