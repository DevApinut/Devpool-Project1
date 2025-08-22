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
    async redirect({ url, baseUrl }) {
      // Force redirect ไปที่ localhost (nginx) แทน localhost:3000
      if (url.startsWith('/')) return `${process.env.NEXTAUTH_URL}${url}`
      if (url.startsWith(process.env.NEXTAUTH_URL || '')) return url
      return process.env.NEXTAUTH_URL || baseUrl
    },
    async jwt({token, account}) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
  // test
})

export { handler as GET, handler as POST }
