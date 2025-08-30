import NextAuth from 'next-auth'
import KeycloakProvider from 'next-auth/providers/keycloak'

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID ?? '',
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? '',
      issuer: process.env.KEYCLOAK_ISSUER,
      authorization: { params: { prompt: 'login' } },
    }),
  ],
  callbacks: {
    
    // async redirect({ url, baseUrl }) {
    //   console.log('Redirecting to:', url)
    //   return "http://localhost/";
    // },

    
    // for keep jwt token
    async jwt({ token, account }) {
      if (account) {
        console.log('account : ', account)
        token.accessToken = account.access_token
        token.userId = account.providerAccountId
      }
      return token
    },

    // get session data from jwt token
    async session({ session, token }) {
      console.log('token -------->',token)
      session.accessToken = token.accessToken
      session.userId = token.userId
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }
