// File: pages/api/conversations.js
import { getSession } from 'next-auth/react'
import clientPromise   from '../../lib/mongodb'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) return res.status(401).end()

  const { pageId } = req.query
  const db = (await clientPromise).db()
  const convos = await db
    .collection('conversations')
    .find({ pageId })
    .sort({ lastTime: -1 })
    .toArray()

  res.status(200).json(convos)
}
