// components/Sidebar.jsx
import React from 'react'
import { useSession } from 'next-auth/react'

export default function Sidebar({
  menuItems,
  selected,
  onSelect,
  collapsed,
}) {
  const { data: session } = useSession()
  const name =
    session?.user?.name ||
    session?.user?.email?.split('@')[0] ||
    'User'

  return (
    <aside
      className={`
        bg-[#4E71FF] ${collapsed ? 'w-16' : 'w-56'}
        flex flex-col py-6 h-screen min-h-screen
        transition-all duration-300
        border-r border-[#BBFBFF]
        shadow-md
      `}
      style={{
        height: '100vh',           // Always full viewport height
        minHeight: '100vh',
        maxHeight: '100vh',
      }}
    >
      {/* Profile Button */}
      {session && (
        <div className={collapsed ? 'flex justify-center mb-6' : 'px-6 mb-6'}>
          <button
            className={`
              flex items-center w-full
              bg-white/90 hover:bg-[#E6EEFF]
              rounded-2xl py-3 px-4 mb-2
              transition-colors duration-200 ease-in-out
              ${collapsed ? 'justify-center' : ''}
            `}
            onClick={() => onSelect('profile')}
          >
            <span
              className={`
                material-symbols-outlined 
                text-[#4E71FF] 
                ${collapsed ? 'text-2xl' : 'text-3xl'}  
              `}
            >
              account_circle
            </span>
            {!collapsed && (
              <div className="ml-3 text-left truncate">
                <p className="text-sm font-semibold text-[#4E71FF] truncate">
                  {name}
                </p>
                <p className="text-xs text-[#3155b3]/70">View Profile</p>
              </div>
            )}
          </button>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 flex flex-col gap-2">
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
                border-0
                transition-colors duration-200 ease-in-out
                ${isActive
                  ? 'bg-white text-[#4E71FF] font-bold shadow'
                  : 'bg-[#4E71FF] text-white hover:bg-[#5A85FF] active:bg-[#3155b3]'
                }
              `}
            >
              <span 
                className={`
                  material-symbols-outlined 
                  ${collapsed ? 'text-[28px]' : 'text-[30px]'}
                `}
              >
                {icon}
              </span>

              {!collapsed && (
                <span className="ml-5 truncate">{label}</span>
              )}

              {badge != null && (
                <span className={`
                  absolute top-3 
                  ${collapsed ? 'right-3' : 'right-6'}
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
      <div className={collapsed ? 'flex justify-center mt-4' : 'px-6 mt-4'}>
        <button
          className="
            flex items-center px-3 py-3 rounded-xl
            text-[#4E71FF] bg-white hover:bg-[#BBFBFF]/60
            active:bg-[#BBFBFF] w-full text-lg font-bold
            focus:outline-none transition-colors
          "
          onClick={() => onSelect('help')}
        >
          <span className="material-symbols-outlined text-[25px]">
            help
          </span>
          {!collapsed && <span className="ml-4">Help</span>}
        </button>
      </div>
    </aside>
  )
}
