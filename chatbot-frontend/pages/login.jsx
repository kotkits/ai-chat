// File: pages/login.jsx
import { signIn, getSession } from 'next-auth/react'
import { useEffect }          from 'react'
import { useRouter }          from 'next/router'
import { FaFacebookF, FaGoogle } from 'react-icons/fa'
import { motion }             from 'framer-motion'

export default function Login() {
  const router = useRouter()

  useEffect(() => {
    getSession().then(session => {
      if (session) router.replace('/dashboard')
    })
  }, [router])

  const variants = {
    container: {
      hidden:  { opacity: 0, y: -30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
    },
    button: {
      hover: { scale: 1.03 },
      tap:   { scale: 0.97 }
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants.container}
      className="flex h-screen bg-gradient-to-br from-indigo-50 to-blue-50 items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 0.5 } }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Welcome Back</h1>
        <p className="text-center text-gray-500 mb-8">Sign in to continue to your dashboard</p>
        <div className="space-y-4">
          <motion.button
            whileHover="hover"
            whileTap="tap"
            variants={variants.button}
            onClick={() => signIn('facebook', { callbackUrl: '/dashboard' })}
            className="w-full flex items-center justify-center py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
          >
            <FaFacebookF className="w-5 h-5 mr-2" />
            Continue with Facebook
          </motion.button>
          <motion.button
            whileHover="hover"
            whileTap="tap"
            variants={variants.button}
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full flex items-center justify-center py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow"
          >
            <FaGoogle className="w-5 h-5 mr-2" />
            Continue with Google
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
