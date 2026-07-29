import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import TourBooking from '@/models/TourBooking';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const email = request.nextUrl.searchParams.get('email');
    const name  = request.nextUrl.searchParams.get('name');

    if (!email) {
      return NextResponse.json({ ok: false, message: 'Email is required' }, { status: 400 });
    }

    const query: any = {
      $or: [
        { email: email },
        ...(name ? [{ email: 'guest@vitaminseahotel.com', fullName: name }] : []),
      ],
    };

    const tourBookings = await TourBooking.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ ok: true, tourBookings });
  } catch (error) {
    console.error('Error fetching guest tour bookings:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}
