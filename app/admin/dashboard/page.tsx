'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/Auth/login');
      return;
    }

    if (session?.user?.role !== 'Admin') {
      router.push('/');
      return;
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-amber-500 animate-spin mx-auto mb-3"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'Admin') {
    return null;
  }

  return <AdminLayout />;
}
