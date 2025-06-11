// pages/api/contacts/bulk-delete.js
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow',['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const { ids, username } = req.body;
  const objectIds = ids.map(id => new ObjectId(id));
  const client = await clientPromise;
  await client.db()
    .collection('contacts')
    .deleteMany({ _id: { $in: objectIds }, username });
  res.status(200).json({ deleted: ids.length });
}
