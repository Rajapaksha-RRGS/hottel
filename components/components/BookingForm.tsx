'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, DollarSign, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { IRoom as Room } from '@/models/Room';
import { useSession } from 'next-auth/react';

interface BookingFormProps {
  room: Room;
  onSuccess?: () => void;
  onClose?: () => void;
  defaultCheckIn?: string;
  defaultCheckOut?: string;
}

type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'unavailable' | 'error';

// Helper: Get today's date in YYYY-MM-DD format
const getToday = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Helper: Get tomorrow's date in YYYY-MM-DD format
const getTomorrow = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

export default function BookingForm({ room, onSuccess, defaultCheckIn, defaultCheckOut }: BookingFormProps) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Initialize dates: use props if provided, otherwise today/tomorrow
  const [checkInDate, setCheckInDate] = useState(() => defaultCheckIn || getToday());
  const [checkOutDate, setCheckOutDate] = useState(() => defaultCheckOut || getTomorrow());
  const [guests, setGuests] = useState(1);
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>('idle');
  const [availabilityMessage, setAvailabilityMessage] = useState<string>('');

  // Calculate total price
  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const pricePerNight = room.pricePerNight || 0;
    return diffDays * pricePerNight;
  };

  const totalPrice = calculateTotal();

  // Get minimum check-in date (today)
  const today = new Date().toISOString().split('T')[0];

  // Check availability function
  const checkAvailability = useCallback(async (inDate: string, outDate: string) => {
    if (!inDate || !outDate) {
      setAvailabilityStatus('idle');
      setAvailabilityMessage('');
      return;
    }

    setAvailabilityStatus('checking');
    setAvailabilityMessage('Checking availability...');

    try {
      const roomId = room._id?.toString() || room.roomNumber;

      if (!roomId) {
        setAvailabilityStatus('error');
        setAvailabilityMessage('Error: Room information not available');
        console.error('Missing roomId in room object:', room);
        return;
      }
      const response = await fetch('/api/booking/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: roomId,
          checkInDate: new Date(inDate).toISOString(),
          checkOutDate: new Date(outDate).toISOString(),
        }),
      });

      const data = await response.json();

      if (data.available) {
        setAvailabilityStatus('available');
        setAvailabilityMessage('✅ ' + data.message);
        setError(null);
      } else {
        setAvailabilityStatus('unavailable');
        setAvailabilityMessage('❌ ' + data.message);
      }
    } catch (err) {
      setAvailabilityStatus('error');
      setAvailabilityMessage('Error checking availability');
      console.error('Availability check error:', err);
    }
  }, [room.roomNumber, room._id]);

  // Auto-check availability on mount when dates are pre-filled
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      checkAvailability(checkInDate, checkOutDate);
    }
  }, []); // Run once on mount

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setCheckInDate(date);
    if (checkOutDate && new Date(date) >= new Date(checkOutDate)) {
      setCheckOutDate('');
      setAvailabilityStatus('idle');
    } else if (checkOutDate) {
      checkAvailability(date, checkOutDate);
    }
    setError(null);
  };

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setCheckOutDate(date);
    if (checkInDate) {
      checkAvailability(checkInDate, date);
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Detailed validation
    if (!checkInDate) {
      setError('Please select Check-in Date');
      return;
    }

    if (!checkOutDate) {
      setError('Please select Check-out Date');
      return;
    }

    const maxOccupancy = room.maxOccupancy || 2;
    if (guests < 1 || guests > maxOccupancy) {
      setError(`Guests must be between 1 and ${maxOccupancy}`);
      return;
    }

    if (status === 'unauthenticated') {
      setError('Please log in to make a booking');
      return;
    }

    if (availabilityStatus !== 'available') {
      setError('Please select dates that are available');
      return;
    }

    // Map room properties
    const roomId = room._id?.toString() || room.roomNumber;
    const roomName = `${room.type} – Room ${room.roomNumber}`;
    const roomPrice = room.pricePerNight;

    // Validate required room data
    if (!roomId) {
      setError('Room ID is missing');
      return;
    }

    if (!roomPrice || roomPrice <= 0) {
      setError('Room price is invalid');
      return;
    }

    // Validate dates format and values
    const checkInDateTime = new Date(checkInDate).getTime();
    const checkOutDateTime = new Date(checkOutDate).getTime();

    if (isNaN(checkInDateTime) || isNaN(checkOutDateTime)) {
      setError('Invalid date format');
      return;
    }

    if (checkInDateTime >= checkOutDateTime) {
      setError('Check-out date must be after check-in date');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        roomId,
        roomName,
        roomPrice,
        userId:    session?.user?.id    || "temp-" + Date.now(),
        userName:  session?.user?.name  || "Guest",
        userEmail: session?.user?.email || "",   // ← Real email for DB + confirmation
        guests,
        checkInDate:  new Date(checkInDate).toISOString(),
        checkOutDate: new Date(checkOutDate).toISOString(),
      };

      console.log('📤 Booking payload:', payload);

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Booking failed. Please try again.');
        return;
      }

      setSuccess(true);
      setCheckInDate('');
      setCheckOutDate('');
      setGuests(1);
      setAvailabilityStatus('idle');

      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100"
    >
      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-400 text-green-800 px-4 py-4 rounded-lg space-y-2"
        >
          <p className="font-semibold">✅ Booking confirmed! A confirmation email has been sent.</p>
          <a
            href="/guest/dashboard"
            className="inline-block mt-1 text-sm underline text-green-700 hover:text-green-900"
          >
            → View booking in your dashboard
          </a>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm"
        >
          ⚠️ {error}
        </motion.div>
      )}

     {/* Check-in Date */}
<div className="space-y-2">
  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700"> {/* text-black-700 වෙනුවට text-slate-700 */}
    <Calendar className="w-4 h-4 text-purple-600" />
    Check-in Date
  </label>
  <input
    type="date"
    min={today}
    value={checkInDate}
    onChange={handleCheckInChange}
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-black" 
    required
  />
</div>

{/* Check-out Date */}
<div className="space-y-2">
  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
    <Calendar className="w-4 h-4 text-purple-600" />
    Check-out Date
  </label>
  <input
    type="date"
    min={checkInDate || today}
    value={checkOutDate}
    onChange={handleCheckOutChange}
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-black"
    required
  />
</div>

      {/* Availability Status */}
      {availabilityMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition ${
            availabilityStatus === 'available'
              ? 'bg-green-50 border border-green-300 text-green-700'
              : availabilityStatus === 'checking'
              ? 'bg-blue-50 border border-blue-300 text-blue-700'
              : availabilityStatus === 'unavailable'
              ? 'bg-orange-50 border border-orange-300 text-orange-700'
              : 'bg-red-50 border border-red-300 text-red-700'
          }`}
        >
          {availabilityStatus === 'checking' && <Loader className="w-4 h-4 animate-spin" />}
          {availabilityStatus === 'available' && <CheckCircle className="w-4 h-4" />}
          {availabilityStatus === 'unavailable' && <AlertCircle className="w-4 h-4" />}
          {availabilityStatus === 'error' && <AlertCircle className="w-4 h-4" />}
          {availabilityMessage}
        </motion.div>
      )}

      {/* Guests */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Users className="w-4 h-4 text-purple-600" />
          Number of Guests
        </label>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-slate-900 bg-white"
        >
          {Array.from({ length: room.maxOccupancy || 2 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? 'Guest' : 'Guests'}
            </option>
          ))}
        </select>
      </div>

      {/* Price Breakdown */}
      {totalPrice > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border-2 border-purple-200 rounded-lg p-4 space-y-2"
        >
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Price per night:</span>
            <span className="font-semibold text-gray-900">${room.pricePerNight}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Number of nights:</span>
            <span className="font-semibold text-gray-900">
              {Math.ceil(
                Math.abs(new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between">
            <span className="flex items-center gap-2 font-bold text-gray-900">
              <DollarSign className="w-4 h-4 text-purple-600" />
              Total Price:
            </span>
            <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
              ${totalPrice}
            </span>
          </div>
        </motion.div>
      )}

      {/* Auth Status */}
      {status === 'unauthenticated' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm"
        >
          📝 Please log in to complete your booking
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={
          loading || 
          status === 'unauthenticated' || 
          availabilityStatus !== 'available' ||
          !checkInDate ||
          !checkOutDate
        }
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
      >
        {loading && <Loader className="w-5 h-5 animate-spin" />}
        {loading ? 'Processing...' : success ? 'Booking Confirmed!' : 'Complete Booking'}
      </motion.button>

      {/* Terms */}
      <p className="text-xs text-gray-600 text-center">
        By booking, you agree to our cancellation policy and terms of service.
      </p>
    </motion.form>
  );
}
