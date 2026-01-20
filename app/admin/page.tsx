import { cookies } from 'next/headers'
import { AdminDashboard } from '@/components/admin-dashboard'
import { AdminLogin } from '@/components/admin-login'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  
  if (!session) {
    return <AdminLogin />
  }
  
  return <AdminDashboard />
}
