import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import Gest from "@/models/Gest";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    // Google Provider (for guests)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),

    // Credentials Provider (for staff)
    CredentialsProvider({
      name: "Staff Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
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
            _id: user._id,
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error: any) {
          console.error("Auth error:", error.message, error.cause);
          throw new Error(error.message || "Authentication failed. Please check MongoDB connection.");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },

  debug: process.env.NODE_ENV === "development",

  callbacks: {
    async signIn({ user, account }) {
      // For Google sign-in, ensure guest record exists
      if (account?.provider === "google" && user.email) {
        try {
          await connectDB();
          let guest = await Gest.findOne({ email: user.email });

          if (!guest) {
            // Auto-create a guest record from Google profile
            guest = await Gest.create({
              name: user.name || "Guest",
              email: user.email,
              phone: "Not provided",
              message: "Signed up via Google",
              password: "google-oauth-no-password",
              image: user.image || "",
              isActive: true,
            });
          }
        } catch (error) {
          console.error("Error creating guest record:", error);
        }
      }
      return true;
    },

    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id;
        token.picture = user.image || null;

        // Determine role based on provider
        if (account?.provider === "google") {
          token.role = "Guest";
        } else {
          token.role = user.role || "User";
        }
      }
      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).id = token.id || token.sub;
        (session.user as any).role = token.role;
        (session.user as any).image = token.picture;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
