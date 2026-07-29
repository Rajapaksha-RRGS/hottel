'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BedDouble, Utensils, MapPin, Check, Clock,
  Printer, Mail, X, AlertCircle, CheckCircle,
  CreditCard, Banknote, Wifi, Calendar, DollarSign
} from 'lucide-react';
import { InvoiceData, PaymentMethod } from './types';

interface Props {
  invoice: InvoiceData;
  updatingId: string | null;
  onUpdatePayment: (guestId: string, status: 'Paid' | 'Pending', guestType: 'Room' | 'External') => Promise<void>;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const formatDate = (d: string | Date | undefined) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '–';

export default function InvoiceDetail({ invoice, updatingId, onUpdatePayment }: Props) {
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Cash');
  const [showEmail, setShowEmail] = useState(false);
  const [emailTo, setEmailTo] = useState(invoice.guestEmail || '');
  const [emailSending, setEmailSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const [emailMsg, setEmailMsg] = useState('');

  const isUpdating = updatingId === invoice.guestId;
  const isPaid = invoice.paymentStatus === 'Paid';

  const payMethods: { value: PaymentMethod; icon: React.ReactNode }[] = [
    { value: 'Cash', icon: <Banknote className="w-4 h-4" /> },
    { value: 'Card', icon: <CreditCard className="w-4 h-4" /> },
    { value: 'Online Transfer', icon: <Wifi className="w-4 h-4" /> },
  ];

  const [dbNotification, setDbNotification] = useState<string | null>(null);

  const handlePaymentToggle = async () => {
    const nextStatus = isPaid ? 'Pending' : 'Paid';
    await onUpdatePayment(invoice.guestId, nextStatus, invoice.guestType);
    if (nextStatus === 'Paid') {
      setDbNotification('✓ Saved to Database: Room Booking Paid, Food Orders Billed & Tour Status Completed');
      setTimeout(() => setDbNotification(null), 4500);
    } else {
      setDbNotification(null);
    }
  };

  const handlePrint = () => {
    const w = window.open('', '_blank', 'width=750,height=900');
    if (!w) return;
    const ci = invoice.checkInDate ? formatDate(invoice.checkInDate) : null;
    const co = invoice.checkOutDate ? formatDate(invoice.checkOutDate) : null;
    const rows = [
      ...(invoice.guestType === 'Room' && invoice.roomCharge > 0 ? [{
        cat: 'Room', name: `Room ${invoice.roomNumber} – ${invoice.nights || 1} Night(s)`,
        qty: invoice.nights || 1, unit: '–', sub: invoice.roomCharge
      }] : []),
      ...invoice.foodItems.map(i => ({ cat: 'Food', name: i.name, qty: i.quantity, unit: i.unitPrice, sub: i.subTotal })),
      ...invoice.tourItems.map(i => ({ cat: 'Tour', name: i.name, qty: 1, unit: i.unitPrice, sub: i.subTotal })),
    ];
    const catColor = (c: string) => c === 'Room' ? '#C5A059' : c === 'Food' ? '#10B981' : '#F59E0B';
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;background:#fff;color:#111;padding:40px}
    .header{text-align:center;border-bottom:2px solid #C5A059;padding-bottom:20px;margin-bottom:24px}
    .hotel{font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C5A059;margin-bottom:4px}
    h1{font-size:24px;font-weight:400;margin-bottom:4px}
    .inv-no{font-size:12px;color:#666}.meta{display:flex;justify-content:space-between;margin-bottom:24px}
    .meta-block{font-size:13px;line-height:1.7}.label{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#888;margin-bottom:2px}
    table{width:100%;border-collapse:collapse;margin-bottom:24px}
    th{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#888;border-bottom:1px solid #eee;padding:8px 0;text-align:left}
    td{padding:8px 0;font-size:13px;border-bottom:1px solid #f5f5f5}
    .amt{text-align:right}.cat-label{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:8px 0 2px}
    .totals{float:right;width:260px}.totals table{margin:0}.totals td{border:none;padding:6px 0}
    .grand{font-size:16px;font-weight:700;color:#C5A059;border-top:1px solid #C5A059;padding-top:8px!important}
    .status{display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1px;
      ${isPaid ? 'background:#f0fdf4;color:#16a34a;border:1px solid #86efac' : 'background:#fffbeb;color:#d97706;border:1px solid #fcd34d'}}
    .footer{clear:both;border-top:1px solid #eee;padding-top:20px;text-align:center;font-size:12px;color:#888;line-height:1.8}
    @media print{body{padding:20px}}</style></head><body>
    <div class="header"><div class="hotel">Vitamin Sea Hotel &amp; Hostel</div>
    <h1>Tax Invoice</h1><div class="inv-no">Invoice #${invoice._id.slice(-8).toUpperCase()} &nbsp;|&nbsp; ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div></div>
    <div class="meta">
    <div><div class="label">Bill To</div><div style="font-size:15px;font-weight:600">${invoice.guestName}</div>
    <div>${invoice.guestType === 'Room' ? `Room ${invoice.roomNumber}` : `Table ${invoice.tableNumber}`}</div>
    ${invoice.numberOfGuests ? `<div>${invoice.numberOfGuests} Guest(s)</div>` : ''}
    ${ci ? `<div>${ci} → ${co}</div>` : ''}</div>
    <div style="text-align:right"><div class="label">Status</div><span class="status">${isPaid ? '✓ PAID' : '⏳ PENDING'}</span>
    ${payMethod ? `<div style="margin-top:8px;font-size:12px;color:#666">Paid via ${payMethod}</div>` : ''}</div></div>
    <table><thead><tr><th>Description</th><th style="text-align:center">Qty</th><th class="amt">Unit</th><th class="amt">Amount</th></tr></thead><tbody>
    ${rows.map(r => `<tr><td><span style="font-size:10px;font-weight:700;color:${catColor(r.cat)};margin-right:6px">[${r.cat}]</span>${r.name}</td><td style="text-align:center">${r.qty}</td><td class="amt">${r.unit === '–' ? '–' : formatCurrency(r.unit as number)}</td><td class="amt">${formatCurrency(r.sub)}</td></tr>`).join('')}
    </tbody></table>
    <div class="totals"><table>
    <tr><td>Subtotal</td><td class="amt">${formatCurrency(invoice.grandTotal)}</td></tr>
    ${invoice.advancePayment > 0 ? `<tr><td style="color:#16a34a">Advance Paid</td><td class="amt" style="color:#16a34a">-${formatCurrency(invoice.advancePayment)}</td></tr>` : ''}
    <tr class="grand"><td>Balance Due</td><td class="amt">${formatCurrency(invoice.balanceDue)}</td></tr>
    </table></div>
    <div class="footer">Vitamin Sea Hotel &amp; Hostel &nbsp;·&nbsp; Nilaveli Road, Trincomalee, Sri Lanka<br>
    +94 (77) 123-4567 &nbsp;·&nbsp; reservations@vitaminsea.com<br>
    © ${new Date().getFullYear()} Vitamin Sea Hotel. All rights reserved.</div>
    <script>window.onload=()=>{window.print();}</script></body></html>`);
    w.document.close();
  };

  const handleSendEmail = async () => {
    if (!emailTo.trim()) return;
    setEmailSending(true);
    setEmailStatus('idle');
    try {
      const res = await fetch('/api/invoices/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestEmail: emailTo.trim(), invoiceData: invoice, paymentMethod: payMethod }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEmailStatus('ok');
        setEmailMsg(`Invoice sent to ${emailTo}`);
        setTimeout(() => { setShowEmail(false); setEmailStatus('idle'); }, 2500);
      } else {
        setEmailStatus('err');
        setEmailMsg(data.message || 'Failed to send email');
      }
    } catch {
      setEmailStatus('err');
      setEmailMsg('Network error. Please try again.');
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <>
      <motion.div
        key={invoice._id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.2 }}
        className="w-[500px] flex-shrink-0 flex flex-col bg-gradient-to-b from-luxury-card to-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl"
      >
        {/* Top Header Section */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-800/40 via-luxury-card/30 to-transparent">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] tracking-[0.15em] font-bold text-luxury-gold uppercase block mb-1">
                Tax Invoice Detail
              </span>
              <h4 className="text-2xl font-bold text-white tracking-tight leading-none mb-2">
                {invoice.guestName}
              </h4>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                  invoice.guestType === 'Room'
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                }`}>
                  {invoice.guestType === 'Room' ? <BedDouble className="w-3.5 h-3.5" /> : <Utensils className="w-3.5 h-3.5" />}
                  {invoice.guestType === 'Room' ? `Room ${invoice.roomNumber}` : `Table ${invoice.tableNumber}`}
                </span>
                {invoice.guestPhone && (
                  <span className="text-xs text-slate-400 bg-slate-800/40 px-2 py-1 rounded-lg border border-slate-700/30">
                    {invoice.guestPhone}
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-right flex flex-col items-end">
              <span className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border ${
                isPaid
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {isPaid ? <><Check className="w-3.5 h-3.5" />Paid</> : <><Clock className="w-3.5 h-3.5" />Pending</>}
              </span>
              <span className="text-[10px] text-slate-500 mt-2 block">
                ID: #{invoice._id.slice(-8).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Quick Stay Meta */}
          {invoice.guestType === 'Room' && invoice.checkInDate && (
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-3 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>
                {formatDate(invoice.checkInDate)} &rarr; {formatDate(invoice.checkOutDate)}
              </span>
              <span className="text-slate-600">•</span>
              <span>{invoice.nights} Night(s)</span>
              <span className="text-slate-600">•</span>
              <span>{invoice.numberOfGuests} Guest(s)</span>
            </div>
          )}
        </div>

        {/* Invoice Itemized Bill Sheet */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Bill Sheet Visual Wrapper */}
          <div className="bg-slate-950/40 rounded-xl border border-slate-800 p-4 space-y-4">
            <h5 className="text-xs font-bold tracking-wider text-slate-400 uppercase border-b border-slate-800 pb-2">
              Itemized Charges
            </h5>

            {/* Room Charges */}
            {invoice.guestType === 'Room' && invoice.roomCharge > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-luxury-gold uppercase tracking-wide">
                  <span>Room Lodging</span>
                  <span>{formatCurrency(invoice.roomCharge)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 pl-2">
                  <span>Base Booking Rate ({invoice.nights || 1} Night(s))</span>
                  <span>{formatCurrency(invoice.roomCharge)}</span>
                </div>
              </div>
            )}

            {/* Food & Beverage */}
            {invoice.foodItems.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400 uppercase tracking-wide border-t border-slate-900 pt-2">
                  <span>Food & Beverage</span>
                  <span>{formatCurrency(invoice.foodTotal)}</span>
                </div>
                <div className="space-y-1 pl-2">
                  {invoice.foodItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-slate-300">
                        {item.name} <span className="text-slate-500 font-medium">× {item.quantity}</span>
                      </span>
                      <span className="text-slate-400">{formatCurrency(item.subTotal)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tours & Packages */}
            {invoice.tourItems.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-wide border-t border-slate-900 pt-2">
                  <span>Excursions & Tours</span>
                  <span>{formatCurrency(invoice.tourTotal)}</span>
                </div>
                <div className="space-y-1 pl-2">
                  {invoice.tourItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-slate-300">{item.name}</span>
                      <span className="text-slate-400">{formatCurrency(item.subTotal)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Premium Financial Summary Panel */}
          <div className="bg-gradient-to-r from-light-accentBlue/8 to-luxury-gold/4 rounded-xl border border-light-accentBlue/20 p-5 space-y-3 shadow-sm">
            <div className="flex justify-between text-sm text-slate-300">
              <span>Gross Total Amount</span>
              <span className="font-semibold text-white">{formatCurrency(invoice.grandTotal)}</span>
            </div>

            {invoice.advancePayment > 0 && (
              <div className="flex justify-between text-sm items-center">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  Advance Down-Payment
                </span>
                <span className="font-bold text-emerald-400">-{formatCurrency(invoice.advancePayment)}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <span className="text-sm font-bold text-white uppercase tracking-wider">Net Amount Due</span>
              <div className="flex items-center gap-1">
                <DollarSign className="w-5 h-5 text-light-accentBlue" />
                <span className="text-3xl font-extrabold text-light-accentBlue tracking-tight">
                  {invoice.balanceDue.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/40 space-y-4">
          {/* Payment Method Selector */}
          <div className="space-y-2">
            <span className="text-[10px] tracking-wider font-bold text-slate-500 uppercase">
              Select Payment Method
            </span>
            <div className="flex gap-2.5">
              {payMethods.map(m => (
                <button
                  key={m.value}
                  onClick={() => setPayMethod(m.value)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                    payMethod === m.value
                      ? 'bg-light-accentBlue text-white border-light-accentBlue shadow-md shadow-light-accentBlue/10'
                      : 'bg-luxury-card text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {m.icon}
                  <span>{m.value}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Core Invoice Actions */}
          <div className="space-y-2.5 pt-1">
            {/* DB Persistence Toast */}
            <AnimatePresence>
              {dbNotification && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-400 font-semibold flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                  <span>{dbNotification}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mark as Paid Action Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handlePaymentToggle}
              disabled={isUpdating}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 ${
                isPaid
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/80 shadow-none'
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/10 hover:from-emerald-400 hover:to-emerald-500'
              }`}
            >
              {isUpdating ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isPaid ? (
                <><Clock className="w-4 h-4" />Mark as Pending</>
              ) : (
                <><Check className="w-4 h-4" />Process payment & Mark as Paid</>
              )}
            </motion.button>

            {/* Print and Email Actions */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handlePrint}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700/60 transition-all"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                <span>Print Bill</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => { setShowEmail(true); setEmailTo(invoice.guestEmail || ''); setEmailStatus('idle'); }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-light-accentBlue/10 text-blue-400 hover:bg-light-accentBlue/20 border border-light-accentBlue/20 transition-all"
              >
                <Mail className="w-4 h-4 text-blue-400" />
                <span>Send E-Bill</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Email Modal */}
      <AnimatePresence>
        {showEmail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={e => { if (e.target === e.currentTarget) setShowEmail(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-luxury-card border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-light-accentBlue" />
                  Send E-Invoice Receipt
                </h3>
                <button onClick={() => setShowEmail(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Guest details</span>
                  <p className="text-white font-bold text-sm">{invoice.guestName}</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {invoice.guestType === 'Room' ? `Room #${invoice.roomNumber}` : `Table #${invoice.tableNumber}`} · Total: {formatCurrency(invoice.grandTotal)}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">Guest Email Address</label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={e => setEmailTo(e.target.value)}
                    placeholder="guest@domain.com"
                    className="w-full bg-luxury-dark border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-light-accentBlue text-sm transition-all"
                  />
                </div>

                {emailStatus !== 'idle' && (
                  <div className={`flex items-start gap-2.5 p-3.5 rounded-xl text-sm ${
                    emailStatus === 'ok'
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/10 border border-red-500/20 text-red-400'
                  }`}>
                    {emailStatus === 'ok' ? <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                    <span className="font-medium">{emailMsg}</span>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowEmail(false)}
                    className="flex-1 py-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-sm font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendEmail}
                    disabled={emailSending || !emailTo.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-light-accentBlue to-blue-600 text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/10"
                  >
                    {emailSending ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                    ) : (
                      <><Mail className="w-4 h-4" />Send Now</>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
