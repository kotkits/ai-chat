// pages/api/login.js
import { MongoClient } from 'mongodb'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Log env vars for debugging (remove in production)
console.log('ENV ADMIN_USERNAME:', process.env.ADMIN_USERNAME)
console.log('ENV ADMIN_EMAIL:', process.env.ADMIN_EMAIL)
console.log('ENV ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD)

const client = new MongoClient(process.env.MONGODB_URI)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  let { identifier, password } = req.body
  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: 'Identifier and password are required' })
  }

  // Normalize input
  identifier = identifier.trim().toLowerCase()
  password = password.trim()

  // 1. Check Env‐based admin login
  const envUsername = process.env.ADMIN_USERNAME?.trim().toLowerCase()
  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const envPassword = process.env.ADMIN_PASSWORD?.trim()

  if (envUsername && envEmail && envPassword) {
    if (
      (identifier === envUsername || identifier === envEmail) &&
      password === envPassword
    ) {
      // Create JWT payload for admin
      const tokenPayload = {
        id: 'admin-env-id',
        role: 'admin',
        name: 'Administrator',
        email: process.env.ADMIN_EMAIL,
        username: process.env.ADMIN_USERNAME,
      }

      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: '7d',
      })

      // Set HttpOnly cookie
      res.setHeader('Set-Cookie', [
        `token=${token}; Path=/; HttpOnly; Max-Age=${7 * 24 * 60 * 60};`,
      ])

      return res
        .status(200)
        .json({ message: 'Logged in as admin', role: 'admin' })
    }
    // If identifier matches but password didn’t, fall through to “invalid” below
  }

  // 2. Fallback: lookup in MongoDB
  try {
    await client.connect()
    const db = client.db()

    // Look up user by email OR username (both stored in lowercase)
    const user = await db.collection('users').findOne({
      $or: [{ email: identifier }, { username: identifier }],
    })

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Invalid email/username or password' })
    }

    // Compare password with bcrypt hash
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: 'Invalid email/username or password' })
    }

    // Create JWT payload
    const tokenPayload = {
      id: user._id.toString(),
      role: user.role || 'user',
      name: user.fullName,
      email: user.email,
      username: user.username,
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    // Set HttpOnly cookie
    res.setHeader('Set-Cookie', [
      `token=${token}; Path=/; HttpOnly; Max-Age=${7 * 24 * 60 * 60};`,
    ])

    return res.status(200).json({ message: 'Logged in', role: user.role })
  } catch (error) {
    console.error('Login error:', error)
    return res
      .status(500)
      .json({ message: 'Internal server error' })
  } finally {
    await client.close()
  }
}
