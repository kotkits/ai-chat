// File: components/LiveChatContent.jsx
import React, { useEffect, useState } from 'react'
import { useSession, signIn }          from 'next-auth/react'
import { FaSearch, FaFilter, FaSort, FaEllipsisV } from 'react-icons/fa'

export default function LiveChatContent({ currentPage }) {
  const { data: session, status } = useSession()
  const [convos, setConvos]       = useState([])
  const [selected, setSelected]   = useState(null)
  const [reply, setReply]         = useState('')

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') signIn()
  }, [status])

  // Helper to load conversations for the current page
  const loadConvos = () => {
    if (status === 'authenticated' && currentPage) {
      fetch(`/api/conversations?pageId=${currentPage.id}`)
        .then(res => res.json())
        .then(setConvos)
        .catch(console.error)
    }
  }

  // Load on mount and whenever currentPage changes
  useEffect(loadConvos, [status, currentPage])

  // Send a reply as the Page
  const handleSend = async (e) => {
    e.preventDefault()
    if (!selected || !reply.trim()) return

    const res = await fetch('/api/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageId:      currentPage.id,
        recipientId: selected.senderId,
        message:     reply.trim(),
      }),
    })

    if (res.ok) {
      setReply('')     // clear input
      loadConvos()     // refresh thread
    } else {
      console.error('Send failed:', await res.text())
    }
  }

  return (
    <div className="flex h-full bg-gray-100">

      {/* Left panel: conversation list */}
      <div className="w-1/4 bg-white border-r overflow-y-auto">
        <div className="p-4 border-b">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations"
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring focus:outline-none"
            />
          </div>
        </div>
        <ul>
          {convos.map(c => (
            <li
              key={c._id}
              onClick={() => setSelected(c)}
              className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                selected?._id === c._id ? 'bg-blue-50' : ''
              }`}
            >
              <img
                src={c.avatar || '/default-avatar.png'}
                alt=""
                className="w-10 h-10 rounded-full mr-3"
              />
              <div className="flex-1">
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-gray-500 truncate">{c.text}</p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(c.timestamp).toLocaleTimeString()}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Middle panel: chat thread */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <h2 className="text-xl font-semibold">
            {selected?.name || 'Select a conversation'}
          </h2>
          <div className="flex space-x-3 text-gray-500">
            <FaFilter className="cursor-pointer hover:text-gray-700" />
            <FaSort   className="cursor-pointer hover:text-gray-700" />
            <FaEllipsisV className="cursor-pointer hover:text-gray-700" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-white">
          {selected?.history?.map((m, i) => (
            <div
              key={i}
              className={`max-w-xs px-3 py-2 rounded-lg ${
                m.from === 'user'
                  ? 'bg-blue-100 self-end'
                  : 'bg-gray-200 self-start'
              }`}
            >
              {m.text}
            </div>
          )) || (
            <p className="text-center text-gray-400 mt-20">
              No messages yet.
            </p>
          )}
        </div>

        {/* Reply form */}
        <form
          className="p-4 bg-white border-t flex"
          onSubmit={handleSend}
        >
          <input
            value={reply}
            onChange={e => setReply(e.target.value)}
            placeholder="Type your reply…"
            className="flex-1 px-4 py-2 border rounded-l-md focus:ring focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      </div>

      {/* Right panel: contact details */}
      <div className="w-1/4 bg-white border-l overflow-y-auto p-4">
        {selected ? (
          <>
            <div className="flex flex-col items-center mb-6">
              <img
                src={selected.avatar || '/default-avatar.png'}
                alt=""
                className="w-24 h-24 rounded-full mb-3"
              />
              <h3 className="text-lg font-medium">{selected.name}</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li>
                <span className="font-semibold">Last:</span>{' '}
                {new Date(selected.timestamp).toLocaleString()}
              </li>
              <li>
                <span className="font-semibold">From:</span> {selected.from}
              </li>
              <li>
                <span className="font-semibold">ID:</span> {selected._id}
              </li>
            </ul>
          </>
        ) : (
          <p className="text-center text-gray-400 mt-20">
            Select a conversation to see details.
          </p>
        )}
      </div>
    </div>
  )
}
