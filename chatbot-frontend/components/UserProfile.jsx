// File: components/UserProfile.jsx
import { useSession, signOut } from 'next-auth/react'

export default function UserProfile() {
  const { data: session } = useSession()
  if (!session) return null

  return (
    <div className="flex items-center p-2 bg-[#2C3A4A] text-white rounded">
      {session.user.image && (
        <img
          src={session.user.image}
          className="w-8 h-8 rounded-full mr-2"
          alt="Your avatar"
        />
      )}
      <div className="flex-1">
        <p className="truncate font-medium">{session.user.name}</p>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="ml-2 text-xs hover:underline"
      >
        Logout
      </button>
    </div>
  )
}
