// File: pages/index.jsx
import { useSession } from 'next-auth/react'
import { useRouter }  from 'next/router'
import { useEffect }  from 'react'

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) router.replace('/dashboard')
  }, [session, router])

  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={() => router.push('/login')}
        className="px-6 py-2 bg-blue-600 text-white rounded"
      >
        Login
      </button>
    </div>
  )
}
