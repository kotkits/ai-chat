// components/settings/LogsSettings.jsx
import { useState, useEffect } from 'react';

export default function LogsSettings() {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings/logs')
      .then(res => res.json())
      .then(json => setLogs(json.logs))
      .finally(() => setLoading(false));
  }, []);

  const clearAll = async () => {
    await fetch('/api/settings/logs', { method: 'DELETE' });
    setLogs([]);
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Logs</h3>
      <button
        onClick={clearAll}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Clear All
      </button>
      <ul className="max-h-64 overflow-auto space-y-2">
        {logs.map((l,i)=>(
          <li key={i} className="border-b pb-1">
            <span className="text-sm text-gray-500">{new Date(l.time).toLocaleString()}</span>
            <p>{l.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
