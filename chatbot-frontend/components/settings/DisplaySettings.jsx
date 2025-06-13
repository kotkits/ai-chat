// components/settings/DisplaySettings.jsx
import { useState, useEffect } from 'react';

export default function DisplaySettings() {
  const [theme, setTheme]     = useState('system');
  const [language, setLang]   = useState('en');
  const [timeZone, setTZ]     = useState('');
  const [fontSize, setFS]     = useState('base');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings/display')
      .then(r=>r.json())
      .then(data=>{
        setTheme(data.theme);
        setLang(data.language);
        setTZ(data.timeZone);
        setFS(data.fontSize);
      })
      .finally(()=>setLoading(false));
  }, []);

  const save = async () => {
    await fetch('/api/settings/display',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({theme,language:language,timeZone,fontSize})});
    alert('Saved!');
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Display Settings</h3>
      <div>
        <label>Theme</label>
        <select value={theme} onChange={e=>setTheme(e.target.value)} className="p-2 border rounded">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>
      <div>
        <label>Language</label>
        <select value={language} onChange={e=>setLang(e.target.value)} className="p-2 border rounded">
          <option value="en">English</option>
          <option value="es">Spanish</option>
        </select>
      </div>
      <div>
        <label>Time Zone</label>
        <input value={timeZone} onChange={e=>setTZ(e.target.value)} placeholder="e.g. UTC" className="p-2 border rounded w-full"/>
      </div>
      <div>
        <label>Font Size</label>
        <select value={fontSize} onChange={e=>setFS(e.target.value)} className="p-2 border rounded">
          <option value="sm">Small</option>
          <option value="base">Base</option>
          <option value="lg">Large</option>
          <option value="xl">XL</option>
        </select>
      </div>
      <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
    </div>
  )
}
