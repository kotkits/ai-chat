// components/settings/AccountSwitcher.jsx
import { useState, useEffect } from 'react';

export default function AccountSwitcher({ selectedId, onSelect }) {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetch('/api/accounts')
      .then(r => r.json())
      .then(setAccounts)
      .catch(console.error);
  }, []);

  return (
    <div className="p-4 border-r space-y-4">
      <h4 className="text-sm font-semibold">Your Accounts</h4>
      <ul className="space-y-2">
        {accounts.map(acc => (
          <li key={acc.id}>
            <button
              className={`w-full text-left px-3 py-2 rounded ${
                selectedId === acc.id
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => onSelect(acc.id)}
            >
              <img
                src={acc.avatar}
                alt={acc.name}
                className="inline-block w-5 h-5 rounded-full mr-2 align-text-bottom"
              />
              {acc.name} <span className="text-xs text-gray-500">({acc.plan})</span>
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => alert('Connect new account flow')}
        className="w-full mt-4 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        + Connect Account
      </button>
    </div>
  );
}
