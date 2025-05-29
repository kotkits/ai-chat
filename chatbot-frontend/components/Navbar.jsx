// components/Navbar.jsx
import React from 'react'
import { signOut } from 'next-auth/react'

export default function Navbar({ toggleSidebar }) {
  return (
    <nav className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 md:px-6 z-50">
      {/* Left: Brand and Sidebar Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="text-gray-500 hover:text-primary transition md:hidden"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
        <h1 className="text-lg font-semibold text-gray-800 tracking-tight">
          Chatbot Dashboard
        </h1>
      </div>

      {/* Right: User Actions */}
      <div className="flex items-center gap-3">
        {/* Optional: Add a theme toggle here */}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 bg-primary text-white px-3 py-2 rounded-md hover:bg-primary-dark transition"
        >
          <span className="material-symbols-outlined text-base">logout</span>
          <span className="text-sm hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </nav>
  )
}
