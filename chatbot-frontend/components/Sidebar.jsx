// chatbot-frontend/components/Sidebar.jsx
import React from 'react'

export default function Sidebar({ menuItems, selected, onSelect, collapsed }) {
  return (
    <aside
      className={`
        bg-[#4E71FF] ${collapsed ? 'w-16' : 'w-56'}
        flex flex-col py-6 h-full transition-all duration-300
      `}
      style={{ minHeight: 'calc(100vh - 56px)' }} // 56px navbar height
    >
      <nav className="flex-1 flex flex-col gap-2 mt-4">
        {menuItems.map(({ key, label, icon, badge }) => {
          const isActive = selected === key
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`
                flex items-center h-14
                ${collapsed ? 'justify-center' : 'px-6'}
                rounded-xl
                ${isActive
                  ? 'bg-white text-[#4E71FF] font-bold'
                  : 'bg-[#4E71FF] text-white hover:bg-[#5a85ff] active:bg-[#3155b3]'}
                text-lg focus:outline-none
              `}
              style={{ border: 'none' }}
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
      {/* Help button */}
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
