import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const { accountId } = req.query;
  const client = await clientPromise;
  const coll = client.db().collection('teamMembers');

  if (req.method === 'GET') {
    const members = await coll.find({ accountId }).toArray();
    return res.status(200).json({ members });
  }

  if (req.method === 'POST') {
    const { email, role } = req.body;
    await coll.insertOne({ accountId, email, role, seat: false, billing: false, convLimit: 0, updatedAt: new Date() });
    return res.status(201).json({ message: 'Member invited' });
  }

  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end();
}
