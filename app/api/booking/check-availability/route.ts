import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Booking from "@/models/RoomBokking";
import mongoose from "mongoose";

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { roomId, checkInDate, checkOutDate } = body;

        // Validate roomId
        if (!roomId) {
            return NextResponse.json({
                ok: false,
                available: false,
                message: "Room ID is required"
            }, { status: 400 });
        }

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

        // Convert roomId to ObjectId if it's a valid MongoDB ID
        let roomObjectId: any = roomId;
        if (mongoose.Types.ObjectId.isValid(roomId)) {
            roomObjectId = new mongoose.Types.ObjectId(roomId);
        }

        // Check for overlapping bookings for THIS SPECIFIC ROOM ONLY
        // Only check confirmed and checked-in bookings (not cancelled)
        const overlappingBookings = await Booking.find({
            room: roomObjectId,
            status: { $ne: "Cancelled" },
            $or: [
                {
                    checkInDate: { $lt: end },
                    checkOutDate: { $gt: start }
                },
            ],
        });

        const isAvailable = overlappingBookings.length === 0;

        console.log(`📅 Availability check for room ${roomId}:`, {
            checkIn: start.toISOString(),
            checkOut: end.toISOString(),
            conflictingBookings: overlappingBookings.length,
            available: isAvailable
        });

        return NextResponse.json({
            ok: true,
            available: isAvailable,
            message: isAvailable
                ? "Dates are available for this room!"
                : "This room is already booked for selected dates. Please select different dates.",
            conflictingDates: !isAvailable ? overlappingBookings.map(b => ({
                checkIn: b.checkInDate,
                checkOut: b.checkOutDate,
                guestName: b.guestName
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
