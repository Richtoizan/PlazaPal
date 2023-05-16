// import { NextAuthOptions } from "next-auth";
// import { db } from "@/lib/db";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// // import Providers from `next-auth/providers`

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(db),
//   session: {
//     strategy: "jwt",
//   },
//   pages: {
//     signIn: "/login",
//   },
//   providers: [
//     Providers.Credentials({
//         name: "Credentials",
//         credentials: {
//             username: { label: "Username", type: "text", placeholder: "jsmith" },
//             password: { label: "Password", type: "password" },
//         },
// };
