// components/HomeContent.jsx
import React from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const templates = [
  {
    title: 'Automate conversations with AI',
    desc: "Get AI to collect your follower's info, share details or tell it how to reply",
    pro: false,
  },
  {
    title: 'Capture customer data with a lead magnet',
    desc: 'Use a lead magnet to capture qualified emails',
    pro: false,
  },
  {
    title: 'Use a quiz to qualify leads',
    desc: 'Run a quiz for your audience.',
    pro: true,
  }
]

export default function HomeContent() {
  const { data: session } = useSession()
  const userName = session?.user?.name || null

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white px-8 py-6 border-b shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Home</h1>
          {userName ? (
            <p className="text-lg font-medium text-gray-800">Hello, {userName}!</p>
          ) : (
            <Link href="/login" className="text-blue-600 text-sm hover:underline">
              Log in to see your dashboard
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-8">
        {/* Start Here Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Start Here</h2>
            <Link href="/templates" className="text-blue-600 text-sm hover:underline">
              Explore all Templates
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((tpl, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow">
                <h3 className="text-lg font-medium text-gray-800 mb-2">{tpl.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{tpl.desc}</p>
                {tpl.pro && (
                  <span className="inline-block mt-4 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                    PRO
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Growth Goals */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Hit Your Growth Goals</h2>
          <p className="text-gray-500 text-sm">
            New templates for connected channels are coming soon. Stay tuned!
          </p>
        </section>
      </main>
    </div>
  )
}
