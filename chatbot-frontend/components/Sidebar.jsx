// File: components/Sidebar.jsx
import React, { useState } from 'react'
import AccountSwitcher from './AccountSwitcher'
import UserProfile from './UserProfile'
import { Menu, X } from 'lucide-react'

export default function Sidebar({
  menuItems, selected, onSelect,
  accounts, currentAccount, onSwitchAccount,
  pages, currentPage, onSwitchPage
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [open, setOpen] = useState(false) // for burger menu

  const toggleMenu = () => {
    setOpen(o => !o)
    setCollapsed(c => !c) // also collapse text when toggled
  }

  return (
    <>
      {/* Hamburger button (always visible on small screens) */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 p-2 bg-[#1F2E3E] text-white rounded md:hidden"
      >
        {open ? <X /> : <Menu />}
      </button>

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-[#1F2E3E] border-r border-[#2C3A4A]
                    transform transition-transform duration-300 ease-in-out z-40
                    ${collapsed ? 'w-16' : 'w-60'}
                    ${open ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0 md:relative`}
      >
        {/* Collapse button (desktop only) */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="p-2 m-2 text-gray-300 hover:text-white self-end hidden md:block"
          type="button"
        >
          <Menu />
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
            collapsed={collapsed}
          />
        </div>

        {/* Navigation menu */}
        <nav className="flex-1 overflow-y-auto mt-4">
          {menuItems.map(item => (
            <button
              key={item.key}
              onClick={() => {
                onSelect(item.key)
                setOpen(false) // auto-close on mobile after selecting
              }}
              className={`flex items-center w-full p-2 my-1 transition-colors
                          ${selected === item.key
                            ? 'bg-green-600 text-white'
                            : 'text-gray-300 hover:bg-[#2C3A4A]'}`}
            >
              <item.icon className="w-5 h-5" />
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
    </>
  )
}
