// components/SettingsContent.jsx

import React, { useState } from 'react'
import { RiInstagramLine } from 'react-icons/ri'
import { SiTiktok } from 'react-icons/si'
import { FaWhatsapp, FaFacebookMessenger, FaTelegramPlane } from 'react-icons/fa'
import { MdSms } from 'react-icons/md'
import { HiOutlineMail } from 'react-icons/hi'

const mainItems = [
  'General',
  'Notifications',
  'Team Members',
  'Logs',
  'Billing',
  'Display',
]
const inboxItems = ['Live Chat Behavior', 'Auto-Assignment']
const automationItems = ['Fields', 'Tags']
const extensionItems = [
  'API',
  'Apps',
  'Integrations',
  'Payments',
  'Installed Templates',
]
const channelItems = [
  { icon: <RiInstagramLine />, label: 'Instagram' },
  { icon: <SiTiktok />, label: 'TikTok' },
  { icon: <FaWhatsapp />, label: 'WhatsApp' },
  { icon: <FaFacebookMessenger />, label: 'Messenger' },
  { icon: <MdSms />, label: 'SMS' },
  { icon: <HiOutlineMail />, label: 'Email' },
  { icon: <FaTelegramPlane />, label: 'Telegram' },
]

export default function SettingsContent() {
  const [active, setActive] = useState('General')

  const renderSection = (item) => {
    switch (item) {
case 'General':
  return (
    <div className="space-y-8">

      {/* Account Time Zone */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Account Time Zone</label>
        <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
          <option>(UTC+08:00) - Philippine Standard Time</option>
          {/* Add more options if needed */}
        </select>
      </div>

      {/* Clone to Another Account */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Clone to Another Account</label>
        <button className="w-fit bg-[#007aff] hover:bg-[#005ecc] text-white font-semibold px-5 py-2 rounded-lg transition">
          Clone This Account
        </button>
      </div>

      {/* Use as Template */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Use as Template</label>
        <button className="w-fit bg-[#007aff] hover:bg-[#005ecc] text-white font-semibold px-5 py-2 rounded-lg transition">
          Create Account Template
        </button>
      </div>

      {/* Leave Account */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Leave Account</label>
        <button
          className="w-fit bg-gray-100 text-gray-400 font-semibold px-5 py-2 rounded-lg cursor-not-allowed"
          disabled
        >
          Leave
        </button>
      </div>

      {/* Delete Account */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Delete Account</label>
        <button className="w-fit border border-red-500 text-red-500 font-semibold px-5 py-2 rounded-lg hover:bg-red-50 transition">
          Delete
        </button>
      </div>
    </div>
  )

      case 'Notifications':
        return (
          <div>
            <label className="block text-gray-700 mb-1">Theme</label>
            <select className="w-full border border-gray-300 rounded-lg p-2">
              <option>Light</option>
              <option>Dark</option>
              <option>System Default</option>
            </select>
          </div>
        )
      // TODO: flesh out the other sections below
      case 'Fields':
      case 'Tags':
        return <p className="text-gray-600">Configure your automation {item.toLowerCase()} here.</p>
      case 'API':
      case 'Apps':
      case 'Integrations':
      case 'Payments':
      case 'Installed Templates':
        return <p className="text-gray-600">Manage your {item.toLowerCase()} extensions here.</p>
      default:
        return <p className="text-gray-600">Settings for {item}</p>
    }
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <nav className="w-56 pr-6 border-r border-gray-200">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Main</h3>
          {mainItems.map(item => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`block w-full text-left py-2 hover:text-green-500 ${
                active === item ? 'text-green-500 font-medium' : 'text-gray-700'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Inbox</h3>
          {inboxItems.map(item => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`block w-full text-left py-2 hover:text-green-500 ${
                active === item ? 'text-green-500 font-medium' : 'text-gray-700'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Automation</h3>
          {automationItems.map(item => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`block w-full text-left py-2 hover:text-green-500 ${
                active === item ? 'text-green-500 font-medium' : 'text-gray-700'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Extensions</h3>
          {extensionItems.map(item => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`block w-full text-left py-2 hover:text-green-500 ${
                active === item ? 'text-green-500 font-medium' : 'text-gray-700'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Channels</h3>
          {channelItems.map(({ icon, label }) => (
            <button
              key={label}
              onClick={() => setActive(label)}
              className={`flex items-center w-full text-left py-2 hover:text-green-500 ${
                active === label ? 'text-green-500 font-medium' : 'text-gray-700'
              }`}
            >
              <span className="mr-3 text-lg">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content area */}
      <div className="flex-1 space-y-6 max-w-md">
        <h2 className="text-2xl font-bold text-[#4E71FF]">{active}</h2>
        {renderSection(active)}
          
      </div>
    </div>
  )
}
