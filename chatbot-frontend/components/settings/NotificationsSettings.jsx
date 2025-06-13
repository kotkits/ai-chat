// components/settings/NotificationsSettings.jsx
import { useState, useEffect } from 'react';

export default function NotificationsSettings() {
  const [desktop, setDesktop]   = useState([]);
  const [emailSms, setEmailSms] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch('/api/settings/notifications')
      .then(res => res.json())
      .then(data => {
        setDesktop(data.desktop);
        setEmailSms(data.emailSms);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggle = (arr, setArr, val) => {
    setArr(prev => prev.includes(val) ? prev.filter(x => x!==val) : [...prev, val]);
  };

  const save = async () => {
    setLoading(true);
    await fetch('/api/settings/notifications', {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ desktop, emailSms })
    });
    alert('Notifications saved');
    setLoading(false);
  };

  if (loading) return <p>Loading…</p>;

  const desktopOptions = ['Browser Alerts', 'Sound', 'Badge'];
  const emailSmsOptions = ['Email', 'SMS'];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Notifications Settings</h3>

      <div>
        <p className="font-medium mb-1">Desktop Alerts</p>
        {desktopOptions.map(opt => (
          <label key={opt} className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              checked={desktop.includes(opt)}
              onChange={() => toggle(desktop, setDesktop, opt)}
              className="mr-2"
            />
            {opt}
          </label>
        ))}
      </div>

      <div>
        <p className="font-medium mb-1">Email / SMS</p>
        {emailSmsOptions.map(opt => (
          <label key={opt} className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              checked={emailSms.includes(opt)}
              onChange={() => toggle(emailSms, setEmailSms, opt)}
              className="mr-2"
            />
            {opt}
          </label>
        ))}
      </div>

      <button
        onClick={save}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  );
}
