// pages/api/users/[id]/deactivate.js
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method !== 'POST') {
    res.setHeader('Allow',['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const client = await clientPromise;
  await client.db().collection('users').updateOne(
    { _id: new ObjectId(id) },
    { $set: { active: false } }
  );
  res.status(200).json({ message: 'User deactivated' });
}
