// pages/api/register.js
import { MongoClient } from 'mongodb'
import bcrypt from 'bcrypt'

const client = new MongoClient(process.env.MONGODB_URI)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { fullName, username, email, password } = req.body
  await client.connect()
  const db = client.db()

  // check for existing user
  const existing = await db.collection('users').findOne({
    $or: [{ email }, { username }]
  })
  if (existing) {
    return res.status(409).json({ message: 'Email or username already in use' })
  }

  // hash the password
  const hash = await bcrypt.hash(password, 10)

  // insert the user
  await db.collection('users').insertOne({
    fullName,
    username,
    email,
    password: hash,
    role: 'user',
    createdAt: new Date()
  })

  return res.status(201).json({ message: 'User created' })
}
