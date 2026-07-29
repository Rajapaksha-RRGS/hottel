'use client';

import React from 'react';
import { Search, Check, Clock, BedDouble, Utensils, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { InvoiceData, StatusFilter, TypeFilter } from './types';

interface Props {
  invoices: InvoiceData[];
  selectedId: string | null;
  onSelect: (inv: InvoiceData) => void;
  searchTerm: string;
  onSearch: (v: string) => void;
  statusFilter: StatusFilter;
  onStatusFilter: (v: StatusFilter) => void;
  typeFilter: TypeFilter;
  onTypeFilter: (v: TypeFilter) => void;
  isLoading: boolean;
  error: string;
  onRetry: () => void;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export default function InvoiceList({
  invoices, selectedId, onSelect,
  searchTerm, onSearch,
  statusFilter, onStatusFilter,
  typeFilter, onTypeFilter,
  isLoading, error, onRetry,
}: Props) {
  const statusTabs: StatusFilter[] = ['Pending', 'Paid', 'All'];
  const typeTabs: { value: TypeFilter; label: string }[] = [
    { value: 'All', label: 'All' },
    { value: 'Room', label: 'Room Guests' },
    { value: 'External', label: 'Table Orders' },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-luxury-gold/20 flex items-center justify-center">
            <span className="text-luxury-gold text-sm">$</span>
          </span>
          Invoice Management
        </h3>

        {/* Status Tabs */}
        <div className="flex gap-1 p-1 bg-slate-800/60 rounded-xl mb-3">
          {statusTabs.map(tab => (
            <button
              key={tab}
              onClick={() => onStatusFilter(tab)}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                statusFilter === tab
                  ? 'bg-light-accentBlue text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Type Tabs */}
        <div className="flex gap-1 p-1 bg-slate-800/40 rounded-xl mb-3">
          {typeTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => onTypeFilter(tab.value)}
              className={`flex-1 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                typeFilter === tab.value
                  ? 'bg-slate-600 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search guest, room, table..."
            value={searchTerm}
            onChange={e => onSearch(e.target.value)}
            className="w-full bg-luxury-dark border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-light-accentBlue transition-all"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <RefreshCw className="w-6 h-6 text-slate-500 animate-spin" />
            <p className="text-slate-400 text-sm">Loading invoices...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={onRetry}
              className="mt-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 text-xs transition-colors"
            >
              Retry
            </button>
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-slate-500 text-sm">
              {searchTerm ? 'No results found' : `No ${statusFilter !== 'All' ? statusFilter.toLowerCase() : ''} invoices`}
            </p>
          </div>
        ) : (
          invoices.map(inv => (
            <motion.button
              key={inv._id}
              onClick={() => onSelect(inv)}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: 3 }}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 border ${
                selectedId === inv._id
                  ? 'bg-light-accentBlue/15 border-light-accentBlue/40 shadow-[0_0_20px_rgba(0,80,179,0.12)]'
                  : 'bg-luxury-card border-slate-700/50 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    inv.guestType === 'Room' ? 'bg-blue-500/15 text-blue-400' : 'bg-orange-500/15 text-orange-400'
                  }`}>
                    {inv.guestType === 'Room' ? <BedDouble className="w-4 h-4" /> : <Utensils className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{inv.guestName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {inv.guestType === 'Room' ? `Room ${inv.roomNumber}` : `Table ${inv.tableNumber}`}
                      {inv.foodItems?.length > 0 && ` · ${inv.foodItems.length} items`}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-white text-sm">{formatCurrency(inv.grandTotal)}</p>
                  <div className={`flex items-center justify-end gap-1 text-xs mt-0.5 ${
                    inv.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {inv.paymentStatus === 'Paid'
                      ? <><Check className="w-3 h-3" /><span>Paid</span></>
                      : <><Clock className="w-3 h-3" /><span>Pending</span></>
                    }
                  </div>
                </div>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
}
