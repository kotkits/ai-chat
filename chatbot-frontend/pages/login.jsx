// pages/login.jsx
import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1) Sign in without redirect
    const res = await signIn('credentials', {
      redirect: false,
      identifier,
      password,
    });

    if (res.error) {
      setError(res.error);
      return;
    }

    // 2) Fetch the current session to get the role
    const session = await getSession();

    // 3) Redirect based on role
    if (session?.user?.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <label className="block mb-2">Username or Email</label>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
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
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login
        </button>
        <p className="mt-4 text-center">
          Don’t have an account?{' '}
          <Link href="/register" className="text-blue-500">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
