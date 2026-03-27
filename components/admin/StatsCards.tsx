'use client';

import { CalendarCheck, BarChart3, DollarSign, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from "react";

interface StatsData {
  totalBookings: number;
  totalRooms: number;
  activeGuests: number;
  revenue: string;
  occupancyRate: string;
}

interface StatCard {
  title: string;
  value: string | number;
  icon: any;
  description: string;
}

export default function StatsCards() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data = await response.json();
        const statsData: StatsData = data.stats;

        const formattedStats: StatCard[] = [
          {
            title: "Total Bookings",
            value: statsData.totalBookings,
            icon: CalendarCheck,
            description: "total bookings",
          },
          {
            title: "Occupancy Rate",
            value: statsData.occupancyRate,
            icon: BarChart3,
            description: "current rate",
          },
          {
            title: "Total Revenue",
            value: `$${parseFloat(statsData.revenue).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: DollarSign,
            description: "total earned",
          },
          {
            title: "Active Guests",
            value: statsData.activeGuests,
            icon: Users,
            description: "checked in",
          },
        ];

        setStats(formattedStats);
        setError(null);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6 animate-pulse"
          >
            <div className="h-6 bg-slate-700 rounded mb-4 w-3/4"></div>
            <div className="h-10 bg-slate-700 rounded mb-3 w-1/2"></div>
            <div className="h-4 bg-slate-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group relative bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6 
                       hover:border-amber-500/30 transition-all duration-300
                       hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-400">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  {stat.description}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 group-hover:bg-amber-500/10 transition-colors duration-300">
                <Icon className="w-6 h-6 text-slate-400 group-hover:text-amber-500 transition-colors duration-300" />
              </div>
            </div>
            {/* Subtle bottom accent line */}
            <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        );
      })}
    </div>
  );
}
