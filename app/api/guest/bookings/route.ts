import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import RoomBooking from '@/models/RoomBokking';
import Room from '@/models/Room';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json({ ok: false, message: 'Email is required' }, { status: 400 });
    }

    const bookings = await RoomBooking.find({ guestEmail: email })
      .populate('room')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ ok: true, bookings });
  } catch (error) {
    console.error('Error fetching guest bookings:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}
