// pages/dashboard.jsx
import { getSession } from 'next-auth/react'
import DashboardLayout from '../components/DashboardLayout'

import HomeContent         from '../components/HomeContent'
import ContactsContent     from '../components/ContactsContent'
import AutomationContent   from '../components/AutomationContent'
import LiveChatContent     from '../components/LiveChatContent'
import BroadcastingContent from '../components/BroadcastingContent'
import SettingsContent     from '../components/SettingsContent'

import { userMenu } from '../data/menus'

export default function DashboardPage({ session }) {
  return (
    <DashboardLayout menuItems={userMenu}>
      {(selected, setSelected) => {
        switch (selected) {
          case 'home':
            return (
              <HomeContent
                onStart={() => setSelected('automation')}
              />
            )
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
          default:
            return (
              <HomeContent
                onStart={() => setSelected('automation')}
              />
            )
        }
      }}
    </DashboardLayout>
  )
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx)
  if (!session) {
    return {
      redirect: { destination: '/login', permanent: false }
    }
  }
  return { props: { session } }
}
