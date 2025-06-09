// pages/api/logs.js
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const coll = db.collection("logs");

  if (req.method === "GET") {
    // return most recent 50 logs
    const logs = await coll
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();

    return res.status(200).json(
      logs.map(l => ({
        timestamp: l.timestamp,
        message: l.message,
      }))
    );
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
