// pages/api/contacts.js
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const coll = client.db().collection('contacts');

  if (req.method === 'GET') {
    const { username } = req.query;
    const docs = await coll.find({ username }).toArray();
    return res.status(200).json(docs);
  }

  if (req.method === 'POST') {
    const contact = req.body;
    const result = await coll.insertOne(contact);
    return res.status(201).json({ ...contact, _id: result.insertedId.toString() });
  }

  res.setHeader('Allow',['GET','POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
