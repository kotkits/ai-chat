// HomeContent.jsx
import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

const templates = [
  {
    title: 'Automate conversations with AI',
    desc: "Get AI to collect your follower's info, share details or tell it how to reply.",
    pro: false,
  },
  {
    title: 'Capture customer data with a lead magnet',
    desc: 'Use a lead magnet to capture qualified emails.',
    pro: false,
  },
  {
    title: 'Use a quiz to qualify leads',
    desc: 'Run a quiz for your audience.',
    pro: false,
  }
]

export default function HomeContent() {
  const { data: session } = useSession()
  const userName = session?.user?.name || null

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-100 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-6 shadow-lg sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-tight">Home</h1>
          {userName ? (
            <div className="flex items-center space-x-4">
              <p className="text-lg font-medium">Hello, {userName}!</p>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md transition duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login">
              <a className="text-white hover:underline font-medium">Log in</a>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        {/* Start Here Section */}
        <section className="mb-20 text-center">
          <h2 className="text-3xl font-bold mb-4">🚀 Start Here</h2>
          <p className="text-gray-600 mb-12 max-w-xl mx-auto">
            Explore proven methods to convert visitors into qualified leads with interactive tools.
          </p>
          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((tpl, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-2xl shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-all duration-300 p-6"
              >
                <h3 className="text-xl font-semibold mb-2">{tpl.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{tpl.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Growth Goals Section */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-3">🎯 Hit Your Growth Goals</h2>
          <p className="text-gray-600 text-md max-w-2xl mx-auto">
            We're continuously expanding. New interactive templates and automation tools are on the way. Stay tuned!
          </p>
          {/* Button added at bottom of Growth Goals */}
          <div className="mt-6">
            <Link href="/automation">
              <button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-500 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out">
                🚀 Get Started
              </button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
