import axios from 'axios'
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
    // for keep jwt token
    async jwt({ token, account }) {
      if (account) {
        console.log('account : ', account)
        token.accessToken = account.access_token
        token.userId = account.providerAccountId

        // เรียก API เพิ่ม user หลัง login สำเร็จ
        try {
          console.log('test')
          await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_PATH}/api/v1/users/`,{},
            {
              headers: {
                Authorization: `Bearer ${account.access_token}`,
                'Content-Type': 'application/json',
              },
            }
          )
        } catch (err) {
          console.error('Create user error:', err)
        }
      }
      return token
    },

    // get session data from jwt token
    async session({ session, token }) {
      // console.log('token -------->',token)
      session.accessToken = token.accessToken
      session.userId = token.userId
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
