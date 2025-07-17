// File: components/Sidebar.jsx
import React, { useState } from 'react'
import AccountSwitcher from './AccountSwitcher'
import UserProfile     from './UserProfile'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Sidebar({
  menuItems, selected, onSelect,
  accounts, currentAccount, onSwitchAccount,
  pages, currentPage, onSwitchPage
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`flex flex-col h-screen bg-[#1F2E3E] border-r border-[#2C3A4A]
                  transition-all duration-200
                  ${collapsed ? 'w-16' : 'w-60'}`}
    >
      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="p-2 m-2 text-gray-300 hover:text-white self-end"
        type="button"
      >
        {collapsed ? <ChevronRight/> : <ChevronLeft/>}
      </button>

      {/* Account & Page switcher */}
      <div className="flex-shrink-0">
        <AccountSwitcher
          accounts={accounts}
          currentAccount={currentAccount}
          onSwitchAccount={onSwitchAccount}
          pages={pages}
          currentPage={currentPage}
          onSwitchPage={onSwitchPage}
          collapsed={collapsed}   // you can use this prop to hide labels inside AccountSwitcher
        />
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 overflow-y-auto mt-4">
        {menuItems.map(item => (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={`flex items-center w-full p-2 my-1 transition-colors
                        ${selected === item.key
                          ? 'bg-green-600 text-white'
                          : 'text-gray-300 hover:bg-[#2C3A4A]'}`}
          >
            <item.icon className="w-5 h-5"/>
            {!collapsed && (
              <span className="ml-3">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* User profile at bottom */}
      <div className="p-2 mb-4">
        <UserProfile collapsed={collapsed} />
      </div>
    </aside>
  )
}
