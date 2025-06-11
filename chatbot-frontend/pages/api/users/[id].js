// pages/api/users/[id].js
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method !== 'PUT') {
    res.setHeader('Allow',['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const { name, email } = req.body;
  const client = await clientPromise;
  await client.db().collection('users').updateOne(
    { _id: new ObjectId(id) },
    { $set: { fullName: name, email } }
  );
  res.status(200).json({ message: 'User updated' });
}
