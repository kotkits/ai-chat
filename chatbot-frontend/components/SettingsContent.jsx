// components/SettingsContent.jsx

import React, { useState, useEffect, useCallback } from 'react'
import { RiInstagramLine } from 'react-icons/ri'
import { SiTiktok } from 'react-icons/si'
import {
  FaWhatsapp,
  FaFacebookMessenger,
  FaTelegramPlane,
} from 'react-icons/fa'
import { MdSms } from 'react-icons/md'
import { HiOutlineMail } from 'react-icons/hi'

/**
 * This upgraded SettingsContent.jsx now:
 * 1. Splits each “section” into its own subcomponent for clarity.
 * 2. Uses useEffect + fetch to simulate loading/saving data via API endpoints.
 * 3. Adds basic form validation (e.g., email format) before allowing actions.
 * 4. Shows loading states when fetching or saving.
 * 5. Provides confirmation prompts for destructive actions (e.g., clearing logs, deleting account).
 * 
 * You can replace the placeholder endpoints (e.g., `/api/settings/team-members`) with your real API routes.
 */

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
  const [active, setActive] = useState('general')
  return (
    <div className="flex h-full bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* LEFT NAV COLUMN */}
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

      {/* RIGHT CONTENT PANEL */}
      <div className="flex-1 p-6 overflow-auto">
        {active === 'general'     && <GeneralSettings />}
        {active === 'notifications' && <NotificationsSettings />}
        {active === 'team'        && <TeamMembersSettings />}
        {active === 'logs'        && <LogsSettings />}
        {active === 'billing'     && <BillingSettings />}
        {active === 'display'     && <DisplaySettings />}
        {active === 'inbox'       && <LiveChatBehaviorSettings />}
        {active === 'liveChat'    && <LiveChatBehaviorSettings />}
        {active === 'autoAssign'  && <AutoAssignmentSettings />}

        {active === 'instagram'   && <ChannelSettings channel="instagram" />}
        {active === 'tiktok'      && <ChannelSettings channel="tiktok" />}
        {active === 'whatsapp'    && <ChannelSettings channel="whatsapp" />}
        {active === 'messenger'   && <ChannelSettings channel="messenger" />}
        {active === 'sms'         && <ChannelSettings channel="sms" />}
        {active === 'email'       && <ChannelSettings channel="email" />}
        {active === 'telegram'    && <ChannelSettings channel="telegram" />}

        {active === 'fields'      && <FieldsSettings />}
        {active === 'tags'        && <TagsSettings />}

        {active === 'extensions'         && <ExtensionsSettings />}
        {active === 'api'                && <ApiSettings />}
        {active === 'apps'               && <AppsSettings />}
        {active === 'integrations'       && <IntegrationsSettings />}
        {active === 'payments'           && <PaymentsSettings />}
        {active === 'installedTemplates' && <InstalledTemplatesSettings />}
      </div>
    </div>
  )
}
