// components/BroadcastingContent.jsx
import React from 'react'

export default function BroadcastingContent() {
  const campaigns = ['Promo May', 'Holiday Sale', 'Feature Update']
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-[#4E71FF]">Broadcasting</h2>
      <ul className="bg-white rounded-lg shadow divide-y divide-gray-200">
        {campaigns.map((c) => (
          <li key={c} className="p-4 flex justify-between hover:bg-gray-50">
            <span>{c}</span>
            <button className="text-[#4E71FF] hover:underline text-sm">Manage</button>
          </li>
        ))}
      </ul>
      <button className="mt-3 bg-[#4E71FF] text-white px-4 py-2 rounded-lg">
        + New Broadcast
      </button>
    </div>
  )
}
