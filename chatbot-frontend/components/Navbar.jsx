// components/Navbar.jsx
import { signOut, useSession } from 'next-auth/react';
import { Menu as MenuIcon } from 'lucide-react';

export default function Navbar({ toggleSidebar }) {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <MenuIcon className="w-6 h-6" />
      </button>
      <div className="flex items-center space-x-4">
        <span className="font-medium">{session?.user?.name}</span>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}
