// chatbot-frontend/components/DashboardLayout.jsx
import { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function DashboardLayout({ menuItems, children }) {
  const [selected, setSelected] = useState(menuItems[0].key)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-[#f8faff]">
      <Navbar toggleSidebar={() => setCollapsed(c => !c)} />
      <div className="flex flex-1 min-h-0">
        <Sidebar
          menuItems={menuItems}
          selected={selected}
          onSelect={setSelected}
          collapsed={collapsed}
        />
        <main className="flex-1 p-8 overflow-auto">
          {children(selected)}
        </main>
      </div>
    </div>
  )
}
