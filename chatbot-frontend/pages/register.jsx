// pages/register.jsx
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, username, email, password }),
    })

    if (res.status === 201) {
      router.push('/login')
    } else {
      const data = await res.json().catch(() => ({}))
      setError(
        data.message ||
        (res.status === 409
          ? 'Email or username already in use'
          : 'Registration failed')
      )
    }
  }

  return (
    <div className="relative flex items-center justify-center h-screen bg-[#274690] overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex flex-col items-center text-white space-y-4 p-8 bg-black/20 rounded-xl"
      >
        <h1 className="text-3xl font-bold">Register</h1>

        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          className="w-80 px-4 py-2 border border-white rounded-full placeholder-white bg-transparent text-white focus:outline-none"
          required
        />

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-80 px-4 py-2 border border-white rounded-full placeholder-white bg-transparent text-white focus:outline-none"
          required
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
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
          Create Account
        </button>

        <p className="text-sm">
          Already have an account?{' '}
          <Link href="/login" className="underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
