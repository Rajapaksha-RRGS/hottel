import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectDB } from "@/lib/mongoose";
import RoomBooking from "@/models/RoomBokking";
import Room from "@/models/Room";
import FoodOrder from "@/models/FoodOrder";
import Gest from "@/models/Gest";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Please login first" },
        { status: 401 }
      );
    }

    const userRole = (session.user as any)?.role;

    if (userRole !== "Admin" && userRole !== "Receptionist" && userRole !== "Manager") {
      return NextResponse.json(
        { error: "Unauthorized: Reception access required" },
        { status: 403 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      // Room counts by status
      totalRooms,
      availableRooms,
      occupiedRooms,
      cleaningRooms,
      maintenanceRooms,
      // All rooms for room grid
      allRooms,
      // Booking stats
      totalBookings,
      checkedInBookings,
      confirmedBookings,
      // Today's activity
      todayCheckIns,
      todayCheckOuts,
      // Recent bookings (latest 10)
      recentBookings,
      // Pending food orders
      pendingFoodOrders,
      // Total guests
      totalGuests,
      // All bookings for guests/bookings panels
      allBookings,
    ] = await Promise.all([
      Room.countDocuments(),
      Room.countDocuments({ status: "Available" }),
      Room.countDocuments({ status: "Occupied" }),
      Room.countDocuments({ status: "Cleaning" }),
      Room.countDocuments({ status: "Maintenance" }),
      Room.find({}).lean(),
      RoomBooking.countDocuments(),
      RoomBooking.countDocuments({ status: "Checked-In" }),
      RoomBooking.countDocuments({ status: "Confirmed" }),
      RoomBooking.find({
        checkInDate: { $gte: today, $lt: tomorrow },
      })
        .populate("room")
        .sort({ checkInDate: 1 })
        .lean(),
      RoomBooking.find({
        checkOutDate: { $gte: today, $lt: tomorrow },
      })
        .populate("room")
        .sort({ checkOutDate: 1 })
        .lean(),
      RoomBooking.find({})
        .populate("room")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      FoodOrder.find({ orderStatus: "Pending" })
        .populate({
          path: "items.foodItem",
          select: "name price category prepTime",
        })
        .populate({
          path: "roomBookingId",
          select: "guestName room",
          populate: { path: "room", select: "roomNumber" },
        })
        .sort({ createdAt: -1 })
        .lean(),
      Gest.countDocuments({ isActive: true }),
      RoomBooking.find({})
        .populate("room")
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        roomStats: {
          total: totalRooms,
          available: availableRooms,
          occupied: occupiedRooms,
          cleaning: cleaningRooms,
          maintenance: maintenanceRooms,
        },
        rooms: allRooms,
        bookingStats: {
          total: totalBookings,
          checkedIn: checkedInBookings,
          confirmed: confirmedBookings,
        },
        todayCheckIns,
        todayCheckOuts,
        recentBookings,
        pendingFoodOrders,
        totalGuests,
        allBookings,
      },
    });
  } catch (error) {
    console.error("Error fetching reception stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch reception data",
      },
      { status: 500 }
    );
  }
}
