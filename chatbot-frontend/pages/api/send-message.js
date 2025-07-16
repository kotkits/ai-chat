// File: pages/api/send-message.js
import clientPromise from '../../lib/mongodb'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end()
  }

  const { pageId, recipientId, message } = req.body
  if (!pageId || !recipientId || !message) {
    return res.status(400).json({ error: 'Missing parameters' })
  }

  // Look up that page’s access token
  const db   = (await clientPromise).db()
  const page = await db.collection('pages').findOne({ id: pageId })
  if (!page?.accessToken) {
    return res.status(400).json({ error: 'No page access token found' })
  }

  // Send via Graph API
  const resp = await fetch(
    `https://graph.facebook.com/v16.0/me/messages?access_token=${page.accessToken}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message:   { text: message }
      })
    }
  )
  if (!resp.ok) {
    const err = await resp.text()
    return res.status(500).json({ error: err })
  }

  res.status(200).json({ success: true })
}
