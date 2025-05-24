// components/LiveChatContent.jsx
import React from 'react'

export default function LiveChatContent() {
  return (
    <div className="flex flex-col h-full space-y-4">
      <h2 className="text-2xl font-bold text-[#4E71FF]">Live Chat</h2>
      <div className="flex-1 bg-white rounded-lg shadow p-4 overflow-y-auto">
        {/* Chat messages would go here */}
        <p className="text-gray-400 italic">No conversations yet.</p>
      </div>
      <div className="flex">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none"
        />
        <button className="bg-[#4E71FF] text-white px-4 rounded-r-lg">Send</button>
      </div>
    </div>
  )
}
