import clientPromise from '../../../../lib/mongodb';

export default async function handler(req, res) {
  const { accountId, email } = req.query;
  const client = await clientPromise;
  const coll = client.db().collection('teamMembers');

  if (req.method === 'PUT') {
    const updates = req.body;
    await coll.updateOne({ accountId, email }, { $set: updates });
    return res.status(200).json({ message: 'Member updated' });
  }

  if (req.method === 'DELETE') {
    await coll.deleteOne({ accountId, email });
    return res.status(200).json({ message: 'Member removed' });
  }

  res.setHeader('Allow', ['PUT','DELETE']);
  res.status(405).end();
}
