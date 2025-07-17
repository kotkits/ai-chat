// File: pages/api/admin/settings.js

import { getSession } from 'next-auth/react'
import clientPromise  from '../../../lib/mongodb'
import { ObjectId }   from 'mongodb'

export default async function handler(req, res) {
  // 1) Auth check
  const session = await getSession({ req })
  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // 2) Connect to MongoDB
  const client = await clientPromise
  const db     = client.db()
  const col    = db.collection('teamMembers')

  // 3) Method routing
  switch (req.method) {
    case 'GET': {
      const teamMembers = await col.find({}).toArray()
      return res.status(200).json({ teamMembers })
    }
    case 'POST': {
      const { name, email, role } = req.body
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' })
      }
      const newMember = {
        name,
        email,
        role: role || 'member',
        createdAt: new Date()
      }
      const result = await col.insertOne(newMember)
      newMember._id = result.insertedId
      return res.status(201).json({ teamMember: newMember })
    }
    case 'DELETE': {
      const { id } = req.query
      if (!id) {
        return res.status(400).json({ error: 'ID is required' })
      }
      await col.deleteOne({ _id: new ObjectId(id) })
      return res.status(204).end()
    }
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
