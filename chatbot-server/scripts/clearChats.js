
const { MongoClient } = require('mongodb');
require('dotenv').config();

(async () => {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db('chatbotDB');
    await db.collection('chats').deleteMany({});
    console.log('✅ All chat messages cleared.');
  } finally {
    await client.close();
  }
})();
