// components/AuditLogs.jsx
import React, { useEffect, useState } from 'react'

export default function AuditLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch('/api/audit-logs')
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const data = await res.json()
        setLogs(data.logs)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-[#4E71FF] mb-4">Audit Logs</h2>
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-[#4E71FF] mb-4">Audit Logs</h2>
        <p className="text-red-500">Failed to load logs: {error}</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#4E71FF] mb-4">Audit Logs</h2>
      <p className="text-gray-600 mb-6">View system activity and change history.</p>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Timestamp</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">User</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-4 py-6 text-center text-gray-500">
                  No audit entries found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-t">
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">{log.user}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{log.action}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
