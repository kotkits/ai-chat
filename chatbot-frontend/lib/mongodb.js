// lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("mongodb+srv://user:pass@cluster0.mongodb.net/mydb?");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Use a global to preserve across module reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, don't use a global
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
