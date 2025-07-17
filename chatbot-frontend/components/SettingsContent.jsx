// File: components/SettingsContent.jsx
import React, { useState } from 'react'

import GeneralSettings              from './settings/GeneralSettings'
import NotificationsSettings        from './settings/NotificationsSettings'
import LiveChatBehaviorSettings     from './settings/LiveChatBehaviorSettings'
import ChannelSettings              from './settings/ChannelSettings'
import IntegrationsSettings         from './settings/IntegrationsSettings'

const sections = [
  {
    heading: 'Main',
    items: [
      { key: 'general',       label: 'General'       },
      { key: 'notifications', label: 'Notifications' },
    ],
  },
  {
    heading: 'Inbox',
    items: [
      { key: 'liveChat', label: 'Live Chat Behavior' },
    ],
  },
  {
    heading: 'Channels',
    items: [
      { key: 'messenger', label: 'Messenger' },
    ],
  },
  {
    heading: 'Extensions',
    items: [
      { key: 'integrations', label: 'Integrations' },
    ],
  },
]

export default function SettingsContent() {
  const [active, setActive] = useState('general')

  return (
    <div className="flex h-full bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* LEFT NAV */}
      <nav className="w-1/4 border-r border-gray-200 dark:border-gray-700 p-4 space-y-6 overflow-y-auto">
        {sections.map(section => (
          <div key={section.heading}>
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              {section.heading}
            </h4>
            <ul className="space-y-1">
              {section.items.map(item => (
                <li key={item.key}>
                  <button
                    onClick={() => setActive(item.key)}
                    className={`w-full text-left px-3 py-2 rounded ${
                      active === item.key
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* RIGHT CONTENT */}
      <div className="flex-1 p-6 overflow-auto">
        {active === 'general'       && <GeneralSettings />}
        {active === 'notifications' && <NotificationsSettings />}
        {active === 'liveChat'      && <LiveChatBehaviorSettings />}
        {active === 'messenger'     && <ChannelSettings channel="messenger" />}
        {active === 'integrations'  && <IntegrationsSettings />}
      </div>
    </div>
  )
}
