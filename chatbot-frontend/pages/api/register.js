// pages/api/register.js
import clientPromise from '../../lib/mongodb';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { fullName, username, email, password } = req.body;
  if (!fullName || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    // Check for existing email
    const existing = await db.collection('users').findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      fullName,
      username,
      email,
      password:   hashedPassword,
      role:       'user',
      createdAt:  new Date(),
      channels:   [],
      subscription: 'Free'
    };

    await db.collection('users').insertOne(newUser);
    return res.status(201).json({ message: 'User created' });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
  