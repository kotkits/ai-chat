// File: components/DashboardLayout.jsx
import React, { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import Sidebar from './Sidebar'

export default function DashboardLayout({ menuItems, children }) {
  const { data: session, status } = useSession()

  // 1) Keep track of all linked OAuth accounts
  const [accounts, setAccounts] = useState([])
  const [currentAccount, setCurrentAccount] = useState(null)

  // 2) Pages for the selected Facebook account
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState(null)

  // 3) Which sidebar menu is active
  const [selected, setSelected] = useState(menuItems[0]?.key)

  // On sign-in, load session.user.accounts into state
  useEffect(() => {
    if (status === 'authenticated' && session.user.accounts) {
      const accs = session.user.accounts || []
      setAccounts(accs)
      // Prefer Facebook if it’s linked, otherwise fall back to the first
      const fb = accs.find(a => a.provider === 'facebook')
      setCurrentAccount(fb ?? accs[0] ?? null)
    }
    if (status === 'unauthenticated') {
      signIn() // redirect to login if not signed in
    }
  }, [session, status])

  // Whenever the currentAccount changes, if it's Facebook, fetch its Pages
  useEffect(() => {
    if (currentAccount?.provider === 'facebook') {
      fetch(
        `/api/pages?provider=facebook&accountId=${currentAccount.id}`
      )
        .then(res => res.json())
        .then(list => {
          setPages(list)
          setCurrentPage(list[0] || null)
        })
        .catch(console.error)
    }
  }, [currentAccount])

  return (
    <div className="flex h-screen">
      <Sidebar
        menuItems={menuItems}
        selected={selected}
        onSelect={setSelected}
        // Account & page switcher props:
        accounts={accounts}
        currentAccount={currentAccount}
        onSwitchAccount={setCurrentAccount}
        pages={pages}
        currentPage={currentPage}
        onSwitchPage={setCurrentPage}
      />
      <main className="flex-1 p-6 overflow-auto">
        {typeof children === 'function'
          ? children(selected, setSelected, currentPage)
          : children}
      </main>
    </div>
  )
}
