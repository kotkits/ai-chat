import React, { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { FaSearch, FaFilter, FaSort, FaEllipsisV } from 'react-icons/fa'

export default function LiveChatContent({ currentPage }) {
  const { data: session, status } = useSession()
  const [convos, setConvos] = useState([])
  const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') signIn()
  }, [status])

  const loadConvos = () => {
    if (status === 'authenticated' && currentPage) {
      fetch(`/api/conversations?pageId=${currentPage.id}`)
        .then(res => res.json())
        .then(setConvos)
        .catch(console.error)
    }
  }

  useEffect(loadConvos, [status, currentPage])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!selected || !reply.trim()) return

    const res = await fetch('/api/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageId: currentPage.id,
        recipientId: selected.senderId,
        message: reply.trim(),
      }),
    })

    if (res.ok) {
      setReply('')
      loadConvos()
    } else {
      console.error('Send failed:', await res.text())
    }
  }

  return (
    <div className="flex h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
      <div className="flex h-full w-full rounded-xl border border-gray-700 bg-gray-900 overflow-hidden">


        {/* Left panel: conversation list */}
        <div className="w-1/4 bg-gray-850 border-r border-gray-700 text-white">
          <div className="p-4 border-b border-gray-700 bg-gray-900">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations"
                className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring focus:outline-none"
              />
            </div>
          </div>
          <ul>
            {convos.map(c => (
              <li
                key={c._id}
                onClick={() => setSelected(c)}
                className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-200 ${
                  selected?._id === c._id
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                <img
                  src={c.avatar || '/default-avatar.png'}
                  alt=""
                  className="w-10 h-10 rounded-full mr-3 border border-gray-600"
                />
                <div className="flex-1">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-gray-300 truncate">{c.text}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(c.timestamp).toLocaleTimeString()}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Middle panel: chat thread */}
        <div className="flex-1 flex flex-col bg-gray-850 text-white">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-blue-400">
              {selected?.name || 'Select a conversation'}
            </h2>
            <div className="flex space-x-3 text-gray-400">
              <FaFilter className="cursor-pointer hover:text-white" />
              <FaSort className="cursor-pointer hover:text-white" />
              <FaEllipsisV className="cursor-pointer hover:text-white" />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-800">
            {selected?.history?.map((m, i) => (
              <div
                key={i}
                className={`max-w-xs px-4 py-2 rounded-xl text-sm shadow-md ${
                  m.from === 'user'
                    ? 'bg-blue-600 text-white ml-auto'
                    : 'bg-gray-700 text-gray-200'
                }`}
              >
                {m.text}
              </div>
            )) || (
              <p className="text-center text-gray-500 mt-20">
                No messages yet.
              </p>
            )}
          </div>

          {/* Reply form */}
          <form
            className="p-4 bg-gray-900 border-t border-gray-700 flex"
            onSubmit={handleSend}
          >
            <input
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Type your reply…"
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-l-md text-white placeholder-gray-400 focus:ring focus:outline-none"
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
        <div className="w-1/4 bg-gray-850 border-l border-gray-700 p-4 text-white">
          {selected ? (
            <>
              <div className="flex flex-col items-center mb-6">
                <img
                  src={selected.avatar || '/default-avatar.png'}
                  alt=""
                  className="w-24 h-24 rounded-full mb-3 border-2 border-blue-400 shadow-[0_0_15px_rgba(0,162,255,0.5)]"
                />
                <h3 className="text-lg font-medium text-blue-300">{selected.name}</h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <span className="font-semibold text-white">Last:</span>{' '}
                  {new Date(selected.timestamp).toLocaleString()}
                </li>
                <li>
                  <span className="font-semibold text-white">From:</span> {selected.from}
                </li>
                <li>
                  <span className="font-semibold text-white">ID:</span> {selected._id}
                </li>
              </ul>
            </>
          ) : (
            <p className="text-center text-gray-500 mt-20">
              Select a conversation to see details.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
