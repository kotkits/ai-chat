// components/SettingsContent.jsx
import React from 'react'

export default function SettingsContent() {
  return (
    <div className="space-y-6 max-w-md">
      <h2 className="text-2xl font-bold text-[#4E71FF]">Settings</h2>
      <div>
        <label className="block text-gray-700 mb-1">Notifications</label>
        <select className="w-full border border-gray-300 rounded-lg p-2">
          <option>All Messages</option>
          <option>Only Mentions</option>
          <option>None</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-700 mb-1">Theme</label>
        <select className="w-full border border-gray-300 rounded-lg p-2">
          <option>Light</option>
          <option>Dark</option>
          <option>System Default</option>
        </select>
      </div>
      <button className="mt-4 bg-[#4E71FF] text-white px-4 py-2 rounded-lg">
        Save Settings
      </button>
    </div>
  )
}
