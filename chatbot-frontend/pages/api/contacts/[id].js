// pages/api/contacts/[id].js
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { id, username } = req.query;
  if (req.method !== 'DELETE') {
    res.setHeader('Allow',['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const client = await clientPromise;
  await client.db()
    .collection('contacts')
    .deleteOne({ _id: new ObjectId(id), username });
  res.status(200).json({ message: 'Contact deleted' });
}
