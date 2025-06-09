// pages/api/settings.js
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const coll = db.collection("settings");

  if (req.method === "GET") {
    const settings = await coll.findOne({}, { sort: { _id: -1 } });
    return res
      .status(200)
      .json(
        settings || {
          siteTitle: "",
          maintenanceMode: false,
          allowRegistrations: true,
        }
      );
  }

  if (req.method === "POST") {
    const { siteTitle, maintenanceMode, allowRegistrations } = req.body;
    await coll.updateOne(
      {},
      { $set: { siteTitle, maintenanceMode, allowRegistrations } },
      { upsert: true }
    );
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
