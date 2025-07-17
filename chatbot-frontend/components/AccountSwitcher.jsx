// File: components/AccountSwitcher.jsx
import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Plus, LogIn }            from 'lucide-react'
import { useSession, signIn }                   from 'next-auth/react'

export default function AccountSwitcher({
  accounts = [],
  currentAccount,
  onSwitchAccount,
  currentPage,
  onSwitchPage,
  collapsed = false
}) {
  const { data: session, status } = useSession()
  const [pages, setPages]         = useState([])
  const [openAccMenu, setOpenAccMenu] = useState(false)
  const [openProv, setOpenProv]       = useState(false)
  const accRef = useRef(null)

  // 1) As soon as we have a Facebook token, load your Pages
  useEffect(() => {
    if (session?.facebookAccessToken) {
      fetch('/api/facebook/pages')
        .then(r => r.json())
        .then(setPages)
        .catch(console.error)
    }
  }, [session?.facebookAccessToken])

  // 2) Dismiss dropdowns on outside click
  useEffect(() => {
    const handler = e => {
      if (accRef.current && !accRef.current.contains(e.target)) {
        setOpenAccMenu(false)
        setOpenProv(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (status === 'loading') return null

  // When collapsed, only show a centered plus icon
  if (collapsed) {
    return (
      <div className="flex justify-center mb-6">
        <Plus className="w-6 h-6 text-white" />
      </div>
    )
  }

  const hasFB = !!session.facebookAccessToken

  return (
    <div className="px-4 pt-4 bg-[#1F2937] h-full">
      {/* ── Account selector ───────────────────── */}
      <div ref={accRef} className="relative mb-6">
        <button
          onClick={() => setOpenAccMenu(o => !o)}
          className="flex items-center w-full px-3 py-2 bg-[#374151] text-white rounded"
        >
          <Plus className="w-5 h-5 mr-2" />
          <span className="flex-1 text-left">
            {accounts.length === 0
              ? '+ Add account'
              : currentAccount.provider[0].toUpperCase() + currentAccount.provider.slice(1)
            }
          </span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {openAccMenu && (
          <div className="absolute left-0 mt-1 w-full bg-[#374151] rounded shadow-lg z-10 text-white">
            <button
              onClick={() => { setOpenProv(true); setOpenAccMenu(false) }}
              className="flex items-center w-full px-4 py-2 hover:bg-[#4B5563]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add account
            </button>
            {accounts.map(a => (
              <button
                key={a.id}
                onClick={() => { onSwitchAccount(a); setOpenAccMenu(false) }}
                className="w-full text-left px-4 py-2 hover:bg-[#4B5563]"
              >
                {a.provider[0].toUpperCase() + a.provider.slice(1)}
              </button>
            ))}
          </div>
        )}

        {openProv && (
          <div className="absolute left-0 mt-1 w-full bg-white rounded shadow-lg z-20">
            {['facebook','google'].map(provider => (
              <button
                key={provider}
                onClick={() => signIn(provider, { callbackUrl: '/dashboard' })}
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Add {provider[0].toUpperCase()+provider.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Facebook Pages list ────────────────── */}
      {hasFB ? (
        <div className="p-4 bg-white rounded shadow">
          <p className="mb-4 text-gray-800">
            We found {pages.length} Facebook Page{pages.length !== 1 ? 's' : ''} managed by you.
          </p>
          <ul className="space-y-3">
            {pages.map(p => (
              <li key={p.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={`https://graph.facebook.com/${p.id}/picture?access_token=${session.facebookAccessToken}`}
                    alt={p.name}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <span className="font-medium text-gray-900">{p.name}</span>
                </div>
                <button
                  onClick={() => onSwitchPage(p)}
                  disabled={currentPage?.id === p.id}
                  className={
                    `px-4 py-1 text-sm rounded ` +
                    (currentPage?.id === p.id
                      ? 'bg-gray-300 text-gray-700 cursor-default'
                      : 'bg-blue-600 text-white hover:bg-blue-700')
                  }
                >
                  {currentPage?.id === p.id ? 'Connected' : 'Connect'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <button
          onClick={() => signIn('facebook', { callbackUrl: '/dashboard' })}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Connect Facebook to pick page
        </button>
      )}
    </div>
  )
}
