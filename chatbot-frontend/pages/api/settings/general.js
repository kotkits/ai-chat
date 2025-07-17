// pages/api/settings/general.js
import clientPromise from '../../../lib/mongodb'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  // Ensure we only import clientPromise once
  const client = await clientPromise
  const db = client.db()
  const coll = db.collection('settings')
  const namespace = 'general'

  // Fetch the current user session if needed
  const session = await getSession({ req })

  if (req.method === 'GET') {
    // Return the existing settings or defaults
    const doc = await coll.findOne({ namespace })
    const defaults = {
      botName: '',
      language: 'en',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      defaultReply: '',
      retentionDays: 30
    }
    return res.status(200).json(doc?.payload || defaults)
  }

  if (req.method === 'PUT') {
    // Update (or insert) the general settings payload
    const payload = req.body
    await coll.updateOne(
      { namespace },
      { $set: { payload, updatedAt: new Date() } },
      { upsert: true }
    )
    return res.status(200).json({ message: 'General settings saved' })
  }

  if (req.method === 'DELETE') {
    // Only allow logged-in users to delete their account
    if (!session) {
      return res.status(401).end('Unauthorized')
    }

    // TODO: remove user record from your users collection
    // await db.collection('users').deleteOne({ email: session.user.email })

    // Then clear out the settings
    await coll.deleteOne({ namespace })
    return res.status(200).json({ message: 'Account deleted' })
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
