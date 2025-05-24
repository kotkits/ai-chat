// components/HomeContent.jsx
import React from 'react'

export default function HomeContent() {
  return (
    <div className="max-w-3xl mx-auto mt-12">
      {/* Welcome */}
      <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center mb-8">
        <span className="material-symbols-outlined text-[48px] text-[#4E71FF] mb-2">
          chat_bubble
        </span>
        <h2 className="text-3xl font-bold text-[#4E71FF] mb-2">
          
        </h2>
        <p className="text-gray-500 text-lg text-center max-w-xl">
          Manage your conversations, automate workflows, and stay connected with customers.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#4E71FF]/90 hover:bg-[#5a85ff]
                        text-white rounded-2xl p-6 flex items-center gap-4 shadow cursor-pointer">
          <span className="material-symbols-outlined text-[32px] bg-white/30 rounded-full p-2">
            forum
          </span>
          <div>
            <div className="text-xl font-semibold">Live Chat</div>
            <div className="text-white/80 text-sm">
              Respond to conversations in real time
            </div>
          </div>
        </div>
        <div className="bg-white hover:bg-[#BBFBFF]/70
                        text-[#4E71FF] rounded-2xl p-6 flex items-center gap-4 shadow cursor-pointer">
          <span className="material-symbols-outlined text-[32px]
                          bg-[#BBFBFF] rounded-full p-2">
            settings_suggest
          </span>
          <div>
            <div className="text-xl font-semibold">Automation</div>
            <div className="text-[#4E71FF]/70 text-sm">
              Build chat flows and automate responses
            </div>
          </div>
        </div>
      </div>

      {/* Announcements */}
      <div className="mt-10">
        <h3 className="text-lg font-bold text-[#4E71FF] mb-2">Announcements</h3>
        <div className="bg-white rounded-xl p-4 shadow text-gray-700 flex items-start gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#4E71FF]">
            info
          </span>
          <span>
            Welcome! Check out our new live chat features, or start building automations from the sidebar.
          </span>
        </div>
      </div>
    </div>
  )
}
