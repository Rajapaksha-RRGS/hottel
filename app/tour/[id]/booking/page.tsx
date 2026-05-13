'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Users, Mail, Phone, User } from 'lucide-react';
import Link from 'next/link';
import Navigation from '../../../../components/components/Herder';
import Footer from '../../../../components/components/Footer';

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
  description: string;
  status?: string;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  date: string;
  numberOfGuests: number;
  specialRequests: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVC: string;
  cardName: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    date: '',
    numberOfGuests: 1,
    specialRequests: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    cardName: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetchTourDetails();
  }, [id]);

  const fetchTourDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/tours');
      if (!response.ok) {
        throw new Error('Failed to fetch tours');
      }

      const data = await response.json();
      const tours = data.tours || [];

      // Find tour by _id (id is now the MongoDB _id)
      const foundTour = tours.find((tour: any) => tour._id === id);

      if (!foundTour) {
        setError('Tour not found');
        setTour(null);
      } else {
        setTour(foundTour);
        // Initialize numberOfGuests with 1 or max capacity
        setFormData(prev => ({
          ...prev,
          numberOfGuests: Math.min(1, foundTour.capacity)
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tour details');
      setTour(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <p className="text-gray-600">Loading booking details...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !tour) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Tour Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'This tour is no longer available'}</p>
          <Link href="/tour" className="text-amber-500 hover:text-amber-600">Back to Tours</Link>
        </div>
        <Footer />
      </main>
    );
  }

  const totalPrice = tour.price * formData.numberOfGuests;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.date) newErrors.date = 'Tour date is required';
    if (formData.numberOfGuests < 1) newErrors.numberOfGuests = 'At least 1 guest is required';
    if (formData.numberOfGuests > tour.capacity) newErrors.numberOfGuests = `Maximum capacity is ${tour.capacity}`;

    // Payment validation
    if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    else if (!/^\d{13,19}$/.test(formData.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Invalid card number';
    if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Expiry date is required';
    else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) newErrors.cardExpiry = 'Use MM/YY format';
    if (!formData.cardCVC.trim()) newErrors.cardCVC = 'CVC is required';
    else if (!/^\d{3,4}$/.test(formData.cardCVC)) newErrors.cardCVC = 'Invalid CVC';
    if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'numberOfGuests') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    } else if (name === 'cardNumber') {
      const cleaned = value.replace(/\s/g, '');
      const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else if (name === 'cardExpiry') {
      let formatted = value.replace(/\D/g, '').slice(0, 4);
      if (formatted.length >= 2) {
        formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
      }
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call for payment processing
      // In production, you would integrate with Stripe, PayPal, etc.
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would send the booking data to your backend
      console.log('Booking submitted:', {
        ...formData,
        tourId: tour._id,
        totalPrice: totalPrice,
      });

      setBookingSuccess(true);

      // Redirect after success
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error) {
      console.error('Booking error:', error);
      setFormErrors({ submit: 'Booking failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingSuccess) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Navigation />
        <div className="text-center px-6">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600 mb-2">Thank you for booking {tour.name}</p>
            <p className="text-gray-500 text-sm">A confirmation email has been sent to {formData.email}</p>
          </div>
          <Link href="/" className="inline-block text-amber-500 hover:text-amber-600 font-semibold">
            Return to Home
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <Link href={'/tour/' + id} className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-600 mb-4">
            <ArrowLeft size={16} />
            Back to Tour
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Complete Your Booking</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <User size={20} className="text-amber-500" />
                  Personal Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Your full name"
                    />
                    {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        formErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+94 71 234 5678"
                    />
                    {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Tour Details */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Calendar size={20} className="text-amber-500" />
                  Tour Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tour Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        formErrors.date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.date && <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests *</label>
                    <select
                      name="numberOfGuests"
                      value={formData.numberOfGuests}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        formErrors.numberOfGuests ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      {Array.from({ length: tour.capacity }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                    {formErrors.numberOfGuests && <p className="text-red-500 text-xs mt-1">{formErrors.numberOfGuests}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Any special dietary needs, accessibility requirements, etc."
                    rows={3}
                  />
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h10m4 0a1 1 0 11-2 0m2 0a1 1 0 10-2 0m-4 0a1 1 0 11-2 0m2 0a1 1 0 10-2 0M3 7a1 1 0 011-1h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7z" />
                  </svg>
                  Payment Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        formErrors.cardNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.cardNumber && <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                          formErrors.cardExpiry ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.cardExpiry && <p className="text-red-500 text-xs mt-1">{formErrors.cardExpiry}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVC *</label>
                      <input
                        type="text"
                        name="cardCVC"
                        value={formData.cardCVC}
                        onChange={handleChange}
                        placeholder="123"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                          formErrors.cardCVC ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.cardCVC && <p className="text-red-500 text-xs mt-1">{formErrors.cardCVC}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name *</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      placeholder="Name on card"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        formErrors.cardName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.cardName && <p className="text-red-500 text-xs mt-1">{formErrors.cardName}</p>}
                  </div>
                </div>
              </div>

              {formErrors.submit && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700">
                  {formErrors.submit}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-400 hover:bg-amber-500 disabled:bg-gray-400 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {isSubmitting ? 'Processing...' : 'Complete Booking'}
              </button>
            </form>
          </div>

          {/* Booking Summary */}
          <div>
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Booking Summary</h3>

              <div className="mb-6">
                <img src={tour.image || "/api/placeholder/300/200"} alt={tour.name} className="w-full h-32 object-cover rounded-lg mb-4" />
                <h4 className="font-semibold text-gray-800 text-sm mb-2">{tour.name}</h4>
                <p className="text-xs text-gray-600">{tour.location}</p>
              </div>

              <div className="space-y-3 py-4 border-t border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price per person:</span>
                  <span className="font-semibold">Rs. {tour.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Number of guests:</span>
                  <span className="font-semibold">{formData.numberOfGuests}</span>
                </div>
                {formData.date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">{new Date(formData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                <span className="font-bold text-gray-800">Total:</span>
                <span className="text-2xl font-bold text-amber-600">Rs. {totalPrice.toLocaleString()}</span>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  ✓ Free cancellation up to 24 hours before tour<br />
                  ✓ No hidden charges<br />
                  ✓ Instant confirmation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
