// components/settings/FieldsSettings.jsx
import { useState, useEffect } from 'react';

export default function FieldsSettings() {
  const [fields, setFields] = useState([]);
  const [name, setName]     = useState('');
  const [type, setType]     = useState('text');

  useEffect(()=>{
    fetch('/api/settings/fields')
      .then(r=>r.json())
      .then(d=>setFields(d.fields));
  },[]);

  const add = async ()=>{
    await fetch('/api/settings/fields',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,type})});
    setName(''); setType('text');
    setFields(await fetch('/api/settings/fields').then(r=>r.json()).then(d=>d.fields));
  };

  const remove = async n=>{
    await fetch(`/api/settings/fields/${n}`,{method:'DELETE'});
    setFields(fields.filter(f=>f.name!==n));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Custom Fields</h3>
      <ul>
        {fields.map(f=>(
          <li key={f.name} className="flex justify-between">
            <span>{f.name} ({f.type})</span>
            <button onClick={()=>remove(f.name)} className="text-red-500">Remove</button>
          </li>
        ))}
      </ul>
      <div className="flex space-x-2">
        <input value={name} placeholder="Field Name" onChange={e=>setName(e.target.value)} className="p-2 border rounded"/>
        <select value={type} onChange={e=>setType(e.target.value)} className="p-2 border rounded">
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="date">Date</option>
        </select>
        <button onClick={add} className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
      </div>
    </div>
  )
}
