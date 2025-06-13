
import React from 'react'
import { useSession } from 'next-auth/react'

const templates = [
  {
    title: 'Automate conversations with AI',
    desc: "Get AI to collect your follower's info, share details or tell it how to reply.",
  },
  {
    title: 'Capture customer data with a lead magnet',
    desc: 'Use a lead magnet to capture qualified emails.',
  },
  {
    title: 'Use a quiz to qualify leads',
    desc: 'Run a quiz for your audience.',
  },
]

export default function HomeContent({ onStart }) {
  const { data: session } = useSession()
  const userName = session?.user?.name

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-100 font-sans text-gray-900">
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-6 shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-extrabold">Home</h1>
          {userName && <p className="text-lg">Hello, {userName}!</p>}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <section className="mb-16 text-center">
          <h2 className="text-3xl font-bold mb-4">🚀 Start Here</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Explore proven methods to convert visitors into qualified leads.
          </p>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((tpl, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-2">{tpl.title}</h3>
                <p className="text-gray-700 text-sm">{tpl.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-3">🎯 Hit Your Growth Goals</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We're continuously expanding. New interactive tools are on the way.
          </p>
          
        </section>
      </main>
    </div>
  )
}
