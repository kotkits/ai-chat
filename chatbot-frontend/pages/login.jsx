// pages/login.jsx
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Call your custom API route (/api/login)
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.message || 'Login failed')
      return
    }

    // If role-based redirect (optional)
    if (data.role === 'admin') {
      router.replace('/admin')
      return
    }

    router.replace('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-500 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Welcome Back
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="
                w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-400
                transition duration-200
              "
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="
                w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-400
                transition duration-200
              "
            />
          </div>

          <button
            type="submit"
            className="
              w-full bg-blue-600 text-white py-2 rounded-lg 
              hover:bg-blue-700 focus:ring-4 focus:ring-blue-300
              transition duration-200
            "
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don’t have an account?{' '}
          <Link
            href="/register"
            className="text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
