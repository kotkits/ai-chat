// pages/admin.jsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import DashboardLayout     from '../components/DashboardLayout'
import HomeContent         from '../components/HomeContent'
import ContactsContent     from '../components/ContactsContent'
import AutomationContent   from '../components/AutomationContent'
import LiveChatContent     from '../components/LiveChatContent'
import BroadcastingContent from '../components/BroadcastingContent'
import SettingsContent     from '../components/SettingsContent'
import AdminUsers          from '../components/AdminUsers'
import AuditLogs           from '../components/AuditLogs'
import AdminSettings       from '../components/AdminSettings'
import { adminFullMenu }   from '../data/menus'

export default function AdminDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()

  // If NextAuth is still loading the session, show nothing (or a spinner)
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading…
      </div>
    )
  }

  // If there is no session or the role isn’t "admin", redirect to /login
  if (!session || session.user.role !== 'admin') {
    useEffect(() => {
      router.replace('/login')
    }, [router])
    return null
  }

  // At this point, we know the user is authenticated and has role "admin"
  return (
    <DashboardLayout menuItems={adminFullMenu}>
      {(selected) => {
        switch (selected) {
          // user‐portal items (admins can still access these)
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

          // default to home
          default: return <HomeContent />
        }
      }}
    </DashboardLayout>
  )
}
