import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        Email: { label: "Email", type: "text" },
        Password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        if (
          !credentials ||
          typeof credentials.Email !== "string" ||
          typeof credentials.Password !== "string"
        ) {
          return null;
        }

        // Use Prisma to find the admin by their email
        const admin = await prisma.admin.findUnique({
          where: { Email: credentials.Email },
        });

        console.log(admin);

        // If the admin exists and their password is correct, return the admin
        if (admin && bcrypt.compareSync(credentials.Password, admin.Password)) {
          // The passwords match, return the admin
          return {
            id: admin.ID.toString(),
            name: admin.Name,
            email: admin.Email,
          };
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
      if (!token.email) {
        throw new Error("Email is undefined in the JWT token");
      }

      const dbAdmin = await prisma.admin.findFirst({
        where: {
          Email: token.email,
        },
      });

      if (!dbAdmin) {
        token.ID = user!.id;
        return token;
      }

      return {
        id: dbAdmin.ID.toString(),
        name: dbAdmin.Name,
        email: dbAdmin.Email,
      };
    },
    redirect() {
      return "/dashboard";
    },
  },
});
