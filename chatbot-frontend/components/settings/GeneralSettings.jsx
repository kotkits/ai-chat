// components/settings/GeneralSettings.jsx
import { useState, useEffect } from 'react';

export default function GeneralSettings() {
  const [botName, setBotName]             = useState('');
  const [language, setLanguage]           = useState('en');
  const [timeZone, setTimeZone]           = useState('');
  const [defaultReply, setDefaultReply]   = useState('');
  const [retentionDays, setRetentionDays] = useState(30);
  const [loading, setLoading]             = useState(true);

  // Load existing settings on mount
  useEffect(() => {
    fetch('/api/settings/general')
      .then(res => res.json())
      .then(data => {
        setBotName(data.botName);
        setLanguage(data.language);
        setTimeZone(data.timeZone);
        setDefaultReply(data.defaultReply);
        setRetentionDays(data.retentionDays);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Save handler
  const save = async () => {
    setLoading(true);
    await fetch('/api/settings/general', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        botName,
        language,
        timeZone,
        defaultReply,
        retentionDays
      })
    });
    alert('General settings saved!');
    setLoading(false);
  };

  if (loading) {
    return <p>Loading general settings…</p>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">General Settings</h3>

      <div>
        <label className="block mb-1">Bot Name</label>
        <input
          type="text"
          value={botName}
          onChange={e => setBotName(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block mb-1">Default Language</label>
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Time Zone</label>
        <input
          type="text"
          value={timeZone}
          onChange={e => setTimeZone(e.target.value)}
          placeholder="e.g. America/New_York"
          className="w-full p-2 border rounded dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block mb-1">Default Reply</label>
        <textarea
          rows={2}
          value={defaultReply}
          onChange={e => setDefaultReply(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block mb-1">Data Retention (days)</label>
        <input
          type="number"
          value={retentionDays}
          onChange={e => setRetentionDays(+e.target.value)}
          className="w-32 p-2 border rounded dark:bg-gray-700"
          min={1}
        />
      </div>

      <button
        onClick={save}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Save
      </button>
    </div>
  );
}
