import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import RoomBooking from "@/models/RoomBokking";

export async function PUT(request: Request) {
  try {
    await connectDB();
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({
        success: false,
        message: "Booking ID is required"
      }, { status: 400 });
    }

    const updatedBooking = await RoomBooking.findByIdAndUpdate(
      bookingId,
      { status: 'Checked-In' },
      { new: true }
    ).populate('room');

    if (!updatedBooking) {
      return NextResponse.json({
        success: false,
        message: "Booking not found"
      }, { status: 404 });
    }

    console.log('✅ Booking checked in:', bookingId);

    return NextResponse.json({
      success: true,
      message: "Booking checked in successfully",
      data: updatedBooking
    });
  } catch (error) {
    console.error("❌ Check-in error:", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error"
    }, { status: 500 });
  }
}
