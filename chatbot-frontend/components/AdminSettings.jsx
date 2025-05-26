// components/AdminSettings.jsx
import React, { useState, useEffect } from 'react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteTitle: '',
    maintenanceMode: false,
    allowRegistrations: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    // load existing settings
    fetch('/api/settings')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load settings');
        return res.json();
      })
      .then((data) => {
        setSettings(data);
      })
      .catch((err) => {
        console.error(err);
        setError('Could not load settings');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSavedMsg('');

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Save failed');
      setSavedMsg('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading settings…</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-[#4E71FF] mb-4">System Settings</h2>
      {error && (
        <div className="mb-4 text-red-600">
          ⚠️ {error}
        </div>
      )}
      {savedMsg && (
        <div className="mb-4 text-green-600">
          ✅ {savedMsg}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Site Title */}
        <div>
          <label className="block text-gray-700 mb-1" htmlFor="siteTitle">
            Site Title
          </label>
          <input
            type="text"
            id="siteTitle"
            name="siteTitle"
            value={settings.siteTitle}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Maintenance Mode */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="maintenanceMode"
            name="maintenanceMode"
            checked={settings.maintenanceMode}
            onChange={handleChange}
            className="h-4 w-4 mr-2"
          />
          <label htmlFor="maintenanceMode" className="text-gray-700">
            Enable Maintenance Mode
          </label>
        </div>

        {/* Allow Registrations */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="allowRegistrations"
            name="allowRegistrations"
            checked={settings.allowRegistrations}
            onChange={handleChange}
            className="h-4 w-4 mr-2"
          />
          <label htmlFor="allowRegistrations" className="text-gray-700">
            Allow New User Registrations
          </label>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-[#4E71FF] text-white rounded hover:bg-[#3b59d1] disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}