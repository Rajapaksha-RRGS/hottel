import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    // Google Provider (for guests)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // Credentials Provider (for staff)
    CredentialsProvider({
      name: "Staff Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        // Find user by email
        const user = await User.findOne({ email: credentials?.email }).select(
          "+password",
        );

        if (!user) {
          throw new Error("Invalid Email or Password");
        }

        // Check if password exists
        if (!user.password) {
          throw new Error("Password not set");
        }

        // Compare passwords
        const isPasswordCorrect = await bcrypt.compare(
          credentials!.password,
          user.password,
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid Email or Password");
        }

        // Return user with role
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role, // Admin/Waiter/Receptionist/Manager
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "User";
        token.picture = user.image || null;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).image = token.picture;
      }
      return session;
    },
  },

  pages: {
    signIn: "/Auth/login",
  },
};
