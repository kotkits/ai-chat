// pages/api/settings/general/leave.js
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Ensure user is authenticated
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).end('Unauthorized');
  }

  // TODO: implement ownership transfer logic if needed
  // For now, simply respond success
  return res.status(200).json({ message: 'Leave request processed' });
}
