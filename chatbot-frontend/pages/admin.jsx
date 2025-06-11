// pages/admin.jsx
import { getSession } from 'next-auth/react'
import DashboardLayout from '../components/DashboardLayout'

// user pages
import HomeContent         from '../components/HomeContent'
import ContactsContent     from '../components/ContactsContent'
import AutomationContent   from '../components/AutomationContent'
import LiveChatContent     from '../components/LiveChatContent'
import BroadcastingContent from '../components/BroadcastingContent'
import SettingsContent     from '../components/SettingsContent'

// admin pages
import AdminUsers      from '../components/AdminUsers'
import AuditLogs       from '../components/AuditLogs'
import AdminSettings   from '../components/AdminSettings'

// menus
import { userMenu, adminFullMenu } from '../data/menus'

export default function AdminPage({ session }) {
  // 1) Merge user + admin items
  const menuItems = [...userMenu, ...adminFullMenu]

  return (
    <DashboardLayout menuItems={menuItems}>
      {selected => {
        // 2) Render user pages
        switch (selected) {
          case 'home':
            return <HomeContent />
          case 'contacts':
            return <ContactsContent />
          case 'automation':
            return <AutomationContent />
          case 'livechat':
            return <LiveChatContent />
          case 'broadcasting':
            return <BroadcastingContent />
          case 'settings':
            return <SettingsContent />

          // 3) Render admin pages
          case 'users':
            return <AdminUsers />
          case 'logs':
            return <AuditLogs />
          case 'settings_admin':
            return <AdminSettings />

          default:
            return <p className="text-gray-500">Select a section</p>
        }
      }}
    </DashboardLayout>
  )
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx)
  if (!session || session.user.role !== 'admin') {
    return { redirect: { destination: '/dashboard', permanent: false } }
  }
  return { props: { session } }
}
