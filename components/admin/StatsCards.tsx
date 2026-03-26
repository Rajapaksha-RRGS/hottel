'use client';

import { CalendarCheck, BarChart3, DollarSign, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  {
    title: 'Total Bookings',
    value: '2,847',
    change: '+12%',
    icon: CalendarCheck,
    description: 'from last month',
  },
  {
    title: 'Occupancy Rate',
    value: '87.4%',
    change: '+8%',
    icon: BarChart3,
    description: 'from last month',
  },
  {
    title: 'Total Revenue',
    value: '$384,520',
    change: '+15%',
    icon: DollarSign,
    description: 'from last month',
  },
  {
    title: 'Active Guests',
    value: '642',
    change: '+5%',
    icon: Users,
    description: 'from last month',
  },
];

export default function StatsCards() {


  
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
                <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                <p className="text-xs text-emerald-400 font-medium">
                  {stat.change}{' '}
                  <span className="text-slate-500">{stat.description}</span>
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
