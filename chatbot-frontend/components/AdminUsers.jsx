// components/AdminUsers.jsx

import React, { useState, useEffect } from "react";

/**
 * AdminUsers component:
 * - Lists all users (ID, Name, Email, Status)
 * - Allows inline editing of Name and Email
 * - Allows deactivating a user
 *
 * Assumes the following API routes exist:
 *   GET    /api/users               → returns { users: [ { id, name, email, isActive }, … ] }
 *   PUT    /api/users/[id]          → updates { name, email } for the given user ID
 *   POST   /api/users/[id]/deactivate → sets isActive=false for the given user ID
 *
 * Tailwind CSS classes are used for styling. Adjust as needed.
 */

export default function AdminUsers() {
  const [users, setUsers] = useState([]);           // List of user objects
  const [loading, setLoading] = useState(true);     // Loading flag
  const [error, setError] = useState(null);         // Error message
  const [editingId, setEditingId] = useState(null); // ID of user currently being edited
  const [editName, setEditName] = useState("");     // Edited name
  const [editEmail, setEditEmail] = useState("");   // Edited email

  // Fetch all users on mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) {
          throw new Error(`Failed to fetch users: ${res.status}`);
        }
        const data = await res.json();
        setUsers(Array.isArray(data.users) ? data.users : []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Start editing a specific user
  function startEdit(user) {
    setEditingId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
  }

  // Cancel the inline edit
  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditEmail("");
  }

  // Save updated name/email for the current editing user
  async function saveEdit(userId) {
    if (!editName.trim() || !editEmail.trim()) {
      alert("Name and email cannot be empty.");
      return;
    }
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, email: editEmail }),
      });
      if (!res.ok) {
        throw new Error(`Failed to update user: ${res.status}`);
      }
      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, name: editName.trim(), email: editEmail.trim() }
            : u
        )
      );
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert("Error saving user: " + err.message);
    }
  }

  // Deactivate a user (set isActive = false)
  async function deactivateUser(userId) {
    if (!confirm("Are you sure you want to deactivate this user?")) return;

    try {
      const res = await fetch(`/api/users/${userId}/deactivate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error(`Failed to deactivate user: ${res.status}`);
      }
      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: false } : u))
      );
      // If that user was in edit mode, cancel edit
      if (editingId === userId) {
        cancelEdit();
      }
    } catch (err) {
      console.error(err);
      alert("Error deactivating user: " + err.message);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-[#4E71FF]">User Management</h2>
        <p className="mt-4 text-gray-600">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-[#4E71FF]">User Management</h2>
        <p className="mt-4 text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#4E71FF] mb-4">
        User Management
      </h2>

      {users.length === 0 ? (
        <p className="text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-gray-700">ID</th>
                <th className="px-4 py-2 text-left text-gray-700">Name</th>
                <th className="px-4 py-2 text-left text-gray-700">Email</th>
                <th className="px-4 py-2 text-left text-gray-700">Status</th>
                <th className="px-4 py-2 text-center text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  {/* ID */}
                  <td className="px-4 py-2">{user.id}</td>

                  {/* Inline editing for Name & Email */}
                  {editingId === user.id ? (
                    <>
                      {/* Name input */}
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2 py-1 border rounded-md"
                        />
                      </td>
                      {/* Email input */}
                      <td className="px-4 py-2">
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full px-2 py-1 border rounded-md"
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      {/* Display name */}
                      <td className="px-4 py-2">{user.name}</td>
                      {/* Display email */}
                      <td className="px-4 py-2">{user.email}</td>
                    </>
                  )}

                  {/* Status */}
                  <td className="px-4 py-2">
                    {user.isActive ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-red-600">Inactive</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-2 text-center space-x-2">
                    {editingId === user.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(user.id)}
                          className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-2 py-1 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                        {/* Disable Deactivate while editing */}
                        <button
                          disabled
                          className="px-2 py-1 bg-red-200 text-white rounded-md cursor-not-allowed"
                        >
                          Deactivate
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(user)}
                          className="px-2 py-1 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
                          disabled={!user.isActive}
                        >
                          Edit
                        </button>
                        {user.isActive && (
                          <button
                            onClick={() => deactivateUser(user.id)}
                            className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            Deactivate
                          </button>
                        )}
                        {!user.isActive && (
                          <button
                            disabled
                            className="px-2 py-1 bg-red-200 text-white rounded-md cursor-not-allowed"
                          >
                            Deactivate
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
