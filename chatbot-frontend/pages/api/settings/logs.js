// pages/api/settings/logs.js
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const coll = db.collection('logs');

  if (req.method === 'GET') {
    const logs = await coll
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();
    // Normalize to { time, message }
    return res.status(200).json({
      logs: logs.map(l => ({
        time: l.timestamp.toISOString(),
        message: l.message,
      })),
    });
  }

  if (req.method === 'DELETE') {
    await coll.deleteMany({});
    return res.status(200).json({ message: 'All logs cleared' });
  }

  res.setHeader('Allow', ['GET','DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
