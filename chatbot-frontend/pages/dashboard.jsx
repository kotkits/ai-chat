// pages/dashboard.jsx
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import DashboardLayout from '../components/DashboardLayout'
import HomeContent         from '../components/HomeContent'
import ContactsContent     from '../components/ContactsContent'
import AutomationContent   from '../components/AutomationContent'
import LiveChatContent     from '../components/LiveChatContent'
import BroadcastingContent from '../components/BroadcastingContent'
import SettingsContent     from '../components/SettingsContent'
import { userMenu }        from '../data/menus'

export default function UserDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    } else if (status === 'authenticated' && session.user.role !== 'user') {
      router.replace('/login')
    }
  }, [status, session, router])

  if (status !== 'authenticated') {
    return <div className="flex items-center justify-center h-screen">Loading…</div>
  }

  return (
    <DashboardLayout menuItems={userMenu}>
      {(selected) => {
        switch (selected) {
          case 'home':        return <HomeContent />
          case 'contacts':    return <ContactsContent />
          case 'automation':  return <AutomationContent />
          case 'livechat':    return <LiveChatContent />
          case 'broadcasting':return <BroadcastingContent />
          case 'settings':    return <SettingsContent />
          default:            return <HomeContent />
        }
      }}
    </DashboardLayout>
  )
}
