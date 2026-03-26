import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    // 1. Google Provider (අමුත්තන් සඳහා)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // 2. Credentials Provider (Staff සඳහා)
    CredentialsProvider({
      name: "Staff Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        // MongoDB එකේ user ඉන්නවද බලනවා
        const user = await User.findOne({ email: credentials?.email }).select(
          "+password",
        );

        if (!user) {
          throw new Error(
            "Invalid Email or Password no any user laike this email",
          );
        }

        // Password එක ඉන්නවද බලනවා
        if (!user.password) {
          throw new Error("not include   Password");
        }

        // Password එක සසඳනවා
        const isPasswordCorrect = await bcrypt.compare(
          credentials!.password,
          user.password,
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid Email or Password");
        }

        // සාර්ථක නම් දත්ත return කරනවා
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role, // Admin/Waiter/Receptionist
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        // Google එකෙන් එන අයට 'User' role එක දෙනවා, Credentials අයට DB එකේ තියෙන role එක දෙනවා
        token.role = (user as any).role || "User";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };