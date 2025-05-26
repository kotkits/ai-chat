// pages/admin.jsx
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import DashboardLayout    from '../components/DashboardLayout'
import HomeContent        from '../components/HomeContent'
import ContactsContent    from '../components/ContactsContent'
import AutomationContent  from '../components/AutomationContent'
import LiveChatContent    from '../components/LiveChatContent'
import BroadcastingContent from '../components/BroadcastingContent'
import SettingsContent    from '../components/SettingsContent'
import AdminUsers         from '../components/AdminUsers'
import AuditLogs          from '../components/AuditLogs'
import AdminSettings      from '../components/AdminSettings'
import { adminFullMenu }  from '../data/menus'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Protect route: only admins allowed
  useEffect(() => {
    if (status === 'unauthenticated' ||
       (status === 'authenticated' && session.user.role !== 'admin')) {
      router.replace('/login')
    }
  }, [status, session, router])

  // Show loading until we know auth status
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
          // user‐portal items
          case 'home':         return <HomeContent />
          case 'contacts':     return <ContactsContent />
          case 'automation':   return <AutomationContent />
          case 'livechat':     return <LiveChatContent />
          case 'broadcasting': return <BroadcastingContent />
          case 'settings':     return <SettingsContent />

          // admin‐only items
          case 'users':          return <AdminUsers />
          case 'logs':           return <AuditLogs />
          case 'settings_admin': return <AdminSettings />

          // fallback
          default: return <HomeContent />
        }
      }}
    </DashboardLayout>
  )
}
