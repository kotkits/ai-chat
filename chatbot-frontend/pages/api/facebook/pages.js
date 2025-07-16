// File: pages/api/facebook/pages.js

import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session?.user?.connectedPage?.token) {
    return res.status(401).json({ error: 'not_connected' })
  }
  // List *all* of their Pages again, if you need full list:
  const resp = await fetch(
    `https://graph.facebook.com/me/accounts?access_token=${session.user.connectedPage.token}`
  )
  const json = await resp.json()
  res.status(200).json({ pages: json.data || [] })
}
