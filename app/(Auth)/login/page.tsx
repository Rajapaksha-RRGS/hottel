'use client';

import { useState } from 'react';
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentialsLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Login failed. Check your email and password.");
        setLoading(false);
        return;
      }

      if (!result?.ok) {
        setError("An unexpected error occurred. Please try again.");
        setLoading(false);
        return;
      }

      const session = await getSession();
      const role = (session?.user as any)?.role;

      if (role === "Admin") {
        router.push("/admin/dashboard");
      } else if (role === "Waiter") {
        router.push("/waiter/dashboard");
      } else if (role === "Receptionist") {
        router.push("/DashboardResiption");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch (err: any) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please check your connection.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "http://localhost:3000/" });
  };

  // Base input styles to match the neon photo look
  const inputStyles = "w-full rounded-md border border-cyan-400 bg-black/40 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-200 focus:ring-1 focus:ring-cyan-200";

  return (
    <main 
      className="flex min-h-screen items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('https://res.cloudinary.com/djvxlhojn/image/upload/v1778144650/tourshero_q63mvv.jpg')` }}
    >
      {/* Dark overlay for the main background to match photo */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Main Glass Container */}
      <div className="relative z-10 flex w-full max-w-[900px] overflow-hidden rounded-2xl bg-[#0F172A]/80 shadow-2xl backdrop-blur-xl border border-slate-700/50">
        
        {/* Column 1: Image Section with branding (Matches Photo Left) */}
        <div className="hidden md:block w-1/2 relative overflow-hidden">
          <img 
            src="https://res.cloudinary.com/djvxlhojn/image/upload/v1778144650/tourshero_q63mvv.jpg" 
            alt="Hotel" 
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Branding Overlay */}
          <div className="absolute inset-0 bg-black/30 p-10 flex flex-col justify-start">
            <h2 className="text-5xl font-bold tracking-tight text-white">VITAMIN C</h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-200 opacity-90">Authentic Sri Lankan Hospitality</p>
          </div>
        </div>

        {/* Column 2: Translucent Form Details (Matches Photo Right) */}
        <div className="w-full p-10 md:w-1/2 md:p-14 lg:p-16 flex flex-col justify-center">
          
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h1>
            <p className="mt-2 text-sm text-slate-300">
              Login to continue to your hotel dashboard.
            </p>
          </div>

          <form onSubmit={handleCredentialsLogin} className="space-y-6">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-100">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputStyles}
                placeholder="johndoe@email.com"
              />
            </div>

            <div className="relative">
              <label className="mb-1.5 block text-xs font-medium text-slate-100">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputStyles}
                placeholder="••••••••"
              />
              {/* Eye icon matches photo placement */}
              <button type="button" className="absolute right-3 top-8 text-slate-500 hover:text-cyan-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </button>
            </div>

            {error && (
              <p className="rounded border border-red-500/50 bg-red-950/50 p-2.5 text-xs text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-cyan-400 py-3 text-sm font-bold text-black shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-300 active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Symmetrical Divider matching photo */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-600"></span>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0F172A] px-3 text-slate-400">Or continue with</span>
            </div>
          </div>

          {/* Clean Google button matching photo */}
          <button
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-md bg-white py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 active:scale-[0.99]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          
          <p className="mt-12 text-center text-xs text-slate-500">Connecting you to unforgettable experiences.</p>
        </div>
      </div>
    </main>
  );
}