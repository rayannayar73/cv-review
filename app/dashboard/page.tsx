import { requireAuth } from '@/lib/auth'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  await requireAuth()
  
  return <DashboardClient />
}