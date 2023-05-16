import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (
          !credentials ||
          typeof credentials.username !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        // Use Prisma to find the admin by their email
        const admin = await prisma.admin.findUnique({
          where: { email: credentials.username },
        });

        // If the admin exists and their password is correct, return the admin
        if (admin && bcrypt.compareSync(credentials.password, admin.password)) {
          return { id: admin.id, name: admin.name, email: admin.email };
        } else {
          return null;
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
    async jwt({ token, user }) {
      const dbAdmin = await prisma.admin.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbAdmin) {
        token.id = user!.id;
        return token;
      }

      return {
        id: dbAdmin.id,
        name: dbAdmin.name,
        email: dbAdmin.email,
      };
    },
    redirect() {
      return "/dashboard";
    },
  },
};
