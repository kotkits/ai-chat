// pages/login.jsx
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { signIn } from 'next-auth/react'   // ← import NextAuth’s signIn helper

export default function LoginPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState('') // “Username or Email”
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // 1. Call NextAuth’s signIn() with the "credentials" provider
    const result = await signIn('credentials', {
      redirect: false,            // we’ll handle redirection manually below
      identifier,
      password,
    })

    // 2. If signIn returned an error, display it
    if (result.error) {
      setError(result.error || 'Login failed')
      return
    }

    // 3. At this point, NextAuth has created a session cookie.
    //    We now check `result.ok` and/or inspect `result.url` to redirect.
    //    By default, `signIn` will return { ok: true, error: null, status: 200, url: "/" }.
    //    However, because we configured `pages: { signIn: "/login", error: "/login" }`
    //    in [...nextauth].js (:contentReference[oaicite:2]{index=2}), `result.url` will be "/" on success.
    //    We still need to read the role from the session—so let’s re‐fetch the session.

    // NextAuth does not include role in “result” by default, so we must
    // do a client‐side fetch for the session (so that our `admin.jsx`/`dashboard.jsx`
    // can run their `useSession()` logic successfully). But we also want to
    // redirect immediately, so we know whether to go to /admin or /dashboard.

    // 4. Fetch the session from NextAuth to read the role
    const sessionRes = await fetch('/api/auth/session')
    const session = await sessionRes.json()

    // 5. If session exists and has a user.role, redirect accordingly
    if (session?.user?.role === 'admin') {
      router.replace('/admin')
    } else if (session?.user?.role === 'user') {
      router.replace('/dashboard')
    } else {
      // Shouldn’t happen if authorize() always sets role; fallback to login
      setError('Unable to determine user role')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-500 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Welcome Back
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="identifier"
              className="block text-gray-700 font-medium"
            >
              Email or Username
            </label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder="you@example.com or johndoe123"
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
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
