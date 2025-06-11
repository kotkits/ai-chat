// components/AuditLogs.jsx
import { useState, useEffect } from 'react';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/api/settings/logs')
      .then(res => res.json())
      .then(json => setLogs(json.logs));
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3">Audit Logs</h3>
      <ul className="space-y-2 max-h-64 overflow-auto">
        {logs.map((l, i) => (
          <li
            key={i}
            className="border-b border-gray-200 dark:border-gray-700 pb-1"
          >
            <span className="text-sm text-gray-500">
              {new Date(l.time).toLocaleString()}
            </span>
            <p>{l.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
