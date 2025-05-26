// pages/admin.jsx
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import DashboardLayout from '../components/DashboardLayout'
import AdminUsers      from '../components/AdminUsers'
import AuditLogs       from '../components/AuditLogs'
import AdminSettings   from '../components/AdminSettings'
import { adminFullMenu } from '../data/menus'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    } else if (
      status === 'authenticated' &&
      session.user.role !== 'admin'
    ) {
      router.replace('/login')
    }
  }, [status, session, router])

  if (status !== 'authenticated') {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading…
      </div>
    )
  }

  return (
    <DashboardLayout menuItems={adminFullMenu}>
      {(selected) => {
        switch (selected) {
          // user items
          case 'home':         return <div>Home (user)</div>
          case 'contacts':     return <div>Contacts (user)</div>
          case 'automation':   return <div>Automation (user)</div>
          case 'livechat':     return <div>Live Chat (user)</div>
          case 'broadcasting': return <div>Broadcasting (user)</div>
          case 'settings':     return <div>User Settings</div>

          // admin items
          case 'users':          return <AdminUsers />
          case 'logs':           return <AuditLogs />
          case 'settings_admin': return <AdminSettings />

          default:
            return <AdminUsers />
        }
      }}
    </DashboardLayout>
  )
}
