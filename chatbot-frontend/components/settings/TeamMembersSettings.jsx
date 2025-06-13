// components/settings/TeamMembersSettings.jsx
import { useState, useEffect } from 'react';

export default function TeamMembersSettings() {
  const [members, setMembers] = useState([]);
  const [name, setName]       = useState('');
  const [role, setRole]       = useState('Agent');
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings/team-members')
      .then(res => res.json())
      .then(json => setMembers(json.members))
      .finally(() => setLoading(false));
  }, []);

  const add = async () => {
    setLoading(true);
    await fetch('/api/settings/team-members', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, role, email })
    });
    setName(''); setRole('Agent'); setEmail('');
    // reload
    const json = await fetch('/api/settings/team-members').then(r=>r.json());
    setMembers(json.members);
    setLoading(false);
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Team Members</h3>
      <table className="w-full text-left">
        <thead>
          <tr><th className="p-2">Name</th><th className="p-2">Role</th><th className="p-2">Email</th></tr>
        </thead>
        <tbody>
          {members.map((m,i)=>(
            <tr key={i} className="border-b">
              <td className="p-2">{m.name}</td>
              <td className="p-2">{m.role}</td>
              <td className="p-2">{m.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="space-y-2">
        <input
          type="text" placeholder="Full Name"
          value={name} onChange={e=>setName(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700"
        />
        <select
          value={role} onChange={e=>setRole(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700"
        >
          <option>Admin</option>
          <option>Agent</option>
          <option>Manager</option>
        </select>
        <input
          type="email" placeholder="Email"
          value={email} onChange={e=>setEmail(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700"
        />
        <button
          onClick={add}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Member
        </button>
      </div>
    </div>
);
}
