// pages/dashboard.jsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import DashboardLayout    from '../components/DashboardLayout'
import HomeContent         from '../components/HomeContent'
import ContactsContent     from '../components/ContactsContent'
import AutomationContent   from '../components/AutomationContent'
import LiveChatContent     from '../components/LiveChatContent'
import BroadcastingContent from '../components/BroadcastingContent'
import SettingsContent     from '../components/SettingsContent'
import { userMenu }        from '../data/menus'

export default function UserDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()

  // 1) While NextAuth is checking your session
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading…
      </div>
    )
  }

  // 2) If not signed in, or not a “user”, redirect to /login
  if (!session || session.user.role !== 'user') {
    useEffect(() => {
      router.replace('/login')
    }, [router])
    return null
  }

  // 3) Authenticated as “user” → render the dashboard
  return (
    <DashboardLayout menuItems={userMenu}>
      {(selected) => {
        switch (selected) {
          case 'home':         return <HomeContent />
          case 'contacts':     return <ContactsContent />
          case 'automation':   return <AutomationContent />
          case 'livechat':     return <LiveChatContent />
          case 'broadcasting': return <BroadcastingContent />
          case 'settings':     return <SettingsContent />
          default:             return <HomeContent />
        }
      }}
    </DashboardLayout>
  )
}
