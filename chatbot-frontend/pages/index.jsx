// pages/index.jsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-4xl font-bold mb-4">Welcome to Your Chatbot Dashboard</h1>
      <p className="mb-8 text-center max-w-md">
        Manage your workflows, contacts, and settings all in one place.
      </p>
      <Link
        href="/get-started"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Get Started
      </Link>
    </div>
  );
}
