// pages/dashboard.jsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Get our custom JWT cookie
    const token = Cookies.get('token')
    if (!token) {
      // No token → not logged in → redirect to /login
      router.replace('/login')
      return
    }

    try {
      // 2. Manually decode the payload:
      const payloadJson = atob(token.split('.')[1])
      const payload = JSON.parse(payloadJson)
      // Expecting payload.role to exist
      if (payload.role !== 'user') {
        // Not a "user" → redirect to /login
        router.replace('/login')
        return
      }

      // If we reach here, role === 'user', so allow rendering
      setLoading(false)
    } catch (err) {
      // Invalid token or parse error → redirect
      console.error('Invalid token or parsing error:', err)
      router.replace('/login')
    }
  }, [router])

  // 3. While checking, show loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading…
      </div>
    )
  }

  // 4. Render the user dashboard layout
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
