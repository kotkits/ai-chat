// components/ContactsContent.jsx

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";
import { FaPlus, FaUpload, FaTrash } from "react-icons/fa";

export default function ContactsContent() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const { data: session, status } = useSession();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");    // General error banner
  const [formError, setFormError] = useState("");    // Inline form error
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showForm, setShowForm] = useState(false);
  const [newContact, setNewContact] = useState({
    avatar: "",
    name: "",
    gender: "",
    status: "",
    subscribed: "",
  });
  const [importing, setImporting] = useState(false);

  const selectedCount = selectedIds.size;
  const totalCount = contacts.length;
  const allSelected = totalCount > 0 && selectedCount === totalCount;

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  // Fetch contacts for the logged-in user
  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchContacts() {
      setLoading(true);
      try {
        const username = encodeURIComponent(session.user.name);
        const res = await fetch(`/api/contacts?username=${username}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setContacts(
          data.map((c) => ({
            id: c._id,
            avatar: c.avatar,
            name: c.name,
            gender: c.gender,
            status: c.status,
            subscribed: c.subscribed,
            owner: c.username,
          }))
        );
      } catch {
        console.warn("Could not load contacts; starting with empty list.");
      } finally {
        setLoading(false);
      }
    }

    fetchContacts();
  }, [status, session]);

  const toggleSelection = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(contacts.map((c) => c.id)));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateContact = async (e) => {
    e.preventDefault();
    setFormError("");
    setErrorMsg("");

    if (!newContact.name.trim()) {
      setFormError("Name is required.");
      return;
    }

    const contactToAdd = {
      avatar: newContact.avatar.trim() || "https://via.placeholder.com/40?text=🤖",
      name: newContact.name.trim(),
      gender: newContact.gender.trim() || "—",
      status: newContact.status.trim() || "Subscribed",
      subscribed: newContact.subscribed.trim() || "Just now",
      username: session.user.name,
    };

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactToAdd),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const created = await res.json();
      setContacts((prev) => [
        ...prev,
        {
          id: created._id,
          avatar: created.avatar,
          name: created.name,
          gender: created.gender,
          status: created.status,
          subscribed: created.subscribed,
          owner: created.username,
        },
      ]);
    } catch {
      const fallbackId = Date.now().toString();
      setContacts((prev) => [
        ...prev,
        { id: fallbackId, ...contactToAdd, owner: contactToAdd.username },
      ]);
    } finally {
      setNewContact({ avatar: "", name: "", gender: "", status: "", subscribed: "" });
      setShowForm(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", session.user.name);

    try {
      const res = await fetch("/api/contacts/import", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const importedContacts = await res.json();
      setContacts((prev) => [
        ...prev,
        ...importedContacts.map((c) => ({
          id: c._id,
          avatar: c.avatar,
          name: c.name,
          gender: c.gender,
          status: c.status,
          subscribed: c.subscribed,
          owner: c.username,
        })),
      ]);
    } catch {
      console.warn("CSV import failed or endpoint missing.");
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedCount === 0) return;
    setErrorMsg("");

    try {
      const res = await fetch("/api/contacts/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds), username: session.user.name }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setContacts((prev) => prev.filter((c) => !selectedIds.has(c.id)));
      setSelectedIds(new Set());
    } catch {
      setContacts((prev) => prev.filter((c) => !selectedIds.has(c.id)));
      setSelectedIds(new Set());
    }
  };

  const handleSingleDelete = async (id) => {
    try {
      const res = await fetch(`/api/contacts/${id}?username=${encodeURIComponent(session.user.name)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch {
      setContacts((prev) => prev.filter((c) => c.id !== id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  if (status === "loading") {
    return <div className="text-center py-20 text-gray-500">Checking authentication…</div>;
  }
  if (status === "unauthenticated") {
    return null; // signIn() will redirect
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Contacts for {session.user.name}</h1>
        <button
          onClick={() => router.push("/")}
          className="text-sm text-blue-600 hover:underline"
        >
          Return to Dashboard
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-700">
          Manage your contacts
        </h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => {
              setShowForm((prev) => !prev);
              setFormError("");
            }}
            className="flex items-center space-x-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-sm"
          >
            <FaPlus />
            <span>{showForm ? "Cancel" : "Add Contact"}</span>
          </button>

          <button
            type="button"
            onClick={handleImportClick}
            disabled={importing}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium ${
              importing
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            <FaUpload />
            <span>{importing ? "Importing…" : "Import CSV"}</span>
          </button>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleDeleteSelected}
            disabled={selectedCount === 0}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium ${
              selectedCount === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            <FaTrash />
            <span>Delete Selected</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-red-700">
          {errorMsg}
        </div>
      )}

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
                placeholder="https://example.com/avatar.png"
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
                placeholder="Enter name"
                className={`mt-1 block w-full border ${
                  formError ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                required
              />
              {formError && (
                <p className="mt-1 text-xs text-red-600">{formError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                value={newContact.gender}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">—</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={newContact.status}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="Subscribed">Subscribed</option>
                <option value="Unsubscribed">Unsubscribed</option>
              </select>
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
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-md transition"
            >
              Save Contact
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-500">
          Loading contacts…
        </div>
      ) : (
        <>
          {selectedCount > 0 && (
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-600">
                {selectedCount} selected of {totalCount} total
              </div>
            </div>
          )}

          <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={allSelected}
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {contacts.map((contact) => {
                  const isSelected = selectedIds.has(contact.id);
                  return (
                    <tr key={contact.id} className={isSelected ? "bg-blue-50" : ""}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelection(contact.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {contact.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {contact.gender}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {contact.status}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {contact.subscribed}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleSingleDelete(contact.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {contacts.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No contacts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
