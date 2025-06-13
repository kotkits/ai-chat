// components/settings/ChannelSettings.jsx
import { useState, useEffect } from 'react';

export default function ChannelSettings({ channel }) {
  const [cfg, setCfg]       = useState({});
  const [loading, setLoading]= useState(true);

  useEffect(()=>{
    fetch(`/api/settings/channels/${channel}`)
      .then(r=>r.json())
      .then(data=>{ setCfg(data); setLoading(false); });
  },[channel]);

  const save = async () => {
    setLoading(true);
    await fetch(`/api/settings/channels/${channel}`,{
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(cfg)
    });
    alert(`${channel} settings saved`);
    setLoading(false);
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold capitalize">{channel} Settings</h3>
      {/* Render JSON editor for now */}
      <textarea
        rows={10}
        value={JSON.stringify(cfg, null, 2)}
        onChange={e=>setCfg(JSON.parse(e.target.value))}
        className="w-full p-2 border rounded font-mono text-sm bg-gray-100"
      />
      <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
    </div>
  )
}
