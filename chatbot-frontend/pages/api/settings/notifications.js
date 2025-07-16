import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const coll = db.collection('settings');
  const namespace = 'notifications';

  if (req.method === 'GET') {
    const doc = await coll.findOne({ namespace });
    const defaults = {
      liveChatDesktop: {
        newMessageAssigned: false,
        newConversationUnassigned: false,
        conversationAssigned: false,
      },
      liveChatChannel: {
        conversationAssigned: false,
      },
    };
    return res.status(200).json(doc?.payload || defaults);
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
