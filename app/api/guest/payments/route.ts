import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import RoomBooking from '@/models/RoomBokking';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json({ ok: false, message: 'Email is required' }, { status: 400 });
    }

    const bookings = await RoomBooking.find({ guestEmail: email })
      .populate('room', 'roomNumber type')
      .sort({ createdAt: -1 })
      .lean();

    const payments = bookings.map((b: any) => ({
      bookingId: b._id.toString(),
      roomType: b.room?.type || 'N/A',
      roomNumber: b.room?.roomNumber || 'N/A',
      checkInDate: b.checkInDate,
      checkOutDate: b.checkOutDate,
      totalAmount: b.totalAmount,
      advancePayment: b.advancePayment,
      paymentStatus: b.paymentStatus,
      bookingStatus: b.status,
      createdAt: b.createdAt,
    }));

    return NextResponse.json({ ok: true, payments });
  } catch (error) {
    console.error('Error fetching guest payments:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}
