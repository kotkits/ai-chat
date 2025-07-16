// File: pages/api/webhook.js

import clientPromise from '../../lib/mongodb'

export default async function handler(req, res) {
  const VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN

  // 1) Verification handshake
  if (req.method === 'GET') {
    const mode      = req.query['hub.mode']
    const token     = req.query['hub.verify_token']
    const challenge = req.query['hub.challenge']

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Let Facebook know this is your endpoint
      return res.status(200).send(challenge)
    } else {
      return res.status(403).send('❌ Invalid verify token')
    }
  }

  // 2) Incoming events
  if (req.method === 'POST') {
    const body = req.body

    // Only handle Page subscriptions
    if (body.object === 'page') {
      const db    = (await clientPromise).db()
      const convs = db.collection('conversations')

      for (const entry of body.entry) {
        const pageId = entry.id

        for (const msgEvent of entry.messaging) {
          const senderId = msgEvent.sender.id
          const ts       = new Date(msgEvent.timestamp)

          if (msgEvent.message?.text) {
            await convs.insertOne({
              pageId,
              senderId,
              text:      msgEvent.message.text,
              timestamp: ts,
              from:      'user'
            })
          }

          if (msgEvent.postback?.payload) {
            await convs.insertOne({
              pageId,
              senderId,
              text:      msgEvent.postback.payload,
              timestamp: ts,
              from:      'postback'
            })
          }
        }
      }

      // Respond 200 to acknowledge receipt
      return res.status(200).send('EVENT_RECEIVED')
    }

    // Not a page event
    return res.status(404).end()
  }

  // Reject other methods
  res.setHeader('Allow', ['GET','POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
