import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ?? ""
    })
  ],
  callbacks: {
    async jwt({ token, account, user }) {

      if (account && user) {

        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth`, {
          email: user.email,
          name: user.name,
          provider: "Google"
        });

        const DbUser = response.data; //getting user fro database

        token.id = DbUser.id;
      }
      return token;
    },

    async session({ session, token }) {
      
      if (session?.user) {
        session.user.id = token.id as string; // Attach user ID from token to session
      }
      return session;
    },
  }
})

export { handler as GET, handler as POST }