// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from '../../../lib/mongodb';
import bcrypt from 'bcrypt';

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Username or Email', type: 'text' },
        password:    { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { identifier, password } = credentials;

        // 1) Admin shortcut
        if (
          identifier === process.env.ADMIN_USERNAME &&
          password   === process.env.ADMIN_PASSWORD
        ) {
          return {
            id:    'admin-id',
            name:  'Administrator',
            email: process.env.ADMIN_EMAIL,
            role:  'admin'
          };
        }

        // 2) Lookup user in MongoDB
        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection('users').findOne({
          $or: [
            { email:    identifier },
            { username: identifier }
          ]
        });

        if (!user) return null;
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id:    user._id.toString(),
          name:  user.username,
          email: user.email,
          role:  user.role || 'user'
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id   = token.id;
      session.user.role = token.role;
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error:  '/login'
  }
});
