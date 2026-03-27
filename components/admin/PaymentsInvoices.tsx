'use client';

import { motion } from 'framer-motion';
import { Search, Filter, Download, Eye, CreditCard, Receipt, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const invoices = [
  { id: 'INV-2847', guest: 'James Wilson', room: 'Suite 201', date: 'Mar 25, 2026', amount: 1200, status: 'Paid', method: 'Credit Card' },
  { id: 'INV-2846', guest: 'Sarah Johnson', room: 'Deluxe 405', date: 'Mar 26, 2026', amount: 980, status: 'Paid', method: 'Bank Transfer' },
  { id: 'INV-2845', guest: 'Robert Chen', room: 'Standard 112', date: 'Mar 27, 2026', amount: 450, status: 'Pending', method: 'Credit Card' },
  { id: 'INV-2844', guest: 'Emily Davis', room: 'Penthouse 501', date: 'Mar 26, 2026', amount: 3500, status: 'Paid', method: 'Credit Card' },
  { id: 'INV-2843', guest: 'Michael Park', room: 'Suite 305', date: 'Mar 28, 2026', amount: 1650, status: 'Overdue', method: 'Bank Transfer' },
  { id: 'INV-2842', guest: 'Lisa Thompson', room: 'Deluxe 210', date: 'Mar 24, 2026', amount: 720, status: 'Paid', method: 'Cash' },
];

const statusColors: Record<string, string> = {
  Paid: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Overdue: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const summaryCards = [
  { title: 'Total Revenue', value: '$384,520', change: '+15.2%', up: true, icon: CreditCard },
  { title: 'Pending Payments', value: '$12,450', change: '-3.1%', up: false, icon: Receipt },
  { title: 'Overdue Invoices', value: '3', change: '+1', up: true, icon: Receipt },
];

export default function PaymentsInvoices() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Payments & Invoices</h2>
          <p className="text-sm text-slate-400 mt-1">Manage billing and financial transactions</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900/80 border border-slate-800/60 rounded-xl px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:border-slate-700 transition-all duration-200">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="bg-slate-900/80 border border-slate-800/60 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-slate-800/60"><Icon className="w-4 h-4 text-slate-400" /></div>
                <span className={`flex items-center gap-1 text-xs font-medium ${card.up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {card.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{card.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-xs text-slate-500 mt-1">{card.title}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search invoices..." className="w-full bg-slate-900/80 border border-slate-800/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200" />
        </div>
        <button className="flex items-center gap-2 bg-slate-900/80 border border-slate-800/60 rounded-xl px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:border-slate-700 transition-all duration-200">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-slate-900/80 border border-slate-800/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/80">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider p-4">Invoice</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider p-4">Guest</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider p-4">Room</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider p-4">Date</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider p-4">Method</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider p-4">Status</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider p-4">Amount</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {invoices.map((inv) => (
                <tr key={inv.id} className="group hover:bg-amber-500/[0.03] transition-colors duration-200">
                  <td className="p-4 text-sm font-medium text-amber-400">{inv.id}</td>
                  <td className="p-4 text-sm text-slate-300">{inv.guest}</td>
                  <td className="p-4 text-sm text-slate-400">{inv.room}</td>
                  <td className="p-4 text-sm text-slate-400">{inv.date}</td>
                  <td className="p-4 text-sm text-slate-400">{inv.method}</td>
                  <td className="p-4"><span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${statusColors[inv.status]}`}>{inv.status}</span></td>
                  <td className="p-4 text-right text-sm font-semibold text-white">${inv.amount.toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <button className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-amber-400 transition-all duration-200"><Eye className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
