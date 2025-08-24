import NextAuth from 'next-auth'
import KeyclockProvider from 'next-auth/providers/keycloak'

const handler = NextAuth({
  providers: [
    KeyclockProvider({
      clientId: process.env.KEYCLOCK_CLIENT_ID ?? '',
      clientSecret: process.env.KEYCLOCK_CLIENT_SECRET ?? '',
      issuer: process.env.KEYCLOCK_ISSUER,
      authorization: { params: { prompt: 'login' } },
    }),
  ],
  callbacks: {
    async jwt({token, account}) {
      if (account) {
        console.log('account : ', account)
        token.accessToken = account.access_token
        token.userId = account.providerAccountId
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.userId = token.userId
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }
