'use client';

import { motion } from 'framer-motion';
import { Bell, Check, AlertTriangle, Info, UserPlus, CreditCard, Calendar, X } from 'lucide-react';

const notifications = [
  { id: 1, type: 'booking', icon: Calendar, title: 'New Booking Received', message: 'James Wilson booked Suite 201 for Mar 25-28', time: '5 min ago', read: false },
  { id: 2, type: 'payment', icon: CreditCard, title: 'Payment Confirmed', message: 'Payment of $1,200 received from James Wilson', time: '12 min ago', read: false },
  { id: 3, type: 'guest', icon: UserPlus, title: 'Guest Check-in', message: 'Emily Davis checked into Penthouse 501', time: '1 hour ago', read: false },
  { id: 4, type: 'alert', icon: AlertTriangle, title: 'Maintenance Required', message: 'Room 102 reported AC malfunction', time: '2 hours ago', read: true },
  { id: 5, type: 'info', icon: Info, title: 'System Update', message: 'New booking system module is available for installation', time: '3 hours ago', read: true },
  { id: 6, type: 'booking', icon: Calendar, title: 'Booking Cancelled', message: 'Peter Garcia cancelled reservation for Standard 103', time: '4 hours ago', read: true },
  { id: 7, type: 'payment', icon: CreditCard, title: 'Payment Overdue', message: 'Invoice INV-2843 for Michael Park is 2 days overdue', time: '5 hours ago', read: true },
  { id: 8, type: 'guest', icon: UserPlus, title: 'Guest Check-out', message: 'Lisa Thompson checked out from Deluxe 210', time: '6 hours ago', read: true },
];

const typeColors: Record<string, string> = {
  booking: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  payment: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  guest: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  alert: 'text-red-400 bg-red-500/10 border-red-500/20',
  info: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
};

export default function Notifications() {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Notifications</h2>
          <p className="text-sm text-slate-400 mt-1">
            You have <span className="text-amber-400 font-medium">{unreadCount} unread</span> notifications
          </p>
        </div>
        <button className="flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400 font-medium transition-colors duration-200">
          <Check className="w-4 h-4" /> Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif, i) => {
          const Icon = notif.icon;
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`group flex items-start gap-4 bg-slate-900/80 border rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.06)] cursor-pointer ${
                notif.read
                  ? 'border-slate-800/60 hover:border-slate-700'
                  : 'border-amber-500/20 hover:border-amber-500/40 bg-amber-500/[0.02]'
              }`}
            >
              <div className={`p-2.5 rounded-xl border ${typeColors[notif.type]} flex-shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`text-sm font-semibold ${notif.read ? 'text-slate-300' : 'text-white'}`}>
                      {notif.title}
                      {!notif.read && (
                        <span className="ml-2 inline-block w-2 h-2 rounded-full bg-amber-500" />
                      )}
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5">{notif.message}</p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-slate-300 transition-all duration-200 flex-shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 mt-2">{notif.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
