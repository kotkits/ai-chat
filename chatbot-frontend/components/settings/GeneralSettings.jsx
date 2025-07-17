import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

// Attempt to get a full IANA list if supported
const timeZones =
  typeof Intl.supportedValuesOf === 'function'
    ? Intl.supportedValuesOf('timeZone')
    : [Intl.DateTimeFormat().resolvedOptions().timeZone];

export default function GeneralSettings() {
  const { data: session } = useSession();
  const [timeZone, setTimeZone] = useState('');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    // Load only the timeZone from your API
    fetch('/api/settings/general')
      .then((r) => r.json())
      .then((data) => {
        setTimeZone(data.timeZone);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const saveTimeZone = async () => {
    setLoading(true);
    await fetch('/api/settings/general', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timeZone })
    });
    alert('Time zone saved!');
    setLoading(false);
  };

  const leaveAccount = async () => {
    if (!confirm('Are you sure you want to leave this account?')) return;
    await fetch('/api/settings/general/leave', { method: 'POST' });
    // After leaving, sign out
    signOut();
  };

  const deleteAccount = async () => {
    if (!confirm('This is permanent. Delete your account?')) return;
    await fetch('/api/settings/general', { method: 'DELETE' });
    // After deletion, sign out
    signOut();
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div className="space-y-6">
      {/* Account Time Zone */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Account Time Zone</h3>
          <select
            value={timeZone}
            onChange={(e) => setTimeZone(e.target.value)}
            className="mt-1 p-2 border rounded dark:bg-gray-700"
          >
            {timeZones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={saveTimeZone}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
      <p className="text-gray-500 text-sm">
        All the data in ManyChat will be displayed and exported according to this
        timezone.{' '}
        <a
          href="https://help.manychat.com/hc/en-us/articles/360041161233-Time-Zones-in-ManyChat"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          Learn more
        </a>
      </p>

      <hr />

      {/* Leave Account */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Leave Account</h3>
          <p className="text-gray-500 text-sm">
            Transfer your ownership to another team member if you want to leave
            this account.
          </p>
        </div>
        <button
          onClick={leaveAccount}
          disabled={session?.user?.role !== 'owner'}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Leave
        </button>
      </div>

      <hr />

      {/* Delete Account */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Delete Account</h3>
          <p className="text-gray-500 text-sm">
            Continue to account deletion
          </p>
        </div>
        <button
          onClick={deleteAccount}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
