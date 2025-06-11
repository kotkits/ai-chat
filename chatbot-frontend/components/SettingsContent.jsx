// components/SettingsContent.jsx

import React, { useState, useEffect, } from 'react'
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
  const [active, setActive] = useState('General')

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar active={active} setActive={setActive} />

      {/* Content area */}
      <div className="flex-1 space-y-6 max-w-2xl px-4">
        <h2 className="text-2xl font-bold text-[#4E71FF]">{active}</h2>
        {active === 'General' && <GeneralSettings />}
        {active === 'Notifications' && <NotificationSettings />}
        {active === 'Team Members' && <TeamMembersSettings />}
        {active === 'Logs' && <LogsSettings />}
        {active === 'Billing' && <BillingSettings />}
        {active === 'Display' && <DisplaySettings />}
        {active === 'Live Chat Behavior' && <LiveChatBehaviorSettings />}
        {active === 'Auto-Assignment' && <AutoAssignmentSettings />}
        {active === 'Fields' && <FieldsSettings />}
        {active === 'Tags' && <TagsSettings />}
        {extensionItems.includes(active) && (
          <ExtensionsPlaceholder name={active} />
        )}
        {channelItems.some((ch) => ch.label === active) && (
          <ChannelSettings channel={active} />
        )}
      </div>
    </div>
  )
}

/** Sidebar component */
function Sidebar({ active, setActive }) {
  return (
    <nav className="w-60 pr-6 border-r border-gray-200">
      <SectionList title="Main" items={mainItems} active={active} setActive={setActive} />
      <SectionList title="Inbox" items={inboxItems} active={active} setActive={setActive} />
      <SectionList title="Automation" items={automationItems} active={active} setActive={setActive} />
      <SectionList title="Extensions" items={extensionItems} active={active} setActive={setActive} />
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
  )
}

/** Reusable list of buttons for sidebar sections */
function SectionList({ title, items, active, setActive }) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">{title}</h3>
      {items.map((item) => (
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
  )
}

/** --------------- General Settings --------------- */
function GeneralSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const [accountData, setAccountData] = useState({
    canClone: false,
    canTemplate: false,
    canLeave: false,
  })

  useEffect(() => {
    // Fetch existing “General” settings from API
    fetch('/api/settings/general')
      .then((res) => res.json())
      .then((data) => {
        setAccountData({
          canClone: data.canClone,
          canTemplate: data.canTemplate,
          canLeave: data.canLeave,
        })
        setIsLoading(false)
      })
      .catch(() => {
        // If API fails, disable actions
        setAccountData({ canClone: false, canTemplate: false, canLeave: false })
        setIsLoading(false)
      })
  }, [])

  const handleClone = async () => {
    if (!accountData.canClone) return
    const confirmed = window.confirm('Are you sure you want to clone this account?')
    if (!confirmed) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/settings/general/clone', { method: 'POST' })
      if (res.ok) alert('Account cloned successfully.')
      else alert('Failed to clone account.')
    } catch {
      alert('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTemplate = async () => {
    if (!accountData.canTemplate) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/settings/general/template', { method: 'POST' })
      if (res.ok) alert('Template created successfully.')
      else alert('Failed to create template.')
    } catch {
      alert('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLeave = () => {
    alert('Feature not available.')
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'This will permanently delete your account. Are you absolutely sure?'
    )
    if (!confirmed) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/settings/general/delete', { method: 'DELETE' })
      if (res.ok) {
        alert('Account deleted. Redirecting to signup...')
        window.location.href = '/signup'
      } else alert('Failed to delete account.')
    } catch {
      alert('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <p className="text-gray-600">Loading...</p>

  return (
    <div className="space-y-8">
      {/* Clone to Another Account */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Clone to Another Account</label>
        <button
          onClick={handleClone}
          disabled={!accountData.canClone || isLoading}
          className={`w-fit ${
            accountData.canClone
              ? 'bg-[#007aff] hover:bg-[#005ecc] text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          } font-semibold px-5 py-2 rounded-lg transition`}
        >
          {isLoading ? '...' : 'Clone This Account'}
        </button>
      </div>

      {/* Use as Template */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Use as Template</label>
        <button
          onClick={handleTemplate}
          disabled={!accountData.canTemplate || isLoading}
          className={`w-fit ${
            accountData.canTemplate
              ? 'bg-[#007aff] hover:bg-[#005ecc] text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          } font-semibold px-5 py-2 rounded-lg transition`}
        >
          {isLoading ? '...' : 'Create Account Template'}
        </button>
      </div>

      {/* Leave Account */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Leave Account</label>
        <button
          onClick={handleLeave}
          disabled={!accountData.canLeave}
          className={`w-fit ${
            accountData.canLeave
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          } font-semibold px-5 py-2 rounded-lg transition`}
        >
          Leave
        </button>
      </div>

      {/* Delete Account */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Delete Account</label>
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className={`w-fit ${
            isLoading
              ? 'border border-red-200 text-red-200 cursor-not-allowed'
              : 'border border-red-500 text-red-500 hover:bg-red-50'
          } font-semibold px-5 py-2 rounded-lg transition`}
        >
          {isLoading ? '...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}

/** --------------- Notification Settings --------------- */
function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const [desktopOptions, setDesktopOptions] = useState([])
  const [channelOptions, setChannelOptions] = useState([])

  useEffect(() => {
    fetch('/api/settings/notifications')
      .then((res) => res.json())
      .then((data) => {
        setDesktopOptions(data.desktopOptions)
        setChannelOptions(data.channelOptions)
        setIsLoading(false)
      })
      .catch(() => {
        setDesktopOptions([
          {
            label: 'I get a new message from a conversation assigned to me',
            checked: true,
          },
          { label: 'There is a new conversation in unassigned folder', checked: false },
          { label: 'A conversation is assigned to me', checked: false },
        ])
        setChannelOptions([{ label: 'A conversation is assigned to me', checked: true }])
        setIsLoading(false)
      })
  }, [])

  const toggleOption = (setter, listKey, index) => {
    setDesktopOptions((prev) =>
      prev.map((opt, idx) => (idx === index ? { ...opt, checked: !opt.checked } : opt))
    )
  }
  const toggleChannelOption = (index) => {
    setChannelOptions((prev) =>
      prev.map((opt, idx) => (idx === index ? { ...opt, checked: !opt.checked } : opt))
    )
  }

  const saveNotifications = async () => {
    setIsLoading(true)
    try {
      const payload = { desktopOptions, channelOptions }
      const res = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) alert('Notifications updated.')
      else alert('Failed to update.')
    } catch {
      alert('Network error.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <p className="text-gray-600">Loading...</p>

  return (
    <div className="space-y-6">
      {/* Theme Selector */}
      <div>
        <label className="block text-gray-700 mb-1">Theme</label>
        <select
          disabled={isLoading}
          className="w-full border border-gray-300 rounded-lg p-2"
          onChange={(e) => alert(`Theme changed to ${e.target.value}`)}
        >
          <option>Light</option>
          <option>Dark</option>
          <option>System Default</option>
        </select>
      </div>

      {/* Live Chat Notification Settings */}
      <div className="space-y-6 border border-gray-200 rounded-md p-6 shadow-sm bg-white">
        <h3 className="text-lg font-semibold text-gray-900">
          Live Chat Notifications
        </h3>

        {/* Desktop Notifications */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Desktop Notifications</h4>
          {desktopOptions.map((opt, idx) => (
            <label
              key={idx}
              className="flex items-start gap-2 text-sm text-gray-800 mb-2"
            >
              <input
                type="checkbox"
                checked={opt.checked}
                onChange={() => toggleOption(setDesktopOptions, 'desktopOptions', idx)}
                className="mt-1 accent-[#4E71FF]"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>

        {/* Channel Notifications */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Channel Notifications</h4>
          {channelOptions.map((opt, idx) => (
            <label
              key={idx}
              className="flex items-start gap-2 text-sm text-gray-800 mb-2"
            >
              <input
                type="checkbox"
                checked={opt.checked}
                onChange={() => toggleChannelOption(idx)}
                className="mt-1 accent-[#4E71FF]"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>

        <button
          onClick={saveNotifications}
          disabled={isLoading}
          className={`w-fit ${
            isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#4E71FF] hover:bg-[#3a5fcc] text-white'
          } font-semibold px-5 py-2 rounded-lg transition`}
        >
          {isLoading ? '...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

/** --------------- Team Members Settings --------------- */
function TeamMembersSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const [teamMembers, setTeamMembers] = useState([])
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'Agent' })
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetch('/api/settings/team-members')
      .then((res) => res.json())
      .then((data) => {
        setTeamMembers(data.members)
        setIsLoading(false)
      })
      .catch(() => {
        setTeamMembers([
          { name: 'Alice Johnson', role: 'Admin', email: 'alice@example.com' },
          { name: 'Bob Martinez', role: 'Agent', email: 'bob@example.com' },
        ])
        setIsLoading(false)
      })
  }, [])

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const addTeamMember = async () => {
    if (!newMember.name.trim() || !newMember.email.trim()) {
      setErrorMsg('Name and email are required.')
      return
    }
    if (!validateEmail(newMember.email.trim())) {
      setErrorMsg('Please enter a valid email address.')
      return
    }
    setErrorMsg('')
    setIsLoading(true)
    try {
      const res = await fetch('/api/settings/team-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
      })
      if (res.ok) {
        const created = await res.json()
        setTeamMembers((prev) => [...prev, created])
        setNewMember({ name: '', email: '', role: 'Agent' })
      } else {
        setErrorMsg('Failed to add member.')
      }
    } catch {
      setErrorMsg('Network error.')
    } finally {
      setIsLoading(false)
    }
  }

  const removeTeamMember = async (index) => {
    const member = teamMembers[index]
    const confirmed = window.confirm(
      `Remove ${member.name} (${member.email}) from team?`
    )
    if (!confirmed) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/settings/team-members/${member.email}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setTeamMembers((prev) => prev.filter((_, idx) => idx !== index))
      } else {
        alert('Failed to remove member.')
      }
    } catch {
      alert('Network error.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <p className="text-gray-600">Loading...</p>

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
      {teamMembers.length === 0 ? (
        <p className="text-gray-600">No team members found.</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Role</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member, idx) => (
              <tr key={idx} className="border-b">
                <td className="px-4 py-2 text-sm text-gray-800">{member.name}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{member.role}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{member.email}</td>
                <td className="px-4 py-2 text-sm">
                  <button
                    onClick={() => removeTeamMember(idx)}
                    disabled={isLoading}
                    className={`${
                      isLoading ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:underline'
                    }`}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-6 flex flex-col gap-2">
        <h4 className="text-sm font-medium text-gray-700">Add New Member</h4>
        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
        <input
          type="text"
          placeholder="Name"
          value={newMember.name}
          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
          disabled={isLoading}
          className="w-full border border-gray-300 rounded-lg p-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={newMember.email}
          onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
          disabled={isLoading}
          className="w-full border border-gray-300 rounded-lg p-2"
        />
        <select
          value={newMember.role}
          onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
          disabled={isLoading}
          className="w-full border border-gray-300 rounded-lg p-2"
        >
          <option>Agent</option>
          <option>Admin</option>
          <option>Manager</option>
        </select>
        <button
          onClick={addTeamMember}
          disabled={isLoading}
          className={`w-fit ${
            isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#4E71FF] hover:bg-[#3a5fcc] text-white'
          } font-semibold px-5 py-2 rounded-lg transition`}
        >
          {isLoading ? '...' : 'Add Member'}
        </button>
      </div>
    </div>
  )
}

/** --------------- Logs Settings --------------- */
function LogsSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const [logs, setLogs] = useState([])

  useEffect(() => {
    fetch('/api/settings/logs')
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logs)
        setIsLoading(false)
      })
      .catch(() => {
        setLogs([
          { time: '2025-06-05 14:22', message: 'New user signed up: carol@example.com' },
          { time: '2025-06-05 15:10', message: 'Conversation #453 closed by Bob' },
          { time: '2025-06-06 09:05', message: 'Payment received from acme_corp' },
        ])
        setIsLoading(false)
      })
  }, [])

  const clearLogs = async () => {
    const confirmed = window.confirm('Clear all logs? This cannot be undone.')
    if (!confirmed) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/settings/logs', { method: 'DELETE' })
      if (res.ok) setLogs([])
      else alert('Failed to clear logs.')
    } catch {
      alert('Network error.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <p className="text-gray-600">Loading...</p>

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Activity Logs</h3>
      {logs.length === 0 ? (
        <p className="text-gray-600">No logs available.</p>
      ) : (
        <ul className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2">
          {logs.map((log, idx) => (
            <li key={idx} className="flex justify-between items-start border-b pb-2">
              <span className="text-sm text-gray-800">{log.time}</span>
              <span className="text-sm text-gray-800">{log.message}</span>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={clearLogs}
        disabled={isLoading || logs.length === 0}
        className={`mt-4 ${
          isLoading || logs.length === 0
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-red-500 hover:bg-red-600 text-white'
        } font-semibold px-5 py-2 rounded-lg transition`}
      >
        {isLoading ? '...' : 'Clear Logs'}
      </button>
    </div>
  )
}

/** --------------- Billing Settings --------------- */
function BillingSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const [plan, setPlan] = useState('')
  const [billingEmail, setBillingEmail] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetch('/api/settings/billing')
      .then((res) => res.json())
      .then((data) => {
        setPlan(data.plan)
        setBillingEmail(data.email)
        setIsLoading(false)
      })
      .catch(() => {
        setPlan('Pro')
        setBillingEmail('billing@example.com')
        setIsLoading(false)
      })
  }, [])

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const saveBilling = async () => {
    if (!validateEmail(billingEmail.trim())) {
      setErrorMsg('Please enter a valid email address.')
      return
    }
    setErrorMsg('')
    setIsLoading(true)
    try {
      const payload = { plan, email: billingEmail.trim() }
      const res = await fetch('/api/settings/billing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) alert('Billing information updated.')
      else setErrorMsg('Failed to update billing.')
    } catch {
      setErrorMsg('Network error.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <p className="text-gray-600">Loading...</p>

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Billing Information</h3>
      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Current Plan</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option>Free</option>
            <option>Pro</option>
            <option>Enterprise</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Billing Email</label>
          <input
            type="email"
            value={billingEmail}
            onChange={(e) => setBillingEmail(e.target.value)}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <button
          onClick={saveBilling}
          disabled={isLoading}
          className={`w-fit ${
            isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white'
          } font-semibold px-5 py-2 rounded-lg transition`}
        >
          {isLoading ? '...' : 'Update Billing'}
        </button>
      </div>
    </div>
  )
}

/** --------------- Display Settings --------------- */
function DisplaySettings() {
  const [isLoading, setIsLoading] = useState(true)
  const [language, setLanguage] = useState('')
  const [timeZone, setTimeZone] = useState('')
  const [fontSize, setFontSize] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetch('/api/settings/display')
      .then((res) => res.json())
      .then((data) => {
        setLanguage(data.language)
        setTimeZone(data.timeZone)
        setFontSize(data.fontSize)
        setIsLoading(false)
      })
      .catch(() => {
        setLanguage('English')
        setTimeZone('Asia/Manila')
        setFontSize('base')
        setIsLoading(false)
      })
  }, [])

  const saveDisplay = async () => {
    setErrorMsg('')
    setIsLoading(true)
    try {
      const payload = { language, timeZone, fontSize }
      const res = await fetch('/api/settings/display', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) alert('Display settings updated.')
      else setErrorMsg('Failed to update.')
    } catch {
      setErrorMsg('Network error.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <p className="text-gray-600">Loading...</p>

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Display Settings</h3>
      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option>English</option>
            <option>Filipino</option>
            <option>Spanish</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
          <select
            value={timeZone}
            onChange={(e) => setTimeZone(e.target.value)}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option>Asia/Manila</option>
            <option>UTC</option>
            <option>America/New_York</option>
            <option>Europe/London</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="sm">Small</option>
            <option value="base">Base</option>
            <option value="lg">Large</option>
            <option value="xl">Extra Large</option>
          </select>
        </div>

        <button
          onClick={saveDisplay}
          disabled={isLoading}
          className={`w-fit ${
            isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#4E71FF] hover:bg-[#3a5fcc] text-white'
          } font-semibold px-5 py-2 rounded-lg transition`}
        >
          {isLoading ? '...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

/** --------------- Live Chat Behavior Settings --------------- */
function LiveChatBehaviorSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const [greetingMessage, setGreetingMessage] = useState('')
  const [showOfflineForm, setShowOfflineForm] = useState(false)

  useEffect(() => {
    fetch('/api/settings/live-chat-behavior')
      .then((res) => res.json())
      .then((data) => {
        setGreetingMessage(data.greetingMessage)
        setShowOfflineForm(data.showOfflineForm)
        setIsLoading(false)
      })
      .catch(() => {
        setGreetingMessage('Hello! How can we help you today?')
        setShowOfflineForm(false)
        setIsLoading(false)
      })
  }, [])

  const saveBehavior = async () => {
    setIsLoading(true)
    try {
      const payload = { greetingMessage, showOfflineForm }
      const res = await fetch('/api/settings/live-chat-behavior', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) alert('Live chat behavior updated.')
      else alert('Failed to update.')
    } catch {
      alert('Network error.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <p className="text-gray-600">Loading...</p>

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Live Chat Behavior</h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Greeting Message</label>
          <textarea
            rows={3}
            value={greetingMessage}
            onChange={(e) => setGreetingMessage(e.target.value)}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showOfflineForm}
            onChange={() => setShowOfflineForm((prev) => !prev)}
            disabled={isLoading}
            className="accent-[#4E71FF]"
          />
          <label className="text-sm text-gray-800">
            Show offline form when agents unavailable
          </label>
        </div>
        <button
          onClick={saveBehavior}
          disabled={isLoading}
          className={`w-fit ${
            isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#4E71FF] hover:bg-[#3a5fcc] text-white'
          } font-semibold px-5 py-2 rounded-lg transition`}
        >
          {isLoading ? '...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

/** --------------- Auto-Assignment Settings --------------- */
function AutoAssignmentSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const [autoAssign, setAutoAssign] = useState({
    enabled: false,
    method: 'round-robin',
    maxPerAgent: 1,
  })

  useEffect(() => {
    fetch('/api/settings/auto-assignment')
      .then((res) => res.json())
      .then((data) => {
        setAutoAssign(data)
        setIsLoading(false)
      })
      .catch(() => {
        setAutoAssign({ enabled: true, method: 'round-robin', maxPerAgent: 5 })
        setIsLoading(false)
      })
  }, [])

  const saveAutoAssign = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/settings/auto-assignment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(autoAssign),
      })
      if (res.ok) alert('Auto-assignment updated.')
      else alert('Failed to update.')
    } catch {
      alert('Network error.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <p className="text-gray-600">Loading...</p>

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Auto-Assignment</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={autoAssign.enabled}
            onChange={() =>
              setAutoAssign((prev) => ({ ...prev, enabled: !prev.enabled }))
            }
            disabled={isLoading}
            className="accent-[#4E71FF]"
          />
          <label className="text-sm text-gray-800">Enable Auto-Assignment</label>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Assignment Method</label>
          <select
            value={autoAssign.method}
            onChange={(e) =>
              setAutoAssign((prev) => ({ ...prev, method: e.target.value }))
            }
            disabled={isLoading || !autoAssign.enabled}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="round-robin">Round Robin</option>
            <option value="least-busy">Least Busy</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Max Conversations per Agent
          </label>
          <input
            type="number"
            min={1}
            value={autoAssign.maxPerAgent}
            onChange={(e) =>
              setAutoAssign((prev) => ({
                ...prev,
                maxPerAgent: parseInt(e.target.value, 10) || 1,
              }))
            }
            disabled={isLoading || !autoAssign.enabled}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <button
          onClick={saveAutoAssign}
          disabled={isLoading}
          className={`w-fit ${
            isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#4E71FF] hover:bg-[#3a5fcc] text-white'
          } font-semibold px-5 py-2 rounded-lg transition`}
        >
          {isLoading ? '...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

/** --------------- Fields (Automation) Settings --------------- */
function FieldsSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const [customFields, setCustomFields] = useState([])
  const [newField, setNewField] = useState({ name: '', type: 'Text' })
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetch('/api/settings/fields')
      .then((res) => res.json())
      .then((data) => {
        setCustomFields(data.fields)
        setIsLoading(false)
      })
      .catch(() => {
        setCustomFields([
          { name: 'Customer ID', type: 'Text' },
          { name: 'Purchase Date', type: 'Date' },
        ])
        setIsLoading(false)
      })
  }, [])

  const addField = async () => {
    if (!newField.name.trim()) {
      setErrorMsg('Field name is required.')
      return
    }
    setErrorMsg('')
    setIsLoading(true)
    try {
      const res = await fetch('/api/settings/fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newField),
      })
      if (res.ok) {
        const created = await res.json()
        setCustomFields((prev) => [...prev, created])
        setNewField({ name: '', type: 'Text' })
      } else {
        setErrorMsg('Failed to add field.')
      }
    } catch {
      setErrorMsg('Network error.')
    } finally {
      setIsLoading(false)
    }
  }

  const removeField = async (index) => {
    const field = customFields[index]
    const confirmed = window.confirm(`Remove field "${field.name}"?`)
    if (!confirmed) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/settings/fields/${encodeURIComponent(field.name)}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setCustomFields((prev) => prev.filter((_, idx) => idx !== index))
      } else {
        alert('Failed to remove field.')
      }
    } catch {
      alert('Network error.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <p className="text-gray-600">Loading...</p>

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Custom Fields</h3>
      {customFields.length === 0 ? (
        <p className="text-gray-600">No custom fields added yet.</p>
      ) : (
        <ul className="space-y-2">
          {customFields.map((field, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <span className="text-sm text-gray-800 font-medium">{field.name}</span>
                <span className="ml-2 text-xs text-gray-500">({field.type})</span>
              </div>
              <button
                onClick={() => removeField(idx)}
                disabled={isLoading}
                className={`text-sm ${
                  isLoading ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:underline'
                }`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex flex-col gap-2">
        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
        <input
          type="text"
          placeholder="Field Name"
          value={newField.name}
          onChange={(e) => setNewField({ ...newField, name: e.target.value })}
          disabled={isLoading}
          className="w-full border border-gray-300 rounded-lg p-2"
        />
        <select
          value={newField.type}
          onChange={(e) => setNewField({ ...newField, type: e.target.value })}
          disabled={isLoading}
          className="w-full border border-gray-300 rounded-lg p-2"
        >
          <option>Text</option>
          <option>Number</option>
          <option>Date</option>
          <option>Dropdown</option>
        </select>
        <button
          onClick={addField}
          disabled={isLoading}
          className={`w-fit ${
            isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#4E71FF] hover:bg-[#3a5fcc] text-white'
          } font-semibold px-5 py-2 rounded-lg transition`}
        >
          {isLoading ? '...' : 'Add Field'}
        </button>
      </div>
    </div>
  )
}

/** --------------- Tags (Automation) Settings --------------- */
function TagsSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetch('/api/settings/tags')
      .then((res) => res.json())
      .then((data) => {
        setTags(data.tags)
        setIsLoading(false)
      })
      .catch(() => {
        setTags(['VIP', 'New Lead'])
        setIsLoading(false)
      })
  }, [])

  const addTag = async () => {
    if (!newTag.trim()) {
      setErrorMsg('Tag cannot be empty.')
      return
    }
    setErrorMsg('')
    setIsLoading(true)
    try {
      const res = await fetch('/api/settings/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag: newTag.trim() }),
      })
      if (res.ok) {
        const created = await res.json()
        setTags((prev) => [...prev, created])
        setNewTag('')
      } else {
        setErrorMsg('Failed to add tag.')
      }
    } catch {
      setErrorMsg('Network error.')
    } finally {
      setIsLoading(false)
    }
  }

  const removeTag = async (index) => {
    const tag = tags[index]
    const confirmed = window.confirm(`Remove tag "${tag}"?`)
    if (!confirmed) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/settings/tags/${encodeURIComponent(tag)}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setTags((prev) => prev.filter((_, idx) => idx !== index))
      } else {
        alert('Failed to remove tag.')
      }
    } catch {
      alert('Network error.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <p className="text-gray-600">Loading...</p>

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
      {tags.length === 0 ? (
        <p className="text-gray-600">No tags created yet.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <li
              key={idx}
              className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-800"
            >
              {tag}
              <button
                onClick={() => removeTag(idx)}
                disabled={isLoading}
                className={`ml-2 text-xs ${
                  isLoading ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:underline'
                }`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex flex-col gap-2">
        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
        <input
          type="text"
          placeholder="New Tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          disabled={isLoading}
          className="w-full border border-gray-300 rounded-lg p-2"
        />
        <button
          onClick={addTag}
          disabled={isLoading}
          className={`w-fit ${
            isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#4E71FF] hover:bg-[#3a5fcc] text-white'
          } font-semibold px-5 py-2 rounded-lg transition`}
        >
          {isLoading ? '...' : 'Add Tag'}
        </button>
      </div>
    </div>
  )
}

/** --------------- Channel Settings --------------- */
function ChannelSettings({ channel }) {
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState({ enabled: false, notifications: false })

  useEffect(() => {
    fetch(`/api/settings/channels/${encodeURIComponent(channel)}`)
      .then((res) => res.json())
      .then((data) => {
        setSettings(data)
        setIsLoading(false)
      })
      .catch(() => {
        setSettings({ enabled: false, notifications: false })
        setIsLoading(false)
      })
  }, [channel])

  const toggleEnabled = () => {
    setSettings((prev) => ({ ...prev, enabled: !prev.enabled }))
  }
  const toggleNotifications = () => {
    setSettings((prev) => ({ ...prev, notifications: !prev.notifications }))
  }

  const saveChannel = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/settings/channels/${encodeURIComponent(channel)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) alert(`${channel} settings updated.`)
      else alert('Failed to update.')
    } catch {
      alert('Network error.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <p className="text-gray-600">Loading...</p>

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">{channel} Settings</h3>
      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={toggleEnabled}
            disabled={isLoading}
            className="accent-[#4E71FF]"
          />
          <span className="text-sm text-gray-800">Enable {channel}</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={toggleNotifications}
            disabled={isLoading || !settings.enabled}
            className="accent-[#4E71FF]"
          />
          <span className="text-sm text-gray-800">{channel} Notifications</span>
        </label>
        <button
          onClick={saveChannel}
          disabled={isLoading}
          className={`w-fit ${
            isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#4E71FF] hover:bg-[#3a5fcc] text-white'
          } font-semibold px-5 py-2 rounded-lg transition`}
        >
          {isLoading ? '...' : 'Save Changes'}
        </button>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        Customize {channel.toLowerCase()} integration and notification preferences.
      </p>
    </div>
  )
}

/** --------------- Extensions Placeholder --------------- */
function ExtensionsPlaceholder({ name }) {
  return (
    <div className="text-gray-600">
      Manage your {name.toLowerCase()} extensions here.
    </div>
  )
}
