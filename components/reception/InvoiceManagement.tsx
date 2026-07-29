'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import InvoiceList from './invoice/InvoiceList';
import InvoiceDetail from './invoice/InvoiceDetail';
import { InvoiceData, StatusFilter, TypeFilter } from './invoice/types';

export default function InvoiceManagement() {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [filtered, setFiltered] = useState<InvoiceData[]>([]);
  const [selected, setSelected] = useState<InvoiceData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Pending');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const params = new URLSearchParams({ status: statusFilter, type: typeFilter });
      const res = await fetch(`/api/invoices?${params}`);
      if (!res.ok) throw new Error('Failed to fetch invoices');
      const data = await res.json();
      setInvoices(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  useEffect(() => {
    if (!searchTerm.trim()) { setFiltered(invoices); return; }
    const q = searchTerm.toLowerCase();
    setFiltered(invoices.filter(inv =>
      inv.guestName.toLowerCase().includes(q) ||
      inv.roomNumber?.toLowerCase().includes(q) ||
      inv.tableNumber?.toLowerCase().includes(q) ||
      inv.guestId.toLowerCase().includes(q)
    ));
  }, [searchTerm, invoices]);

  const handleStatusFilter = (v: StatusFilter) => {
    setStatusFilter(v);
    setSelected(null);
  };

  const handleTypeFilter = (v: TypeFilter) => {
    setTypeFilter(v);
    setSelected(null);
  };

  const updatePayment = async (guestId: string, newStatus: 'Paid' | 'Pending', guestType: 'Room' | 'External') => {
    try {
      setUpdatingId(guestId);
      const res = await fetch('/api/invoices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId, paymentStatus: newStatus, guestType }),
      });
      if (!res.ok) throw new Error('Failed to update payment status');

      // Optimistic update
      const update = (list: InvoiceData[]) =>
        list.map(inv => inv.guestId === guestId ? { ...inv, paymentStatus: newStatus } : inv);
      setInvoices(update);
      setFiltered(update);
      if (selected?.guestId === guestId) {
        setSelected(prev => prev ? { ...prev, paymentStatus: newStatus } : null);
      }

      // Re-fetch after a moment to sync real server state
      setTimeout(fetchInvoices, 600);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="h-full w-full flex gap-5">
      {/* Left: Invoice List */}
      <InvoiceList
        invoices={filtered}
        selectedId={selected?._id || null}
        onSelect={setSelected}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilter={handleStatusFilter}
        typeFilter={typeFilter}
        onTypeFilter={handleTypeFilter}
        isLoading={isLoading}
        error={error}
        onRetry={fetchInvoices}
      />

      {/* Right: Invoice Detail */}
      <AnimatePresence mode="wait">
        {selected ? (
          <InvoiceDetail
            key={selected._id}
            invoice={selected}
            updatingId={updatingId}
            onUpdatePayment={updatePayment}
          />
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-[500px] flex-shrink-0 flex items-center justify-center bg-gradient-to-b from-luxury-card to-slate-900/50 rounded-2xl border border-slate-700/50"
          >
            <div className="text-center px-8">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-400 text-sm font-medium">Select an invoice</p>
              <p className="text-slate-600 text-xs mt-1">Click any invoice to view details and take action</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
