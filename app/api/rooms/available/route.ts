import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongoose";
import Booking from "@/models/RoomBokking";
import Room from "@/models/Room";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    if (!checkIn || !checkOut) {
      return NextResponse.json({
        ok: false,
        message: "Dates required"
      }, { status: 400 });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    // Find overlapping bookings
    const overlappingBookings = await Booking.find({
      checkInDate: { $lt: end },
      checkOutDate: { $gt: start },
      status: { $ne: "Cancelled" }
    }).select("room");

    // Convert Room IDs to ObjectId
    const bookedRoomIds = overlappingBookings
      .map((b) => b.room)
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id.toString()));

    console.log("🔍 Booked Room IDs found:", bookedRoomIds);

    // Find available rooms
    const availableRooms = await Room.find({
      _id: { $nin: bookedRoomIds },
    });

    console.log("✅ Available Rooms Count:", availableRooms.length);

    return NextResponse.json({
      ok: true,
      rooms: availableRooms,
      count: availableRooms.length,
      checkIn,
      checkOut
    }, { status: 200 });

  } catch (error) {
    console.error("❌ API ERROR:", error);
    return NextResponse.json({
      ok: false,
      message: "Internal Server Error"
    }, { status: 500 });
  }
}