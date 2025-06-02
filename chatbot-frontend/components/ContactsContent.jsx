// File: components/ContactsContent.jsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import { FaPlus, FaUpload, FaChevronDown, FaArrowLeft } from "react-icons/fa";

export default function ContactsContent() {
  const router = useRouter();

  // Dummy contact data; replace with real data as needed
  const initialContacts = [
    {
      id: 1,
      avatar: "https://via.placeholder.com/40?text=L", // “L” for littlebothelper
      name: "littlebothelper",
      gender: "—",
      status: "Subscribed",
      subscribed: "1 year ago",
    },
    {
      id: 2,
      avatar: "https://via.placeholder.com/40?text=J", // “J” for Johnny
      name: "Johnny Mnemonic",
      gender: "Male",
      status: "Subscribed",
      subscribed: "2 years ago",
    },
  ];

  const [contacts] = useState(initialContacts);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const selectedCount = selectedIds.size;

  // Toggle a single contact’s selection
  const toggleSelection = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle “select all”
  const toggleSelectAll = () => {
    if (selectedCount === contacts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(contacts.map((c) => c.id)));
    }
  };

  return (
    <div className="p-6">
      {/* ─── Back Button ─────────────────────────────────────────────────────── */}
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 mb-4"
      >
        <FaArrowLeft />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* ─── Page Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Contacts</h1>
        <div className="flex space-x-2">
          <button
            type="button"
            className="flex items-center space-x-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-sm"
          >
            <FaPlus className="text-gray-600" />
            <span>Create New Contact</span>
          </button>
          <button
            type="button"
            className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm"
          >
            <FaUpload className="text-white" />
            <span>Import</span>
          </button>
        </div>
      </div>

      {/* ─── Conditionally show Subheader only when ≥1 selected ──────────────── */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-600">
            {selectedCount} selected of {selectedCount}
          </div>
          <div>
            <button
              type="button"
              className="flex items-center space-x-1 text-sm font-medium bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md"
            >
              <span>Bulk Actions</span>
              <FaChevronDown className="text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* ─── Contacts Table ──────────────────────────────────────────────────── */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Select All Checkbox */}
              <th className="w-12 px-4 py-3 text-left text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={selectedCount === contacts.length && contacts.length > 0}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Avatar
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Gender
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Subscribed
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {contacts.map((contact) => {
              const isSelected = selectedIds.has(contact.id);
              return (
                <tr key={contact.id} className={isSelected ? "bg-blue-50" : ""}>
                  {/* Row Checkbox */}
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(contact.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>

                  {/* Avatar */}
                  <td className="px-4 py-3">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  </td>

                  {/* Name */}
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {contact.name}
                  </td>

                  {/* Gender */}
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {contact.gender}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {contact.status}
                  </td>

                  {/* Subscribed */}
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {contact.subscribed}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
