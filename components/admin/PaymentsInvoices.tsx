'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Download, Eye, CreditCard, Receipt,
  Utensils, BedDouble, Check, Clock, RefreshCcw, Loader2,
  DollarSign, ArrowUpRight, CheckCircle, X, Mail, Printer,
  Banknote, Wifi, Calendar, AlertCircle
} from 'lucide-react';

export interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export interface InvoiceData {
  _id: string;
  guestId: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  guestType: 'Room' | 'External';
  roomNumber?: string;
  tableNumber?: string;
  checkInDate?: string;
  checkOutDate?: string;
  numberOfGuests?: number;
  nights?: number;
  roomCharge: number;
  foodTotal: number;
  tourTotal: number;
  grandTotal: number;
  advancePayment: number;
  balanceDue: number;
  foodItems: InvoiceItem[];
  tourItems: InvoiceItem[];
  paymentStatus: 'Paid' | 'Pending';
  bookingStatus?: string;
  lastUpdated?: string | Date;
}

type StatusFilter = 'All' | 'Paid' | 'Pending';
type TypeFilter = 'All' | 'Room' | 'External';

export default function PaymentsInvoices() {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [dbToast, setDbToast] = useState<string | null>(null);

  // Email modal state inside detail view
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [emailTo, setEmailTo] = useState<string>('');
  const [emailSending, setEmailSending] = useState<boolean>(false);
  const [emailStatusMsg, setEmailStatusMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [payMethod, setPayMethod] = useState<'Cash' | 'Card' | 'Online Transfer'>('Cash');

  // Fetch real-time data from DB
  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({
        status: statusFilter,
        type: typeFilter,
      });
      const res = await fetch(`/api/invoices?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load live billing data');
      const json = await res.json();
      if (json.success) {
        setInvoices(json.data || []);
      } else {
        throw new Error(json.message || 'Failed to fetch invoices');
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError(err instanceof Error ? err.message : 'Error connecting to database');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Filtered list based on search term
  const filteredInvoices = useMemo(() => {
    if (!searchQuery.trim()) return invoices;
    const q = searchQuery.toLowerCase();
    return invoices.filter((inv) =>
      inv.guestName.toLowerCase().includes(q) ||
      (inv.roomNumber && inv.roomNumber.toLowerCase().includes(q)) ||
      (inv.tableNumber && inv.tableNumber.toLowerCase().includes(q)) ||
      inv.guestId.toLowerCase().includes(q) ||
      inv._id.toLowerCase().includes(q)
    );
  }, [invoices, searchQuery]);

  // Summary Metrics calculated dynamically from real data
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let pendingRevenue = 0;
    let tableOrdersRevenue = 0;
    let roomRevenue = 0;

    invoices.forEach((inv) => {
      if (inv.paymentStatus === 'Paid') {
        totalRevenue += inv.grandTotal;
      } else {
        pendingRevenue += inv.balanceDue || inv.grandTotal;
      }

      if (inv.guestType === 'External') {
        tableOrdersRevenue += inv.foodTotal;
      } else {
        roomRevenue += inv.roomCharge;
      }
    });

    return {
      totalRevenue,
      pendingRevenue,
      tableOrdersRevenue,
      totalCount: invoices.length,
      paidCount: invoices.filter((i) => i.paymentStatus === 'Paid').length,
      pendingCount: invoices.filter((i) => i.paymentStatus === 'Pending').length,
    };
  }, [invoices]);

  // Update payment status in database
  const handleUpdatePayment = async (
    guestId: string,
    newStatus: 'Paid' | 'Pending',
    guestType: 'Room' | 'External'
  ) => {
    try {
      setUpdatingId(guestId);
      const res = await fetch('/api/invoices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId, paymentStatus: newStatus, guestType }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to update payment');
      }

      // Show Toast Notification
      setDbToast(
        newStatus === 'Paid'
          ? '✅ Saved to Database: Payment marked as Paid & orders updated!'
          : 'ℹ️ Status updated to Pending.'
      );
      setTimeout(() => setDbToast(null), 4000);

      // Optimistic update local state
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.guestId === guestId ? { ...inv, paymentStatus: newStatus } : inv
        )
      );

      if (selectedInvoice && selectedInvoice.guestId === guestId) {
        setSelectedInvoice((prev) =>
          prev ? { ...prev, paymentStatus: newStatus } : null
        );
      }

      // Refresh to ensure exact DB sync
      setTimeout(fetchInvoices, 500);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  // Export to CSV functionality
  const handleExportCSV = () => {
    if (invoices.length === 0) {
      alert('No invoice data available to export.');
      return;
    }

    const headers = [
      'Invoice ID',
      'Guest / Customer',
      'Type',
      'Room / Table',
      'Room Charge',
      'Food Total',
      'Tour Total',
      'Grand Total',
      'Advance Payment',
      'Balance Due',
      'Payment Status',
    ];

    const rows = invoices.map((inv) => [
      `INV-${inv._id.slice(-6).toUpperCase()}`,
      `"${inv.guestName.replace(/"/g, '""')}"`,
      inv.guestType === 'Room' ? 'Room Guest' : 'Table Dining',
      inv.guestType === 'Room' ? `Room ${inv.roomNumber || ''}` : `Table ${inv.tableNumber || ''}`,
      inv.roomCharge || 0,
      inv.foodTotal || 0,
      inv.tourTotal || 0,
      inv.grandTotal || 0,
      inv.advancePayment || 0,
      inv.balanceDue || 0,
      inv.paymentStatus,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `hotel_financial_invoices_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Invoice Function
  const handlePrintInvoice = (inv: InvoiceData) => {
    const w = window.open('', '_blank', 'width=750,height=900');
    if (!w) return;

    const isPaid = inv.paymentStatus === 'Paid';
    const rows = [
      ...(inv.guestType === 'Room' && inv.roomCharge > 0
        ? [{ cat: 'Room', name: `Room ${inv.roomNumber} Lodging`, qty: inv.nights || 1, unit: inv.roomCharge / (inv.nights || 1), sub: inv.roomCharge }]
        : []),
      ...inv.foodItems.map((i) => ({ cat: 'Food', name: i.name, qty: i.quantity, unit: i.unitPrice, sub: i.subTotal })),
      ...inv.tourItems.map((i) => ({ cat: 'Tour', name: i.name, qty: 1, unit: i.unitPrice, sub: i.subTotal })),
    ];

    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice - ${inv.guestName}</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;background:#fff;color:#111;padding:40px}
    .header{text-align:center;border-bottom:2px solid #C5A059;padding-bottom:20px;margin-bottom:24px}
    .hotel{font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C5A059;margin-bottom:4px}
    h1{font-size:24px;font-weight:400;margin-bottom:4px}
    .inv-no{font-size:12px;color:#666}.meta{display:flex;justify-content:space-between;margin-bottom:24px}
    .meta-block{font-size:13px;line-height:1.7}.label{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#888;margin-bottom:2px}
    table{width:100%;border-collapse:collapse;margin-bottom:24px}
    th{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#888;border-bottom:1px solid #eee;padding:8px 0;text-align:left}
    td{padding:8px 0;font-size:13px;border-bottom:1px solid #f5f5f5}
    .amt{text-align:right}
    .totals{float:right;width:260px}.totals table{margin:0}.totals td{border:none;padding:6px 0}
    .grand{font-size:16px;font-weight:700;color:#C5A059;border-top:1px solid #C5A059;padding-top:8px!important}
    .status{display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1px;
      ${isPaid ? 'background:#f0fdf4;color:#16a34a;border:1px solid #86efac' : 'background:#fffbeb;color:#d97706;border:1px solid #fcd34d'}}
    .footer{clear:both;border-top:1px solid #eee;padding-top:20px;text-align:center;font-size:12px;color:#888;line-height:1.8}
    </style></head><body>
    <div class="header"><div class="hotel">Vitamin Sea Hotel &amp; Resort</div>
    <h1>Tax Invoice</h1><div class="inv-no">Ref #${inv._id.slice(-8).toUpperCase()} &nbsp;|&nbsp; ${new Date().toLocaleDateString()}</div></div>
    <div class="meta">
    <div><div class="label">Customer / Guest</div><div style="font-size:16px;font-weight:600">${inv.guestName}</div>
    <div>${inv.guestType === 'Room' ? `Room ${inv.roomNumber}` : `Table ${inv.tableNumber}`}</div>
    ${inv.guestPhone ? `<div>Tel: ${inv.guestPhone}</div>` : ''}</div>
    <div style="text-align:right"><div class="label">Status</div><span class="status">${isPaid ? '✓ PAID' : '⏳ PENDING'}</span></div></div>
    <table><thead><tr><th>Description</th><th style="text-align:center">Qty</th><th class="amt">Unit (LKR)</th><th class="amt">Subtotal (LKR)</th></tr></thead><tbody>
    ${rows.map((r) => `<tr><td>[${r.cat}] ${r.name}</td><td style="text-align:center">${r.qty}</td><td class="amt">${r.unit.toLocaleString()}</td><td class="amt">${r.sub.toLocaleString()}</td></tr>`).join('')}
    </tbody></table>
    <div class="totals"><table>
    <tr><td>Grand Total</td><td class="amt">LKR ${inv.grandTotal.toLocaleString()}</td></tr>
    ${inv.advancePayment > 0 ? `<tr><td style="color:#16a34a">Advance Paid</td><td class="amt" style="color:#16a34a">-LKR ${inv.advancePayment.toLocaleString()}</td></tr>` : ''}
    <tr class="grand"><td>Balance Due</td><td class="amt">LKR ${inv.balanceDue.toLocaleString()}</td></tr>
    </table></div>
    <div class="footer">Vitamin Sea Hotel &amp; Resort · Management &amp; Billing System<br>© ${new Date().getFullYear()} All Rights Reserved.</div>
    <script>window.onload=()=>{window.print();}</script></body></html>`);
    w.document.close();
  };

  // Send Email Receipt
  const handleSendEmail = async () => {
    if (!selectedInvoice || !emailTo.trim()) return;
    setEmailSending(true);
    setEmailStatusMsg(null);
    try {
      const res = await fetch('/api/invoices/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestEmail: emailTo.trim(),
          invoiceData: selectedInvoice,
          paymentMethod: payMethod,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEmailStatusMsg({ type: 'ok', text: `Invoice successfully sent to ${emailTo}` });
        setTimeout(() => setShowEmailModal(false), 2000);
      } else {
        setEmailStatusMsg({ type: 'err', text: data.message || 'Failed to send email' });
      }
    } catch {
      setEmailStatusMsg({ type: 'err', text: 'Network error. Please try again.' });
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {dbToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold text-sm flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>{dbToast}</span>
            </div>
            <button onClick={() => setDbToast(null)} className="text-emerald-400/60 hover:text-emerald-300">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-amber-400" />
            Payments & Invoices
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time financial management for Room Stay & Dining Table Payments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchInvoices}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-900/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-300 hover:text-white transition-all active:scale-95"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl px-4 py-2.5 text-sm transition-all shadow-lg shadow-amber-500/10 active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Real-time Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
              <ArrowUpRight className="w-3 h-3" /> Real-time
            </span>
          </div>
          <p className="text-3xl font-extrabold text-white">
            LKR {metrics.totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Total Revenue Collected ({metrics.paidCount} Paid Invoices)
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
              {metrics.pendingCount} Pending
            </span>
          </div>
          <p className="text-3xl font-extrabold text-white">
            LKR {metrics.pendingRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Pending Balance Due (Rooms & Table Dining)
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-slate-900/80 border border-orange-500/20 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400">
              <Utensils className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-orange-400 bg-orange-500/10 px-2 py-1 rounded-full border border-orange-500/20">
              F&B Sales
            </span>
          </div>
          <p className="text-3xl font-extrabold text-white">
            LKR {metrics.tableOrdersRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Table Dining & Food Order Revenue
          </p>
        </motion.div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by guest, room, or table..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Source Type Filter */}
          <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-xl p-1 text-xs font-semibold">
            {(['All', 'Room', 'External'] as TypeFilter[]).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  typeFilter === t
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'Room' && <BedDouble className="w-3.5 h-3.5" />}
                {t === 'External' && <Utensils className="w-3.5 h-3.5" />}
                {t === 'All' ? 'All Types' : t === 'Room' ? 'Rooms' : 'Table Dining'}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-xl p-1 text-xs font-semibold">
            {(['All', 'Paid', 'Pending'] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === s
                    ? 'bg-slate-800 text-white font-bold border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Invoices Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
            <span className="text-sm font-medium">Fetching real-time invoices...</span>
          </div>
        ) : error ? (
          <div className="p-10 text-center text-red-400 space-y-3">
            <AlertCircle className="w-8 h-8 mx-auto text-red-400" />
            <p className="font-semibold">{error}</p>
            <button
              onClick={fetchInvoices}
              className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            <Receipt className="w-12 h-12 mx-auto mb-3 text-slate-700" />
            <p className="font-semibold text-slate-400 text-base">No invoices found</p>
            <p className="text-xs text-slate-600 mt-1">Try resetting your filters or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                  <th className="p-4">Ref ID</th>
                  <th className="p-4">Guest / Customer</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">Item Details</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Grand Total</th>
                  <th className="p-4 text-right">Balance Due</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredInvoices.map((inv) => {
                  const isPaid = inv.paymentStatus === 'Paid';
                  const isUpdating = updatingId === inv.guestId;
                  const isRoom = inv.guestType === 'Room';

                  return (
                    <tr
                      key={inv._id}
                      className="group hover:bg-slate-800/40 transition-colors duration-150 text-sm"
                    >
                      {/* Ref ID */}
                      <td className="p-4 font-mono font-semibold text-amber-400">
                        INV-{inv._id.slice(-6).toUpperCase()}
                      </td>

                      {/* Guest / Customer */}
                      <td className="p-4">
                        <div className="font-semibold text-white">{inv.guestName}</div>
                        {inv.guestPhone && (
                          <div className="text-xs text-slate-500">{inv.guestPhone}</div>
                        )}
                      </td>

                      {/* Source */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                            isRoom
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                          }`}
                        >
                          {isRoom ? (
                            <>
                              <BedDouble className="w-3.5 h-3.5" />
                              Room {inv.roomNumber || 'N/A'}
                            </>
                          ) : (
                            <>
                              <Utensils className="w-3.5 h-3.5" />
                              Table {inv.tableNumber || 'N/A'}
                            </>
                          )}
                        </span>
                      </td>

                      {/* Item Details */}
                      <td className="p-4 text-xs text-slate-400">
                        {isRoom && inv.roomCharge > 0 && (
                          <div>• Room Charge: LKR {inv.roomCharge.toLocaleString()}</div>
                        )}
                        {inv.foodTotal > 0 && (
                          <div className="text-emerald-400">• Food &amp; Beverage: LKR {inv.foodTotal.toLocaleString()}</div>
                        )}
                        {inv.tourTotal > 0 && (
                          <div className="text-amber-400">• Tours: LKR {inv.tourTotal.toLocaleString()}</div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                            isPaid
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {isPaid ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {inv.paymentStatus}
                        </span>
                      </td>

                      {/* Grand Total */}
                      <td className="p-4 text-right font-bold text-white">
                        LKR {inv.grandTotal.toLocaleString()}
                      </td>

                      {/* Balance Due */}
                      <td className="p-4 text-right font-bold text-emerald-400">
                        {inv.balanceDue > 0 ? `LKR ${inv.balanceDue.toLocaleString()}` : 'LKR 0'}
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Quick Toggle Payment */}
                          <button
                            onClick={() =>
                              handleUpdatePayment(
                                inv.guestId,
                                isPaid ? 'Pending' : 'Paid',
                                inv.guestType
                              )
                            }
                            disabled={isUpdating}
                            title={isPaid ? 'Mark as Pending' : 'Mark as Paid'}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 active:scale-95 cursor-pointer disabled:opacity-50 ${
                              isPaid
                                ? 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                            }`}
                          >
                            {isUpdating ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : isPaid ? (
                              'Paid'
                            ) : (
                              'Mark Paid'
                            )}
                          </button>

                          {/* View Detail Modal */}
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setEmailTo(inv.guestEmail || '');
                            }}
                            title="View Full Itemized Invoice"
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition-all cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Invoice Detail Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedInvoice(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Modal Top Header */}
              <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-950/60">
                <div>
                  <span className="text-[10px] tracking-widest font-bold text-amber-400 uppercase block mb-1">
                    Tax Invoice Detail
                  </span>
                  <h3 className="text-2xl font-bold text-white">{selectedInvoice.guestName}</h3>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                      {selectedInvoice.guestType === 'Room'
                        ? `Room ${selectedInvoice.roomNumber}`
                        : `Table ${selectedInvoice.tableNumber}`}
                    </span>
                    <span>Ref: INV-{selectedInvoice._id.slice(-6).toUpperCase()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Itemized Charges Body */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1 text-sm">
                <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                    Itemized Breakdown
                  </h4>

                  {/* Room Charge */}
                  {selectedInvoice.guestType === 'Room' && selectedInvoice.roomCharge > 0 && (
                    <div className="flex justify-between items-center py-1">
                      <div>
                        <span className="font-semibold text-white">Room Lodging</span>
                        <div className="text-xs text-slate-500">
                          {selectedInvoice.nights || 1} Night(s) Stay
                        </div>
                      </div>
                      <span className="font-bold text-amber-400">
                        LKR {selectedInvoice.roomCharge.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Food items */}
                  {selectedInvoice.foodItems.length > 0 && (
                    <div className="pt-2 border-t border-slate-900 space-y-1.5">
                      <div className="text-xs font-bold text-emerald-400 uppercase">
                        Food &amp; Beverage Orders ({selectedInvoice.foodItems.length})
                      </div>
                      {selectedInvoice.foodItems.map((fi, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-slate-300">
                          <span>
                            {fi.name} <span className="text-slate-500">× {fi.quantity}</span>
                          </span>
                          <span>LKR {fi.subTotal.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tour items */}
                  {selectedInvoice.tourItems.length > 0 && (
                    <div className="pt-2 border-t border-slate-900 space-y-1.5">
                      <div className="text-xs font-bold text-amber-400 uppercase">
                        Excursions &amp; Tours ({selectedInvoice.tourItems.length})
                      </div>
                      {selectedInvoice.tourItems.map((ti, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-slate-300">
                          <span>{ti.name}</span>
                          <span>LKR {ti.subTotal.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Financial Totals */}
                <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Grand Total</span>
                    <span className="font-bold text-white">LKR {selectedInvoice.grandTotal.toLocaleString()}</span>
                  </div>
                  {selectedInvoice.advancePayment > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Advance Paid</span>
                      <span className="font-bold">-LKR {selectedInvoice.advancePayment.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-amber-400 pt-2 border-t border-slate-800">
                    <span>Balance Due</span>
                    <span>LKR {selectedInvoice.balanceDue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-6 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePrintInvoice(selectedInvoice)}
                    className="px-4 py-2 bg-slate-800 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    <Printer className="w-4 h-4" /> Print Bill
                  </button>
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    <Mail className="w-4 h-4" /> Send Email
                  </button>
                </div>

                <button
                  onClick={() =>
                    handleUpdatePayment(
                      selectedInvoice.guestId,
                      selectedInvoice.paymentStatus === 'Paid' ? 'Pending' : 'Paid',
                      selectedInvoice.guestType
                    )
                  }
                  disabled={updatingId === selectedInvoice.guestId}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
                    selectedInvoice.paymentStatus === 'Paid'
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  {updatingId === selectedInvoice.guestId ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : selectedInvoice.paymentStatus === 'Paid' ? (
                    'Mark as Pending'
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Process Payment &amp; Mark Paid
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Sender Dialog */}
      <AnimatePresence>
        {showEmailModal && selectedInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[60] p-4"
          >
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-400" /> Send E-Invoice
                </h4>
                <button onClick={() => setShowEmailModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">Recipient Email</label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="guest@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {emailStatusMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    emailStatusMsg.type === 'ok'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{emailStatusMsg.text}</span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={emailSending || !emailTo.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {emailSending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Now'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
