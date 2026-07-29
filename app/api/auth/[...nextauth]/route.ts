import NextAuth, { type NextAuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// Ensure NEXTAUTH_URL is set for production
if (process.env.NODE_ENV === "production") {
  if (!process.env.NEXTAUTH_URL) {
    console.warn(
      "NEXTAUTH_URL is not set. This may cause authentication issues in production."
    );
  }
}