const express = require("express");
const cors = require("cors");
const path = require("path");
const fetch = require('node-fetch');
const axios = require("axios");                  
const http = require("http");                   
const { Server } = require("socket.io");              

const { MongoClient } = require("mongodb");
require("dotenv").config();

const { AIAgent } = require('./enhanced-agent-code');
const aiAgent = new AIAgent();

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));


const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: "*" } });

const client = new MongoClient(process.env.MONGO_URI || "mongodb://localhost:27017");
let chatCollection;

client.connect()
    .then(() => {
        chatCollection = client.db("chatbotDB").collection("chats");
        console.log("✅ Connected to MongoDB");
    })
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });

    // ── after your existing imports & Mongo setup ────────────────────────────
// 1️⃣ List all conversations with their latest message
app.get("/conversations", async (req, res) => {
  const convs = await chatCollection.aggregate([
    { $unwind: "$messages" },
    { $sort: { "messages.timestamp": -1 } },
    { $group: {
        _id: "$sessionId",
        last: { $first: "$messages" }
    }},
    { $project: {
        sessionId: "$_id",
        _id: 0,
        senderName: "$last.senderName",
        avatarUrl:  "$last.avatarUrl",
        text:       "$last.message",
        timestamp:  "$last.timestamp"
    }},
    { $sort: { timestamp: -1 } }
  ]).toArray();
  res.json(convs);
});

// 2️⃣ Fetch all messages for a specific conversation
app.get("/conversations/:id/messages", async (req, res) => {
  const sessionId = req.params.id;

  // fetch just the messages array for this session
  const doc = await chatCollection.findOne(
    { sessionId },
    { projection: { _id: 0, messages: 1 } }
  );

  if (!doc) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  // sort oldest→newest, then map into the shape your front-end expects
  const msgs = doc.messages
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(m => ({
      sender:     m.sender,       // "user" or "bot"
      senderName: m.senderName,
      avatarUrl:  m.avatarUrl,
      text:       m.message,
      timestamp:  m.timestamp
    }));

  res.json(msgs);
});


async function fetchFbProfile(psid) {
    const res = await axios.get(
        `https://graph.facebook.com/${psid}`,
        {
            params: {
                fields: "first_name,last_name,profile_pic",
                access_token: process.env.PAGE_ACCESS_TOKEN
            }
        }
    );
    return {
        senderName: `${res.data.first_name} ${res.data.last_name}`,
        avatarUrl: res.data.profile_pic
    };
}

app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('✅ WEBHOOK_VERIFIED');
        return res.status(200).send(challenge);
    }
    res.sendStatus(403);
});


app.post("/webhook", async (req, res) => {
  if (req.body.object === "page") {
    for (const entry of req.body.entry) {
      for (const event of entry.messaging) {
        if (event.message && event.message.text) {
          const psid = event.sender.id;
          const text = event.message.text.trim();

          // 1) lookup sender profile
          const { senderName, avatarUrl } = await fetchFbProfile(psid);

          // 2) persist the USER message
          if (chatCollection) {
            await chatCollection.updateOne(
              { sessionId: psid },
              {
                $push: {
                  messages: {
                    sender:     "user",
                    senderName,
                    avatarUrl,
                    message:    text,
                    timestamp:  new Date()
                  }
                }
              },
              { upsert: true }
            );
          }

          // 3) broadcast the USER message
          io.emit("conversation_update", {
            sessionId:  psid,
            sender:     "user",
            senderName,
            avatarUrl,
            text,
            timestamp:  new Date()
          });

          // 4) run your AI agent & get the BOT reply
          let replyText;
          try {
            replyText = await aiAgent.processUserMessage(text);
          } catch (e) {
            console.error("❌ AI error:", e);
            replyText = "Sorry, I'm having trouble right now.";
          }

          // 5) persist the BOT message
          if (chatCollection) {
            await chatCollection.updateOne(
              { sessionId: psid },
              {
                $push: {
                  messages: {
                    sender:     "bot",
                    senderName: "Your Bot Name",           // set your bot’s display name
                    avatarUrl:  process.env.BOT_AVATAR_URL, // put your bot avatar URL in .env
                    message:    replyText,
                    timestamp:  new Date()
                  }
                }
              }
            );
          }

          // 6) broadcast the BOT message
          io.emit("conversation_update", {
            sessionId:  psid,
            sender:     "bot",
            senderName: "Your Bot Name",
            avatarUrl:  process.env.BOT_AVATAR_URL,
            text:       replyText,
            timestamp:  new Date()
          });

          // 7) send the reply over Messenger’s Send API
          await callSendAPI(psid, replyText);
        }
      }
    }
    return res.status(200).send("EVENT_RECEIVED");
  }
  res.sendStatus(404);
});



async function callSendAPI(psid, text) {
    const url = `https://graph.facebook.com/v15.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`;
    const MAX = 2000;
    // Break the text into chunks of ≤2000 chars
    for (let i = 0; i < text.length; i += MAX) {
        const chunk = text.slice(i, i + MAX);
        const body = {
            recipient: { id: psid },
            message: { text: chunk }
        };
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!resp.ok) {
            const err = await resp.text();
            console.error('❌ Send API error:', err);
            break;  // stop if one fails
        }
    }
}


app.post("/chat", async (req, res) => {
    const { message, sessionId } = req.body;
    try {
        // 1. Load or initialize this session’s history
        let session = await chatCollection.findOne({ sessionId });
        if (!session) {
            // create an empty session doc if none exists
            await chatCollection.insertOne({ sessionId, messages: [] });
            session = { sessionId, messages: [] };
        }

        // 2. Map stored messages → the shape Mistral expects
        aiAgent.chatHistory = session.messages.map(({ sender, message: msg }) => ({
            role: sender === "bot" ? "assistant" : "user",
            content: msg
        }));

        // 3. Now run your agent exactly as before
        const reply = await aiAgent.processUserMessage(message.toLowerCase());

        // 4. Persist both sides of the new turn
        if (chatCollection) {
            await chatCollection.updateOne(
                { sessionId },
                { $push: { messages: { sender: 'user', message, timestamp: new Date() } } }
            );
            await chatCollection.updateOne(
                { sessionId },
                { $push: { messages: { sender: 'bot', message: reply, timestamp: new Date() } } }
            );
        }

        // 5. Send it back
        res.json({ reply });

    } catch (e) {
        console.error(e);
        res.json({ reply: "⚠️ AI service is currently unavailable." });
    }
});

app.post("/clearChatHistory", async (req, res) => {
    const { sessionId } = req.body;
    try {
        await chatCollection.deleteMany({ sessionId });
        res.json({ message: "Chat history cleared" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Could not clear chat history" });
    }
});

// New: fetch last 200 messages for inbox
app.get("/messages", async (req, res) => {
    const msgs = await chatCollection
        .find({})                         // or filter by sessionId
        .sort({ "messages.timestamp": -1 })
        .limit(200)
        .toArray();
    // flatten: each doc has sessionId + messages[]
    const flat = msgs.flatMap(doc => doc.messages.map(m => ({
        platform: "messenger",
        userId: doc.sessionId,
        text: m.message,
        senderName: m.senderName,
        avatarUrl: m.avatarUrl,
        timestamp: m.timestamp
    })));
    res.json(flat);
});



app.get("/chat/history", async (req, res) => {
    try {
        if (!chatCollection) {
            return res.status(503).json({ error: "Database not connected" });
        }
        const chatHistory = await chatCollection.find().sort({ timestamp: 1 }).toArray();
        res.status(200).json(chatHistory);
    } catch (error) {
        console.error("❌ Error fetching history:", error);
        res.status(500).json({ error: "Could not fetch chat history" });
    }
});

app.post("/resetAgent", async (req, res) => {
    try {
        aiAgent.conversationContext = {};
        aiAgent.userProfile = {};

        console.log("✅ AI agent state reset successfully.");
        res.status(200).json({ message: "AI agent state reset successfully." });
    } catch (error) {
        console.error("❌ Error resetting AI agent:", error);
        res.status(500).json({ error: "Failed to reset AI agent state." });
    }
});


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html",));
});

app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


