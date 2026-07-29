import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import RoomBooking from '@/models/RoomBokking';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const now = new Date();

    // Find all active room bookings where checkOutDate has passed or is today
    const result = await RoomBooking.updateMany(
      {
        status: { $in: ['Confirmed', 'Checked-In'] },
        checkOutDate: { $lte: now },
      },
      {
        $set: { status: 'Checked-Out' },
      }
    );

    return NextResponse.json({
      ok: true,
      message: `Auto check-out process completed. ${result.modifiedCount} booking(s) updated to Checked-Out.`,
      modifiedCount: result.modifiedCount,
      timestamp: now,
    });
  } catch (error: any) {
    console.error('Error in auto check-out process:', error);
    return NextResponse.json(
      { ok: false, message: 'Auto check-out process failed', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
