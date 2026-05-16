import { getAllPrompts } from '@/lib/content'
import { PromptsClient } from './prompts-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Prompts' }

export default function PromptsPage() {
  const prompts = getAllPrompts()
  return <PromptsClient prompts={prompts} />
}
