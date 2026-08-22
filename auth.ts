/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
interface User {
  id: string; 
  name: string;
  email: string;
}


export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true, // ✅ Add this line
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials: any): Promise<User | null> { 
        if (credentials === null) return null;

        try {
          const { email, password } = credentials;
          
          if (!email || !password) {
            throw new Error("Missing email or password");
          }
          // console.log("Credentials:", credentials); 
          // Fetch user by email from Prisma
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            throw new Error("User not found");
          }

          // Validate password using a secure hashing algorithm (replace with your implementation)
          const isValidPassword = password === user.password; // Replace with actual password hashing logic

          if (!isValidPassword) {
            throw new Error("Invalid password");
          }

          // Return user object if credentials are valid
          return {
            id: user.id.toString(), 
            name: user.userName, // Assuming 'userName' is the name field in your schema
            email: user.email,
          };
        } catch (error: any) {
          console.error(error);
          throw new Error("Error authenticating user");
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Attach the user id to the session object
      // Type assertion to ensure id is treated as string
      if (token && typeof token.id === "string") {
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      // When user is first signed in, add id to the token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});
