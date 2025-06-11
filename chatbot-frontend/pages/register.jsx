// pages/register.jsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || 'Something went wrong');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl mb-6 text-center">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <label className="block mb-2">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700"
          required
        />
        <label className="block mb-2">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700"
          required
        />
        <label className="block mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700"
          required
        />
        <label className="block mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-6 border rounded dark:bg-gray-700"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Register
        </button>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
