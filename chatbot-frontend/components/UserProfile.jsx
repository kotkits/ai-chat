// File: components/UserProfile.jsx
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function UserProfile({ collapsed }) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  if (!session) return null

  return (
    <div className="relative">
      {/* Avatar (always visible) */}
      {session.user.image && (
        <img
          src={session.user.image}
          className="w-10 h-10 rounded-full cursor-pointer"
          alt="Your avatar"
          onClick={() => setOpen(o => !o)}
        />
      )}

      {/* Dropdown with name + logout (appears when clicked) */}
      {open && (
        <div className="absolute bottom-full left-0 mb-2 bg-[#2C3A4A] text-white rounded shadow-lg p-2 w-40">
          <p className="truncate font-medium">{session.user.name}</p>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="mt-2 text-xs hover:underline"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
