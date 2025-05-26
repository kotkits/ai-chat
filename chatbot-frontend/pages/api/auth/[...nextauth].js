import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoClient } from "mongodb"
import bcrypt from "bcrypt"

const client = new MongoClient(process.env.MONGODB_URI)

export default NextAuth({
  session: {
    strategy: "jwt",        // use JSON Web Token sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { identifier, password } = credentials

        // 1) Admin shortcut
        if (
          identifier === process.env.ADMIN_USERNAME &&
          password === process.env.ADMIN_PASSWORD
        ) {
          return { id: "admin", name: "Administrator", role: "admin" }
        }

        // 2) User lookup
        await client.connect()
        const db = client.db()
        const user = await db.collection("users").findOne({
          $or: [{ email: identifier }, { username: identifier }]
        })
        if (!user) throw new Error("Invalid credentials")

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) throw new Error("Invalid credentials")

        // Return user object – NextAuth puts this into the JWT
        return { id: user._id.toString(), name: user.username, role: user.role || "user" }
      }
    })
  ],
  callbacks: {
    // Add `role` into the session object
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
    error: "/login" // display errors on the login page
  }
})
