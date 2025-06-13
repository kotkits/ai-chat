// components/settings/BillingSettings.jsx
import { useState, useEffect } from 'react';

export default function BillingSettings() {
  const [plan, setPlan]         = useState('Free');
  const [billingEmail, setEmail] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch('/api/settings/billing')
      .then(r=>r.json())
      .then(data => {
        setPlan(data.plan);
        setEmail(data.billingEmail);
        setInvoices(data.invoices);
      })
      .finally(()=>setLoading(false));
  }, []);

  const save = async () => {
    await fetch('/api/settings/billing', {
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ plan, billingEmail })
    });
    alert('Saved!');
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Billing Settings</h3>
      <div>
        <label>Plan</label>
        <select value={plan} onChange={e=>setPlan(e.target.value)} className="p-2 border rounded">
          <option>Free</option>
          <option>Pro</option>
          <option>Enterprise</option>
        </select>
      </div>
      <div>
        <label>Billing Email</label>
        <input
          type="email" value={billingEmail} onChange={e=>setEmail(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700"
        />
      </div>
      <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
      <div>
        <h4 className="font-medium mt-4">Invoices</h4>
        <ul className="list-disc pl-6">
          {invoices.map((inv,i)=>(
            <li key={i}>{inv}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
