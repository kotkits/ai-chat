// pages/api/conversations.js
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow',['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const { username } = req.query;
  const client = await clientPromise;
  const coll = client.db().collection('conversations');
  const filter = username ? { owner: username } : {};
  const convs = await coll.find(filter).toArray();
  // serialize _id
  const out = convs.map(c => ({
    ...c,
    _id: c._id.toString()
  }));
  res.status(200).json(out);
}
