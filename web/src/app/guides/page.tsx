import { getAllGuides } from '@/lib/content'
import { GuidesClient } from './guides-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Guides' }

export default function GuidesPage() {
  const guides = getAllGuides()
  return <GuidesClient guides={guides} />
}
