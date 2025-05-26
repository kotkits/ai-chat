// components/Sidebar.jsx
import React from 'react'
import { useSession } from 'next-auth/react'

export default function Sidebar({ menuItems, selected, onSelect, collapsed }) {
  const { data: session, status } = useSession()
  const name = session?.user?.name
    || session?.user?.email?.split('@')[0]
    || 'User'

  return (
    <aside
      className={`
        bg-[#4E71FF] ${collapsed ? 'w-16' : 'w-56'}
        flex flex-col py-6 h-screen transition-all duration-300
      `}
    >
      {/* Profile Button */}
      {status === 'authenticated' && (
        <div className={`mb-4 w-full ${collapsed ? 'flex justify-center' : 'px-6'}`}>
          <button
            className={`
              flex items-center w-full
              bg-white/90 hover:bg-[#E6EEFF]
              rounded-2xl py-3 px-3 mb-2 transition-colors
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <span
              className={`
                flex items-center justify-center
                rounded-full bg-[#BBFBFF] text-[#4E71FF]
                font-bold text-xl
                ${collapsed ? 'w-10 h-10' : 'w-11 h-11'}
                mr-0 ${collapsed ? '' : 'mr-3'}
              `}
            >
              <span className="material-symbols-outlined text-[28px]">
                account_circle
              </span>
            </span>
            {!collapsed && (
              <span className="flex flex-col text-left truncate">
                <span className="text-sm font-semibold text-[#4E71FF] truncate">
                  {name}
                </span>
                <span className="text-xs text-[#3155b3]/70">View Profile</span>
              </span>
            )}
          </button>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 flex flex-col gap-2 mt-2">
        {menuItems.map(({ key, label, icon, badge }) => {
          const isActive = selected === key
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`
                relative flex items-center h-14
                ${collapsed ? 'justify-center' : 'px-6'}
                rounded-xl text-lg focus:outline-none
                ${isActive
                  ? 'bg-white text-[#4E71FF] font-bold'
                  : 'bg-[#4E71FF] text-white hover:bg-[#5a85ff] active:bg-[#3155b3]'}
              `}
            >
              <span className={`material-symbols-outlined ${collapsed ? 'text-[28px]' : 'text-[30px]'}`}>
                {icon}
              </span>
              {!collapsed && <span className="ml-5 text-[17px]">{label}</span>}
              {badge && (
                <span className={`
                  absolute top-3 ${collapsed ? 'right-3' : 'right-7'}
                  flex h-5 w-5 items-center justify-center
                  rounded-full bg-[#BBFBFF] text-[13px] font-bold text-[#4E71FF]
                `}>
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Help Button */}
      <div className={`pt-4 pb-6 ${collapsed ? 'flex justify-center' : 'px-6'}`}>
        <button className="
          flex items-center px-3 py-3 rounded-xl
          text-[#4E71FF] bg-white hover:bg-[#BBFBFF]/60 active:bg-[#BBFBFF]
          w-full text-lg font-bold focus:outline-none
        ">
          <span className="material-symbols-outlined text-[25px]">help</span>
          {!collapsed && <span className="ml-4 text-[15px]">Help</span>}
        </button>
      </div>
    </aside>
  )
}
