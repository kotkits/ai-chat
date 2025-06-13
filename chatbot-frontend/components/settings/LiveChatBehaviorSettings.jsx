// components/settings/LiveChatBehaviorSettings.jsx
import { useState, useEffect } from 'react';

export default function LiveChatBehaviorSettings() {
  const [greeting, setGreet] = useState('');
  const [offline, setOffline] = useState(false);
  const [defaultReply, setDef] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    fetch('/api/settings/live-chat-behavior')
      .then(r=>r.json())
      .then(d=>{
        setGreet(d.greeting); setOffline(d.offline); setDef(d.defaultReply);
      })
      .finally(()=>setLoading(false));
  },[]);

  const save=async()=>{
    await fetch('/api/settings/live-chat-behavior',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({greeting,offline,defaultReply})});
    alert('Saved');
  };

  if(loading) return <p>Loading…</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Live Chat Behavior</h3>
      <div>
        <label>Greeting Message</label>
        <textarea rows={2} value={greeting} onChange={e=>setGreet(e.target.value)} className="w-full p-2 border rounded"/>
      </div>
      <div className="flex items-center">
        <input type="checkbox" checked={offline} onChange={e=>setOffline(e.target.checked)} className="mr-2"/>
        <label>Enable Offline Form</label>
      </div>
      <div>
        <label>Default Reply</label>
        <textarea rows={2} value={defaultReply} onChange={e=>setDef(e.target.value)} className="w-full p-2 border rounded"/>
      </div>
      <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
    </div>
  )
}
