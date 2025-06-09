// components/AdminSettings.jsx

import React, { useState, useEffect } from 'react';

export default function AdminSettings() {
  const [tab, setTab] = useState('settings');

  // System Settings state
  const [settings, setSettings] = useState({
    siteTitle: '',
    maintenanceMode: false,
    allowRegistrations: true,
  });
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState(null);
  const [settingsMsg, setSettingsMsg] = useState('');

  // Users state
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userError, setUserError] = useState(null);

  // Logs state
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logsError, setLogsError] = useState(null);

  // Load settings on mount
  useEffect(() => {
    fetch('/api/settings')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load settings');
        return res.json();
      })
      .then(data => setSettings(data))
      .catch(() => setSettingsError('Could not load settings'))
      .finally(() => setLoadingSettings(false));
  }, []);

  // Load users when Users tab is active
  useEffect(() => {
    if (tab !== 'users') return;
    setLoadingUsers(true);
    fetch('/api/users')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load users');
        return res.json();
      })
      .then(setUsers)
      .catch(() => setUserError('Could not load users'))
      .finally(() => setLoadingUsers(false));
  }, [tab]);

  // Load logs when Logs tab is active
  useEffect(() => {
    if (tab !== 'logs') return;
    setLoadingLogs(true);
    fetch('/api/logs')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load logs');
        return res.json();
      })
      .then(setLogs)
      .catch(() => setLogsError('Could not load logs'))
      .finally(() => setLoadingLogs(false));
  }, [tab]);

  // Handlers for Settings
  const handleSettingsChange = e => {
    const { name, type, checked, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  const saveSettings = async e => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsError(null);
    setSettingsMsg('');
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error();
      setSettingsMsg('Settings saved successfully!');
    } catch {
      setSettingsError('Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // Handlers for Users
  const toggleUserActive = async userId => {
    try {
      await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
      });
      setUsers(u =>
        u.map(x =>
          x.id === userId ? { ...x, active: !x.active } : x
        )
      );
    } catch {
      // handle error
    }
  };

  // Render tab navigation
  const renderTabs = () => (
    <div className="flex border-b mb-4">
      {['settings','users','logs'].map(t => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`px-4 py-2 -mb-px ${
            tab===t
              ? 'border-b-2 border-[#4E71FF] font-semibold'
              : 'text-gray-600'
          }`}
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );

  // Render content for each tab
  const renderContent = () => {
    if (tab === 'settings') {
      if (loadingSettings) return <p>Loading settings…</p>;
      return (
        <form onSubmit={saveSettings} className="space-y-4">
          {settingsError && <p className="text-red-600">⚠️ {settingsError}</p>}
          {settingsMsg && <p className="text-green-600">✅ {settingsMsg}</p>}
          <div>
            <label htmlFor="siteTitle" className="block">Site Title</label>
            <input
              id="siteTitle"
              name="siteTitle"
              value={settings.siteTitle}
              onChange={handleSettingsChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="maintenanceMode"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleSettingsChange}
              className="mr-2"
            />
            <label htmlFor="maintenanceMode">Enable Maintenance Mode</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowRegistrations"
              name="allowRegistrations"
              checked={settings.allowRegistrations}
              onChange={handleSettingsChange}
              className="mr-2"
            />
            <label htmlFor="allowRegistrations">Allow New User Registrations</label>
          </div>
          <button
            type="submit"
            disabled={savingSettings}
            className="px-4 py-2 bg-[#4E71FF] text-white rounded disabled:opacity-50"
          >
            {savingSettings ? 'Saving…' : 'Save Settings'}
          </button>
        </form>
      );
    }

    if (tab === 'users') {
      if (loadingUsers) return <p>Loading users…</p>;
      if (userError) return <p className="text-red-600">{userError}</p>;
      if (!users.length) return <p>No users found.</p>;
      return (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1">Name</th>
              <th className="px-2 py-1">Email</th>
              <th className="px-2 py-1">Status</th>
              <th className="px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-2 py-1">{u.name}</td>
                <td className="px-2 py-1">{u.email}</td>
                <td className="px-2 py-1">
                  {u.active ? 'Active' : 'Deactivated'}
                </td>
                <td className="px-2 py-1 space-x-2">
                  <button
                    onClick={() => toggleUserActive(u.id)}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    {u.active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (tab === 'logs') {
      if (loadingLogs) return <p>Loading logs…</p>;
      if (logsError) return <p className="text-red-600">{logsError}</p>;
      if (!logs.length) return <p>No activity logs.</p>;
      return (
        <ul className="list-disc pl-5 space-y-1">
          {logs.map((log, i) => (
            <li key={i}>
              <strong>{new Date(log.timestamp).toLocaleString()}</strong>: {log.message}
            </li>
          ))}
        </ul>
      );
    }

    return null;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-[#4E71FF] mb-4">Admin Settings</h2>
      {renderTabs()}
      {renderContent()}
    </div>
  );
}
