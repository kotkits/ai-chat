// File: components/ContactsContent.jsx
import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import { FaPlus, FaUpload, FaChevronDown, FaArrowLeft } from "react-icons/fa";

export default function ContactsContent() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Initial contacts (can be empty or pre‐filled)
  const [contacts, setContacts] = useState([
    {
      id: 1,
      avatar: "https://via.placeholder.com/40?text=L",
      name: "littlebothelper",
      gender: "—",
      status: "Subscribed",
      subscribed: "1 year ago",
    },
    {
      id: 2,
      avatar: "https://via.placeholder.com/40?text=J",
      name: "Johnny Mnemonic",
      gender: "Male",
      status: "Subscribed",
      subscribed: "2 years ago",
    },
  ]);

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showForm, setShowForm] = useState(false);
  const [newContact, setNewContact] = useState({
    avatar: "",
    name: "",
    gender: "",
    status: "",
    subscribed: "",
  });

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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewContact((prev) => ({ ...prev, [name]: value }));
  };

  // Submit new contact form
  const handleCreateContact = (e) => {
    e.preventDefault();
    const { avatar, name, gender, status, subscribed } = newContact;
    if (!name.trim()) return; // Name is required

    const nextId = Date.now();
    setContacts((prev) => [
      ...prev,
      {
        id: nextId,
        avatar: avatar.trim() || "https://via.placeholder.com/40?text=?",
        name: name.trim(),
        gender: gender.trim() || "—",
        status: status.trim() || "Subscribed",
        subscribed: subscribed.trim() || "Just now",
      },
    ]);
    // Reset form & hide
    setNewContact({ avatar: "", name: "", gender: "", status: "", subscribed: "" });
    setShowForm(false);
  };

  // Trigger file input click
  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  // Parse CSV and append contacts
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const lines = text.split("\n").map((ln) => ln.trim()).filter((ln) => ln);
      if (lines.length < 2) return; // no data
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const newEntries = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map((c) => c.trim());
        if (cols.length !== headers.length) continue;
        const entry = { id: Date.now() + i };
        headers.forEach((h, idx) => {
          entry[h] = cols[idx];
        });
        // Ensure required fields
        newEntries.push({
          id: entry.id,
          avatar: entry.avatar || "https://via.placeholder.com/40?text=?",
          name: entry.name || "Unnamed",
          gender: entry.gender || "—",
          status: entry.status || "Subscribed",
          subscribed: entry.subscribed || "Just now",
        });
      }
      if (newEntries.length) {
        setContacts((prev) => [...prev, ...newEntries]);
      }
    };
    reader.readAsText(file);
    // Clear input so same file can be re‐selected if needed
    e.target.value = "";
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
          {/* Create New Contact */}
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="flex items-center space-x-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-sm"
          >
            <FaPlus className="text-gray-600" />
            <span>Create New Contact</span>
          </button>
          {/* Import */}
          <button
            type="button"
            onClick={handleImportClick}
            className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm"
          >
            <FaUpload className="text-white" />
            <span>Import</span>
          </button>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* ─── New Contact Form (conditionally shown) ─────────────────────────── */}
      {showForm && (
        <form
          onSubmit={handleCreateContact}
          className="mb-6 bg-white border border-gray-200 rounded-lg p-4 space-y-4 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Avatar URL
              </label>
              <input
                type="text"
                name="avatar"
                value={newContact.avatar}
                onChange={handleChange}
                placeholder="https://..."
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={newContact.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <input
                type="text"
                name="gender"
                value={newContact.gender}
                onChange={handleChange}
                placeholder="Male/Female/—"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <input
                type="text"
                name="status"
                value={newContact.status}
                onChange={handleChange}
                placeholder="Subscribed/Unsubscribed"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subscribed
              </label>
              <input
                type="text"
                name="subscribed"
                value={newContact.subscribed}
                onChange={handleChange}
                placeholder="e.g. 3 months ago"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Add Contact
              </button>
            </div>
          </div>
        </form>
      )}

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
                  checked={
                    selectedCount === contacts.length && contacts.length > 0
                  }
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
                <tr
                  key={contact.id}
                  className={isSelected ? "bg-blue-50" : ""}
                >
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
