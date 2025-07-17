// File: pages/api/pages.js
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) return res.status(401).end()

  const fbAcct = session.user.accounts.find(a => a.provider === 'facebook')
  if (!fbAcct) return res.status(400).json({ error: 'No Facebook account linked' })

  const fbRes  = await fetch(
    `https://graph.facebook.com/v16.0/me/accounts?access_token=${fbAcct.accessToken}`
  )
  const fbJson = await fbRes.json()

  // Map to only the fields we need
  const pages = (fbJson.data || []).map(p => ({
    id:          p.id,
    name:        p.name,
    avatar:      p.picture?.data?.url ?? null,
    accessToken: p.access_token         // long‐lived page token
  }))

  res.status(200).json(pages)
}
