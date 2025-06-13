// components/settings/AutoAssignmentSettings.jsx
import { useState, useEffect } from 'react';

export default function AutoAssignmentSettings() {
  const [enabled, setEnabled] = useState(false);
  const [method, setMethod]   = useState('round-robin');
  const [maxPerAgent, setMax] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    fetch('/api/settings/auto-assignment')
      .then(r=>r.json())
      .then(d=>{
        setEnabled(d.enabled); setMethod(d.method); setMax(d.maxPerAgent);
      })
      .finally(()=>setLoading(false));
  },[]);

  const save=async()=>{
    await fetch('/api/settings/auto-assignment',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({enabled,method,maxPerAgent})});
    alert('Saved');
  };

  if(loading) return <p>Loading…</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Auto-Assignment</h3>
      <div>
        <label>
          <input type="checkbox" checked={enabled} onChange={e=>setEnabled(e.target.checked)} className="mr-2"/>
          Enable Auto-Assign
        </label>
      </div>
      <div>
        <label>Method</label>
        <select value={method} onChange={e=>setMethod(e.target.value)} className="p-2 border rounded">
          <option value="round-robin">Round Robin</option>
          <option value="least-busy">Least Busy</option>
          <option value="manual">Manual</option>
        </select>
      </div>
      <div>
        <label>Max per Agent</label>
        <input type="number" value={maxPerAgent} min={1} onChange={e=>setMax(+e.target.value)} className="p-2 border rounded w-24"/>
      </div>
      <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
    </div>
  )
}
