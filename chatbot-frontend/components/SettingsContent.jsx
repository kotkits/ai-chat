// components/SettingsContent.jsx
import { useState } from 'react'

// Main section
import GeneralSettings         from './settings/GeneralSettings'
import NotificationsSettings   from './settings/NotificationsSettings'
import TeamMembersSettings     from './settings/TeamMembersSettings'
import LogsSettings            from './settings/LogsSettings'
import BillingSettings         from './settings/BillingSettings'
import DisplaySettings         from './settings/DisplaySettings'
import LiveChatBehaviorSettings from './settings/LiveChatBehaviorSettings'
import AutoAssignmentSettings   from './settings/AutoAssignmentSettings'

// Channels
import ChannelSettings         from './settings/ChannelSettings'

// Automation
import FieldsSettings           from './settings/FieldsSettings'
import TagsSettings             from './settings/TagsSettings'

// Extensions & more
import ExtensionsSettings       from './settings/ExtensionsSettings'
import ApiSettings              from './settings/ApiSettings'
import AppsSettings             from './settings/AppsSettings'
import IntegrationsSettings     from './settings/IntegrationsSettings'
import PaymentsSettings         from './settings/PaymentsSettings'
import InstalledTemplatesSettings from './settings/InstalledTemplatesSettings'

const sections = [
  {
    heading: 'Main',
    items: [
      { key: 'general',        label: 'General' },
      { key: 'notifications',  label: 'Notifications' },
      { key: 'team',           label: 'Team Members' },
      { key: 'logs',           label: 'Logs' },
      { key: 'billing',        label: 'Billing' },
      { key: 'display',        label: 'Display' },
      { key: 'inbox',          label: 'Inbox' },
      { key: 'liveChat',       label: 'Live Chat Behavior' },
      { key: 'autoAssign',     label: 'Auto-Assignment' },
    ]
  },
  {
    heading: 'Channels',
    items: [
      { key: 'instagram',      label: 'Instagram' },
      { key: 'tiktok',         label: 'TikTok' },
      { key: 'whatsapp',       label: 'WhatsApp' },
      { key: 'messenger',      label: 'Messenger' },
      { key: 'sms',            label: 'SMS' },
      { key: 'email',          label: 'Email' },
      { key: 'telegram',       label: 'Telegram' },
    ]
  },
  {
    heading: 'Automation',
    items: [
      { key: 'fields',         label: 'Fields' },
      { key: 'tags',           label: 'Tags' },
    ]
  },
  {
    heading: 'Extensions',
    items: [
      { key: 'extensions',         label: 'Extensions' },
      { key: 'api',                label: 'API' },
      { key: 'apps',               label: 'Apps' },
      { key: 'integrations',       label: 'Integrations' },
      { key: 'payments',           label: 'Payments' },
      { key: 'installedTemplates', label: 'Installed Templates' },
    ]
  }
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
