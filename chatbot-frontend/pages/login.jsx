import { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function LoginPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // If already authenticated, redirect by role
  if (session) {
    if (session.user.role === "admin") router.replace("/admin")
    else router.replace("/dashboard")
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    const res = await signIn("credentials", {
      identifier,
      password,
      redirect: false
    })

    if (res.error) {
      setError(res.error)
    } else {
      // success
      router.replace(res.ok && res.role === "admin" ? "/admin" : "/dashboard")
    }
  }

  return (
    <div className="…"> {/* existing styles */}
      <form onSubmit={handleSubmit} className="…">
        {/* identifier & password inputs */}
        {error && <p className="text-red-300">{error}</p>}
        <button type="submit" className="…">Login</button>
        <p>
          Not a member? <Link href="/register">Register</Link>
        </p>
      </form>
    </div>
  )
}
