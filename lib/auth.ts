import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail, verifyPassword } from "./auth-utils";
import { db } from "@/db";
import { signInSchema } from "./zod";
import { accounts, verificationTokens } from "@/db/schema";
import { sessions } from "@/db/schema";
import { users } from "@/db/schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Validate the credentials with Zod
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          // Get user from database
          const user = await getUserByEmail(email);

          if (!user || !user.password) {
            return null;
          }

          // Verify password
          const isValid = await verifyPassword(password, user.password);

          if (!isValid) {
            return null;
          }

          // Return user object without password
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
