// File: pages/api/auth/[...nextauth].js

import NextAuth from 'next-auth'
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider   from 'next-auth/providers/google'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise      from '../../../lib/mongodb'

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  secret:  process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/login',
    error:  '/login'
  },

  providers: [
    FacebookProvider({
      clientId:     process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      authorization: {
        // only ask for exactly what we need:
        params: { scope: 'email,public_profile,pages_show_list' }
      }
    }),
    GoogleProvider({
      clientId:     process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: { params: { prompt: 'select_account' } }
    })
  ],

  callbacks: {
    // 1) On first sign in, stash the user ID into token.sub
    async jwt({ token, user, account }) {
      if (user && user.id) {
        token.sub = user.id
      }
      // Capture the raw Facebook access token once
      if (account?.provider === 'facebook') {
        token.facebookAccessToken = account.access_token
      }
      return token
    },

    // 2) Every session request, attach sub + fb token safely
    async session({ session, token }) {
      // ensure session and session.user exist
      session = session || {}
      session.user = session.user || {}

      // copy over our saved ID
      if (token?.sub) {
        session.user.id = token.sub
      }
      // expose Facebook token (or null)
      session.facebookAccessToken = token?.facebookAccessToken ?? null

      return session
    }
  }
})
