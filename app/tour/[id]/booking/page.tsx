'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Calendar, Users, Mail, Phone, User,
  MapPin, Clock, Car, CheckCircle, AlertCircle, Loader2,
} from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/components/Herder';
import Footer from '@/components/components/Footer';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Tour {
  _id: string;
  name: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  category: string;
  image: string;
  capacity: number;
  description?: string;
  vehicle?: string;
  status?: string;
}

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  date: string;
  numberOfGuests: number;
  specialRequests: string;
}

interface FormErrors { [key: string]: string }

const inputClass = (err?: string) =>
  `w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all text-gray-800 placeholder:text-gray-400 ${
    err ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
  }`;

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const id = params.id as string;

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    phone: '',
    date: '',
    numberOfGuests: 1,
    specialRequests: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // ── Fetch tour ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    fetch('/api/tours')
      .then((r) => r.json())
      .then((data) => {
        const found = (data.tours || []).find((t: Tour) => t._id === id);
        if (found) setTour(found);
        else setFetchError('Tour not found');
      })
      .catch(() => setFetchError('Failed to load tour details'))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Auto-fill from session ────────────────────────────────────────────────
  useEffect(() => {
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        fullName: session.user?.name || prev.fullName,
        email: session.user?.email || prev.email,
      }));
    }
  }, [session]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const totalPrice = tour ? tour.price * form.numberOfGuests : 0;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'numberOfGuests' ? parseInt(value) : value,
    }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const errors: FormErrors = {};
    if (!form.fullName.trim()) errors.fullName = 'Full name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email format';
    if (!form.phone.trim()) errors.phone = 'Phone number is required';
    if (!form.date) errors.date = 'Tour date is required';
    else if (new Date(form.date) < new Date()) errors.date = 'Date must be in the future';
    if (form.numberOfGuests < 1) errors.numberOfGuests = 'At least 1 guest required';
    if (tour && form.numberOfGuests > tour.capacity) errors.numberOfGuests = `Max ${tour.capacity} guests`;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !tour) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/tours/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          tourPackageId: tour._id,
          tourName: tour.name,
          numberOfPeople: form.numberOfGuests,
          bookingDate: form.date,
          totalCost: totalPrice,
          specialRequests: form.specialRequests,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || 'Booking failed');

      setBookingSuccess(true);
      setTimeout(() => router.push('/guest/dashboard/bookings'), 3500);
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  if (fetchError || !tour) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 py-32 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Tour Not Found</h1>
          <p className="text-gray-500 mb-6">{fetchError || 'This tour is no longer available.'}</p>
          <Link href="/tour" className="inline-flex items-center gap-2 bg-amber-400 text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-amber-500 transition-colors">
            <ArrowLeft size={16} /> Back to Tours
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  // ── Booking Success ───────────────────────────────────────────────────────
  if (bookingSuccess) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Navigation />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-8 py-12 max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed! 🎉</h1>
          <p className="text-gray-600 mb-1">Your booking for <span className="font-semibold">{tour.name}</span> is confirmed.</p>
          <p className="text-gray-400 text-sm mb-6">A confirmation has been sent to <span className="font-medium text-gray-600">{form.email}</span></p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between text-sm text-gray-700 mb-1">
              <span>Guests</span><span className="font-semibold">{form.numberOfGuests}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700 mb-1">
              <span>Date</span><span className="font-semibold">{new Date(form.date).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700 font-bold border-t border-amber-200 pt-2 mt-2">
              <span>Total</span><span className="text-amber-600">LKR {totalPrice.toLocaleString()}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400">Redirecting to your bookings...</p>
        </motion.div>
        <Footer />
      </main>
    );
  }

  // ── Main Booking Form ─────────────────────────────────────────────────────
  const isLoggedIn = sessionStatus === 'authenticated';

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero strip */}
      <div className="relative h-48 overflow-hidden">
        <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        <div className="absolute inset-0 flex items-center px-8 max-w-5xl mx-auto">
          <div>
            <Link href={`/tour/${id}`} className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-2 transition-colors">
              <ArrowLeft size={14} /> Back to tour
            </Link>
            <h1 className="text-2xl md:text-3xl font-serif text-white font-bold">{tour.name}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-white/80 text-sm">
              <span className="flex items-center gap-1"><MapPin size={13} className="text-amber-400" />{tour.location}</span>
              <span className="flex items-center gap-1"><Clock size={13} className="text-amber-400" />{tour.duration}</span>
              {tour.vehicle && <span className="flex items-center gap-1"><Car size={13} className="text-amber-400" />{tour.vehicle}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Auto-fill notice */}
        {isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 mb-8 text-sm text-amber-800"
          >
            <CheckCircle size={16} className="text-amber-500 shrink-0" />
            <span>Your profile details have been <strong>auto-filled</strong>. You can update them if needed.</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Form ──────────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">

            {/* Guest Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                <User size={18} className="text-amber-500" /> Guest Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Full Name *</label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={inputClass(formErrors.fullName)}
                  />
                  {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                    <span className="flex items-center gap-1"><Mail size={13} /> Email *</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={inputClass(formErrors.email)}
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                    <span className="flex items-center gap-1"><Phone size={13} /> Phone *</span>
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+94 71 234 5678"
                    className={inputClass(formErrors.phone)}
                  />
                  {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                <Calendar size={18} className="text-amber-500" /> Booking Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Tour Date *</label>
                  <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={inputClass(formErrors.date)}
                  />
                  {formErrors.date && <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>}
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                    <span className="flex items-center gap-1"><Users size={13} /> Number of Guests *</span>
                  </label>
                  <select
                    name="numberOfGuests"
                    value={form.numberOfGuests}
                    onChange={handleChange}
                    className={inputClass(formErrors.numberOfGuests)}
                  >
                    {Array.from({ length: tour.capacity }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                  {formErrors.numberOfGuests && <p className="text-red-500 text-xs mt-1">{formErrors.numberOfGuests}</p>}
                </div>

                {/* Special Requests */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Special Requests <span className="font-normal text-gray-400">(optional)</span></label>
                  <textarea
                    name="specialRequests"
                    value={form.specialRequests}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Any dietary requirements, accessibility needs, or special arrangements..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all text-gray-800 placeholder:text-gray-400 bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit error */}
            {submitError && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-sm text-red-700">
                <AlertCircle size={16} className="shrink-0" />
                {submitError}
              </div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm tracking-wide"
            >
              {isSubmitting ? (
                <><Loader2 size={18} className="animate-spin" /> Processing Booking...</>
              ) : (
                <>Confirm Booking — LKR {totalPrice.toLocaleString()}</>
              )}
            </motion.button>
          </form>

          {/* ── Summary Sidebar ────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Price header */}
              <div className="bg-amber-400 px-6 py-5 text-center">
                <p className="text-gray-700 text-xs uppercase font-bold tracking-widest mb-1">Price Per Person</p>
                <p className="text-3xl font-extrabold text-gray-900">LKR {tour.price.toLocaleString()}</p>
              </div>

              <div className="p-6 space-y-4">
                {/* Tour info */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-semibold text-gray-800">{tour.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vehicle</span>
                    <span className="font-semibold text-gray-800">{tour.vehicle || 'A/C Van'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Capacity</span>
                    <span className="font-semibold text-gray-800">{tour.capacity} guests</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category</span>
                    <span className="font-semibold text-gray-800">{tour.category}</span>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>LKR {tour.price.toLocaleString()} × {form.numberOfGuests} guest{form.numberOfGuests > 1 ? 's' : ''}</span>
                    <span>LKR {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2">
                    <span>Total</span>
                    <span className="text-amber-600">LKR {totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 text-center pt-2">
                  ✅ Free cancellation up to 24 hours before departure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
