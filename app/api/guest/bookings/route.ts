import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import RoomBooking from '@/models/RoomBokking';
import '@/models/Room'; // Required for .populate('room')

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const email = request.nextUrl.searchParams.get('email');
    const name  = request.nextUrl.searchParams.get('name');

    if (!email) {
      return NextResponse.json({ ok: false, message: 'Email is required' }, { status: 400 });
    }

    // Auto-update expired bookings to 'Checked-Out'
    const now = new Date();
    await RoomBooking.updateMany(
      {
        status: { $in: ['Confirmed', 'Checked-In'] },
        checkOutDate: { $lte: now },
      },
      { $set: { status: 'Checked-Out' } }
    );

    const query: any = {
      $or: [
        { guestEmail: email },
        ...(name ? [{ guestEmail: 'guest@vitaminseahotel.com', guestName: name }] : []),
      ],
    };

    const bookings = await RoomBooking.find(query)
      .populate('room')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ ok: true, bookings });
  } catch (error) {
    console.error('Error fetching guest bookings:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}
