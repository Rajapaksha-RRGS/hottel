import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Booking from "@/models/RoomBokking";

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { roomId, checkInDate, checkOutDate } = body;

        // Validate dates
        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);

        if (start >= end) {
            return NextResponse.json({
                ok: false,
                available: false,
                message: "Invalid date range"
            }, { status: 400 });
        }

        // Check for overlapping bookings
        const overlappingBookings = await Booking.find({
            $or: [
                {
                    checkInDate: { $lt: end },
                    checkOutDate: { $gt: start }
                },
            ],
        });

        const isAvailable = overlappingBookings.length === 0;

        return NextResponse.json({
            ok: true,
            available: isAvailable,
            message: isAvailable ? "Dates are available!" : "Dates are not available. Please select different dates.",
            conflictingDates: !isAvailable ? overlappingBookings.map(b => ({
                checkIn: b.checkInDate,
                checkOut: b.checkOutDate
            })) : []
        }, { status: 200 });

    } catch (error) {
        console.error("Availability check error:", error);
        return NextResponse.json({
            ok: false,
            available: false,
            message: "Error checking availability"
        }, { status: 500 });
    }
}
