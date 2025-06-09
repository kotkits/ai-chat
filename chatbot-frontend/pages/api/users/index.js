// pages/api/users/index.js
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const coll = db.collection("users");

  if (req.method === "GET") {
    const users = await coll.find({}).toArray();
    return res.status(200).json(
      users.map(u => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        active: u.active ?? true,
      }))
    );
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
