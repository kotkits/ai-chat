// File: pages/api/settings/notifications.js
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const namespace = 'notifications';
  const client = await clientPromise;
  const db = client.db();
  const coll = db.collection('settings');

  if (req.method === 'GET') {
    const doc = await coll.findOne({ namespace });
    const defaultPayload = { desktop: [], emailSms: [] };
    return res.status(200).json(doc?.payload || defaultPayload);
  }

  if (req.method === 'PUT') {
    const payload = req.body;
    await coll.updateOne(
      { namespace },
      { $set: { payload, updatedAt: new Date() } },
      { upsert: true }
    );
    return res.status(200).json({ message: 'Notifications settings saved' });
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
