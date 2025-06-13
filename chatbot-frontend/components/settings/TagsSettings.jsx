// components/settings/TagsSettings.jsx
import { useState, useEffect } from 'react';

export default function TagsSettings() {
  const [tags, setTags] = useState([]);
  const [name, setName] = useState('');

  useEffect(()=>{
    fetch('/api/settings/tags')
      .then(r=>r.json())
      .then(d=>setTags(d.tags));
  },[]);

  const add = async ()=>{
    await fetch('/api/settings/tags',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name})});
    setName('');
    setTags(await fetch('/api/settings/tags').then(r=>r.json()).then(d=>d.tags));
  };

  const remove = async t=>{
    await fetch(`/api/settings/tags/${t}`,{method:'DELETE'});
    setTags(tags.filter(x=>x!==t));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Tags</h3>
      <ul className="flex flex-wrap gap-2">
        {tags.map(t=>(
          <span key={t} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded flex items-center">
            {t}
            <button onClick={()=>remove(t)} className="ml-2 text-red-500">×</button>
          </span>
        ))}
      </ul>
      <div className="flex space-x-2">
        <input value={name} placeholder="Tag Name" onChange={e=>setName(e.target.value)} className="p-2 border rounded"/>
        <button onClick={add} className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
      </div>
    </div>
  )
}
