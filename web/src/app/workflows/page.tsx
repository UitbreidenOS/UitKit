import { getAllWorkflows } from '@/lib/content'
import { WorkflowsClient } from './workflows-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Workflows' }

export default function WorkflowsPage() {
  const workflows = getAllWorkflows()
  return <WorkflowsClient workflows={workflows} />
}
