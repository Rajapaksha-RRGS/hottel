import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import TourBooking from '@/models/TourBooking';
import TourPackage from '@/models/TourPackage';

// GET: Fetch all tour bookings (for admin)
export async function GET() {
  try {
    await connectDB();
    const bookings = await TourBooking.find({})
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ ok: true, bookings, count: bookings.length });
  } catch (error) {
    console.error('GET /api/tours/booking error:', error);
    return NextResponse.json({ ok: false, message: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// POST: Create a new tour booking
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const { fullName, email, phone, tourPackageId, tourName, numberOfPeople, bookingDate, totalCost, specialRequests } = body;

    // Validate required fields
    if (!fullName || !email || !phone || !tourPackageId || !numberOfPeople || !bookingDate || !totalCost) {
      return NextResponse.json(
        { ok: false, message: 'Missing required booking fields' },
        { status: 400 }
      );
    }

    // Ensure tour package exists
    const tourPackage = await TourPackage.findById(tourPackageId);
    if (!tourPackage) {
      return NextResponse.json({ ok: false, message: 'Tour package not found' }, { status: 404 });
    }

    // Check capacity
    if (tourPackage.booked + numberOfPeople > tourPackage.capacity) {
      return NextResponse.json({ ok: false, message: 'Not enough capacity for this tour' }, { status: 400 });
    }

    // Create booking
    const booking = await TourBooking.create({
      fullName,
      email,
      phone,
      tourPackageId,
      tourName: tourName || tourPackage.name,
      numberOfPeople: Number(numberOfPeople),
      bookingDate: new Date(bookingDate),
      totalCost: Number(totalCost),
      specialRequests: specialRequests || '',
      status: 'Scheduled',
    });

    // Increment booked count on tour package
    await TourPackage.findByIdAndUpdate(tourPackageId, {
      $inc: { booked: Number(numberOfPeople) },
    });

    return NextResponse.json(
      { ok: true, booking, message: 'Tour booking created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('POST /api/tours/booking error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json({ ok: false, message: messages.join(', ') }, { status: 400 });
    }
    return NextResponse.json(
      { ok: false, message: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}

// PATCH: Update tour booking status
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { bookingId, status } = body;

    if (!bookingId || !status) {
      return NextResponse.json(
        { ok: false, message: 'Booking ID and status are required' },
        { status: 400 }
      );
    }

    const updatedBooking = await TourBooking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json(
        { ok: false, message: 'Tour booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      booking: updatedBooking,
      message: `Tour booking status updated to ${status}`,
    });
  } catch (error: any) {
    console.error('PATCH /api/tours/booking error:', error);
    return NextResponse.json(
      { ok: false, message: 'Failed to update tour booking status' },
      { status: 500 }
    );
  }
}

