import NextAuth from "next-auth";
import apiClient from "./application/repository/axiosInstance";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "username" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/login/`,
            {
              username: credentials?.username,
              password: credentials?.password,
            },
          );
          return data;
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    //controls what gets stored in the NextAuth token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.user.id;
        token.email = user.user.email;
        token.username = user.user.username;
        token.isStaff = user.user.is_staff;
        token.token = user.token;
      }
      return token;
    },

    //controls what gets exposed to the client session
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.username = token.username;
      session.user.isStaff = token.isStaff;
      session.token = token.token;
      return session;
    },
  },
  pages: {
    signIn: "/login", // custom sign-in page
    error: "/auth/error",
    signOut: "/auth/signout",
  },
});
