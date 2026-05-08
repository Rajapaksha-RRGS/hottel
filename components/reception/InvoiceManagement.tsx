'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, DollarSign, Check, Clock, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InvoiceData {
  _id: string;
  guestId: string;
  guestName: string;
  guestType: 'Room' | 'External';
  roomNumber?: string;
  tableNumber?: string;
  roomCharge: number;
  foodTotal: number;
  tourTotal: number;
  grandTotal: number;
  paymentStatus: 'Paid' | 'Pending';
  bookingStatus?: string;
  lastUpdated: Date;
}

export default function InvoiceManagement() {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceData[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [searchTerm, invoices]);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await fetch('/api/invoices');

      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }

      const result = await response.json();
      setInvoices(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
      console.error('Error fetching invoices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterInvoices = () => {
    const filtered = invoices.filter(invoice =>
      invoice.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.tableNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.guestId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInvoices(filtered);
  };

  const updatePaymentStatus = async (guestId: string, newStatus: 'Paid' | 'Pending', guestType: 'Room' | 'External') => {
    try {
      setUpdatingId(guestId);
      const response = await fetch('/api/invoices', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestId,
          paymentStatus: newStatus,
          guestType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      // Update local state
      const updatedInvoices = invoices.map(inv =>
        inv.guestId === guestId ? { ...inv, paymentStatus: newStatus } : inv
      );
      setInvoices(updatedInvoices);
      setSelectedInvoice(selectedInvoice ? { ...selectedInvoice, paymentStatus: newStatus } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update payment status');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="h-full w-full flex gap-6">
      {/* Left: Invoice List */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-luxury-gold" />
            Invoice Management
          </h3>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by guest name, room number, or table number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-luxury-dark border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-light-accentBlue transition-all duration-200"
            />
          </div>
        </div>

        {/* Invoice List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-slate-400">Loading invoices...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <p className="text-red-400">{error}</p>
              <button
                onClick={fetchInvoices}
                className="mt-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 text-sm transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-slate-400">
                {searchTerm ? 'No invoices match your search' : 'No invoices found'}
              </p>
            </div>
          ) : (
            filteredInvoices.map((invoice) => (
              <motion.button
                key={invoice._id}
                onClick={() => setSelectedInvoice(invoice)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 4 }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group ${
                  selectedInvoice?._id === invoice._id
                    ? 'bg-light-accentBlue/20 border border-light-accentBlue/50 shadow-[0_0_20px_rgba(0,80,179,0.15)]'
                    : 'bg-luxury-card border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{invoice.guestName}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>
                        {invoice.guestType === 'Room' ? `Room: ${invoice.roomNumber}` : `Table: ${invoice.tableNumber}`}
                      </span>
                      <span>•</span>
                      <span>{invoice.guestType}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                    <div className="text-right">
                      <p className="font-bold text-white">{formatCurrency(invoice.grandTotal)}</p>
                      <div className={`flex items-center gap-1 text-xs mt-1 ${
                        invoice.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {invoice.paymentStatus === 'Paid' ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Paid</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </>
                        )}
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-slate-500 transition-transform group-hover:translate-x-1 ${
                      selectedInvoice?._id === invoice._id ? 'text-light-accentBlue' : ''
                    }`} />
                  </div>
                </div>
              </motion.button>
            ))
          )}
        </div>
      </div>

      {/* Right: Invoice Detail */}
      <AnimatePresence mode="wait">
        {selectedInvoice ? (
          <motion.div
            key={selectedInvoice._id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="w-96 flex flex-col bg-gradient-to-b from-luxury-card to-slate-900/50 rounded-2xl border border-slate-700/50 p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="mb-6 pb-6 border-b border-slate-700/50">
              <h4 className="text-xl font-bold text-white mb-2">{selectedInvoice.guestName}</h4>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>
                  {selectedInvoice.guestType === 'Room'
                    ? `Room #${selectedInvoice.roomNumber}`
                    : `Table #${selectedInvoice.tableNumber}`}
                </span>
                <span className="text-xs">{formatDate(selectedInvoice.lastUpdated)}</span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-4 flex-1 mb-6">
              {/* Room Charges (only for room guests) */}
              {selectedInvoice.guestType === 'Room' && selectedInvoice.roomCharge > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 font-medium">Room Charges</span>
                    <span className="text-light-accentBlue font-semibold">{formatCurrency(selectedInvoice.roomCharge)}</span>
                  </div>
                  <div className="text-xs text-slate-500">Base room rate</div>
                </motion.div>
              )}

              {/* Food Orders */}
              {selectedInvoice.foodTotal > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 font-medium">Food & Beverage</span>
                    <span className="text-emerald-400 font-semibold">{formatCurrency(selectedInvoice.foodTotal)}</span>
                  </div>
                  <div className="text-xs text-slate-500">Served items</div>
                </motion.div>
              )}

              {/* Tour Bookings */}
              {selectedInvoice.guestType === 'Room' && selectedInvoice.tourTotal > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 font-medium">Tour Bookings</span>
                    <span className="text-amber-400 font-semibold">{formatCurrency(selectedInvoice.tourTotal)}</span>
                  </div>
                  <div className="text-xs text-slate-500">Completed tours</div>
                </motion.div>
              )}
            </div>

            {/* Total */}
            <div className="mb-6 p-4 bg-gradient-to-r from-light-accentBlue/20 to-luxury-gold/10 rounded-xl border border-light-accentBlue/30">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Grand Total</span>
                <span className="text-2xl font-bold text-light-accentBlue">{formatCurrency(selectedInvoice.grandTotal)}</span>
              </div>
            </div>

            {/* Payment Status */}
            <div className="space-y-3">
              <div className="text-sm text-slate-400 font-medium">Payment Status</div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updatePaymentStatus(selectedInvoice.guestId, 'Pending', selectedInvoice.guestType)}
                  disabled={updatingId === selectedInvoice.guestId}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                    selectedInvoice.paymentStatus === 'Pending'
                      ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  } disabled:opacity-50`}
                >
                  <Clock className="w-4 h-4" />
                  Pending
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updatePaymentStatus(selectedInvoice.guestId, 'Paid', selectedInvoice.guestType)}
                  disabled={updatingId === selectedInvoice.guestId || selectedInvoice.guestType === 'External'}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                    selectedInvoice.paymentStatus === 'Paid'
                      ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={selectedInvoice.guestType === 'External' ? 'External guests cannot be marked as paid' : ''}
                >
                  <Check className="w-4 h-4" />
                  Paid
                </motion.button>
              </div>

              {selectedInvoice.guestType === 'Room' && (
                <div className="text-xs text-slate-500 text-center">
                  Booking Status: <span className="text-slate-300 font-medium">{selectedInvoice.bookingStatus}</span>
                </div>
              )}

              {selectedInvoice.guestType === 'External' && (
                <div className="text-xs text-slate-500 text-center italic">
                  External guest invoices managed at point of sale
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="w-96 flex items-center justify-center bg-gradient-to-b from-luxury-card to-slate-900/50 rounded-2xl border border-slate-700/50 p-6"
          >
            <div className="text-center">
              <Eye className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Select an invoice to view details</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
