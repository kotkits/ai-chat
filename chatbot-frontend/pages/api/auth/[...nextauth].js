import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoClient } from "mongodb"
import bcrypt from "bcrypt"

// reuse a single MongoClient (no reconnect storm)
const clientPromise = new MongoClient(process.env.MONGODB_URI, {
  // (optional) you can pass options here
}).connect()

export default NextAuth({
  // ← be sure you have this in your .env.local
  secret: process.env.NEXTAUTH_SECRET,

  // session via JWT
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Username or Email", type: "text" },
        password:    { label: "Password",         type: "password" },
      },
      async authorize(credentials) {
        const { identifier, password } = credentials
        console.log("Credentials authorize() got:", { identifier })

        // 1) admin shortcut
        if (
          identifier === process.env.ADMIN_USERNAME &&
          password   === process.env.ADMIN_PASSWORD
        ) {
          return { id: "admin", name: "Administrator", role: "admin" }
        }

        // 2) look up user in MongoDB
        const client = await clientPromise
        const db = client.db()                  // uses default DB in your URI
        const user = await db.collection("users").findOne({
          $or: [
            { email:    identifier },
            { username: identifier }
          ]
        })

        if (!user) {
          console.log("→ no user found for", identifier)
          return null                // ← return null (not throw!), so NextAuth returns 401
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
          console.log("→ invalid password for", identifier)
          return null
        }

        // successful—NextAuth will issue the JWT
        return {
          id:   user._id.toString(),
          name: user.username,
          role: user.role || "user"
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role
      return session
    }
  },

  pages: {
    signIn: "/login",
    error:  "/login"   // errors (including invalid credentials) will redirect here
  }
})
