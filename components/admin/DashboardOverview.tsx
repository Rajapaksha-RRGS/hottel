'use client';

import StatsCards from '@/components/admin/StatsCards';
import RevenueChart from '@/components/admin/RevenueChart';
import OccupancyChart from '@/components/admin/OccupancyChart';
import RecentBookings from '@/components/admin/RecentBookings';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      

      {/* Stats Cards */}
      <StatsCards />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <OccupancyChart />
      </div>

      {/* Recent Bookings Table */}
      <RecentBookings />
    </div>
  );
}
