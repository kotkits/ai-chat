// components/Navbar.jsx
import React from 'react'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'

export default function Navbar({ toggleSidebar }) {
  const router = useRouter()

  return (
    <nav className="
      h-14 bg-[#4E71FF] flex items-center px-6
      justify-between text-white
    ">
      <div className="flex items-center gap-4">
        <span
          className="material-symbols-outlined text-[28px] cursor-pointer"
          onClick={toggleSidebar}
        >
          menu
        </span>
        <h1 className="text-2xl font-bold">My Chatbot Dashboard</h1>
      </div>
      <button
        className="
          bg-[#BBFBFF] hover:bg-[#f2f7ff]
          rounded-full p-2 border border-[#4E71FF]
        "
        onClick={() => {
          signOut({ callbackUrl: '/login' })
        }}
      >
        <span className="material-symbols-outlined text-[22px] text-[#4E71FF]">
          logout
        </span>
      </button>
    </nav>
  )
}
