'use client';

import Link from "next/link";
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { signIn,getSession } from "next-auth/react";
import { connectDB } from "@/lib/mongoose";
import bcrypt from "bcryptjs";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentialsLogin = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,

      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Login failed. Check your email and password.");
      return;
    }

    // Login success nam, dan userge session eka fetch karanna role eka balaaganna
    const session = await getSession();
    const role = (session?.user as any)?.role; // Meeta kalin NextAuth config eke role eka setup karala thiyenna ona

    setLoading(false);
    console.log("User role:", role); // Role eka console log karanna

    // Role eka anuwa redirect kirima
    if (role === "Admin") {
      router.push("/admin/dashboard");
    } else if (role === "Waiter") {
      router.push("/waiter/dashboard");
    } else if (role === "Receptionist") {
      router.push("/receptionist/dashboard");
    } else {
      router.push("/");
      console.log("Default dashboard"); // Default dashboard
    }
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-cyan-50 px-4 py-12">
      <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
        <p className="mt-1 text-sm text-slate-600">
          Login to continue to your hotel dashboard.
        </p>

        <form onSubmit={handleCredentialsLogin} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-cyan-500 focus:ring"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-cyan-500 focus:ring"
              placeholder="********"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-600 px-4 py-2 font-medium text-white transition hover:bg-cyan-700 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-xs uppercase tracking-wide text-slate-500">
            Or
          </span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
        >
          Continue with Google
        </button>
      </section>
    </main>
  );
}
