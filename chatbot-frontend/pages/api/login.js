// pages/api/login.js
import { MongoClient } from 'mongodb'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const client = new MongoClient(process.env.MONGODB_URI)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    await client.connect()
    const db = client.db()

    // 1. Look up the user by email
    const user = await db.collection('users').findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // 2. Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // 3. Create a JWT payload
    const tokenPayload = {
      id: user._id.toString(),
      role: user.role,
      name: user.fullName,
      email: user.email,
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    // 4. Set an HttpOnly cookie
    res.setHeader('Set-Cookie', [
      `token=${token}; Path=/; HttpOnly; Max-Age=${7 * 24 * 60 * 60};`,
    ])

    // 5. Return success + role so front-end can redirect appropriately
    return res.status(200).json({ message: 'Logged in', role: user.role })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  } finally {
    await client.close()
  }
}
