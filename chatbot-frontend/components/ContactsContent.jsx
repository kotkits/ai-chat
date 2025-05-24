// components/ContactsContent.jsx
import React from 'react'

export default function ContactsContent() {
  const dummy = ['Alice', 'Bob', 'Charlie', 'Dana']
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-[#4E71FF]">Contacts</h2>
      <ul className="bg-white rounded-lg shadow divide-y divide-gray-200">
        {dummy.map((name) => (
          <li key={name} className="p-4 hover:bg-gray-50 flex justify-between">
            <span>{name}</span>
            <button className="text-[#4E71FF] hover:underline text-sm">View</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
