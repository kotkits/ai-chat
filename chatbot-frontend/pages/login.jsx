// pages/login.jsx
import { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function LoginPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // If already signed in, redirect you
  if (session) {
    if (session.user.role === 'admin') router.replace('/admin')
    else router.replace('/dashboard')
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const res = await signIn('credentials', {
      redirect: false,
      identifier,
      password,
    })
    if (res.error) {
      setError(res.error)
    } else {
      router.replace(res.role === 'admin' ? '/admin' : '/dashboard')
    }
  }

  return (
    <div className="relative flex items-center justify-center h-screen bg-[#274690] overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex flex-col items-center text-white space-y-4 p-8 bg-black/20 rounded-xl"
      >
        <h1 className="text-3xl font-bold">Login</h1>

        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Username or Email"
          className="w-80 px-4 py-2 border border-white rounded-full placeholder-white bg-transparent text-white focus:outline-none"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-80 px-4 py-2 border border-white rounded-full placeholder-white bg-transparent text-white focus:outline-none"
          required
        />

        {error && <p className="text-red-300 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-80 px-4 py-2 border border-[#00FF00] rounded-full text-[#00FF00] font-medium hover:bg-[#00FF00] hover:text-[#274690]"
        >
          Login
        </button>

        <p className="text-sm">
          Not a member yet?{' '}
          <Link href="/register" className="underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}
