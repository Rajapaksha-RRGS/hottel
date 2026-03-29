import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongoose";
// පරෙස්සම් වන්න: ෆයිල් එකේ නම නිවැරදිව දෙන්න (උදා: @/models/RoomBooking)
import Booking from "@/models/RoomBokking"; 
import Room from "@/models/Room";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    if (!checkIn || !checkOut) {
      return NextResponse.json({ message: "Dates required" }, { status: 400 });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    // 1. Overlapping Bookings සොයා ගැනීම
    const overlappingBookings = await Booking.find({
      checkInDate: { $lt: end },
      checkOutDate: { $gt: start },
      status: { $ne: "Cancelled" } // "Confirmed" ඒවා මෙතනට අහුවෙනවා
    }).select("room");

    // 2. වැදගත්ම කොටස: Room IDs ටික නිවැරදිව ObjectId බවට පත් කිරීම
    const bookedRoomIds = overlappingBookings
      .map((b) => b.room)
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id.toString()));

    console.log("🔍 Booked Room IDs found:", bookedRoomIds);

    // 3. Available Rooms සෙවීම
    const availableRooms = await Room.find({
      _id: { $nin: bookedRoomIds },
    });

    console.log("✅ Available Rooms Count:", availableRooms.length);

    return NextResponse.json(availableRooms, { status: 200 });

  } catch (error) {
    console.error("❌ API ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}