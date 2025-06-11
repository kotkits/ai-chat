// pages/api/users/index.js
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow',['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const client = await clientPromise;
  const users = await client
    .db()
    .collection('users')
    .find({})
    .project({ fullName:1, email:1, active:1 })
    .toArray();

  return res.status(200).json({
    users: users.map(u => ({
      id:      u._id.toString(),
      name:    u.fullName,
      email:   u.email,
      isActive: u.active !== false,
    })),
  });
}
