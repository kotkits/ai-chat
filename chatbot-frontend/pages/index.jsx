// pages/index.jsx
import { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import HomeContent from '../components/HomeContent'
import ContactsContent from '../components/ContactsContent'
import AutomationContent from '../components/AutomationContent'
import LiveChatContent from '../components/LiveChatContent'
import BroadcastingContent from '../components/BroadcastingContent'
import SettingsContent from '../components/SettingsContent'
import { userMenu } from '../data/menus'  

export default function HomePage() {
  const [selected, setSelected] = useState('home')
  const [collapsed, setCollapsed] = useState(false)

  const renderContent = () => {
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
      default:
        return <HomeContent />
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8faff]">
      <Navbar toggleSidebar={() => setCollapsed((c) => !c)} />
      <div className="flex flex-1 min-h-0">
        <Sidebar
          menuItems={userMenu}          
          selected={selected}
          onSelect={setSelected}
          collapsed={collapsed}
        />
        <main className="flex-1 p-8 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
} 
