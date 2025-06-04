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
  if (!fullName || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    await client.connect()
    const db = client.db()

    // Check if email already exists
    const existingUser = await db.collection('users').findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' })
    }

    // Hash the password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Insert the new user (default role is "user")
    const newUser = {
      fullName,
      username,
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
      channels: [], // start with no connected channels
      subscription: 'Free',
    }

    await db.collection('users').insertOne(newUser)
    return res.status(201).json({ message: 'User created' })
  } catch (error) {
    console.error('Register error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  } finally {
    await client.close()
  }
}
