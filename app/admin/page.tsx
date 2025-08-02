import { requireAdmin } from '@/lib/auth'
import AdminClient from './admin-client'

export default async function AdminPage() {
  await requireAdmin()
  
  return <AdminClient />
}