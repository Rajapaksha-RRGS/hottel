import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Booking from "@/models/RoomBokking";
import Room from "@/models/Room";
import mongoose from "mongoose";

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { roomId, roomName, roomPrice, userId, userName, guests, checkInDate, checkOutDate } = body;

        console.log("📝 Booking attempt:", { roomId, roomName, userId, userName, guests, checkInDate, checkOutDate });

        // Validate each required field with specific error messages
        if (!roomId) {
            console.error("❌ Missing roomId");
            return NextResponse.json({
                ok: false,
                message: "Missing required booking information: Room ID"
            }, { status: 400 });
        }

        if (!userId) {
            console.error("❌ Missing userId");
            return NextResponse.json({
                ok: false,
                message: "Missing required booking information: User ID"
            }, { status: 400 });
        }

        if (!roomName) {
            console.error("❌ Missing roomName");
            return NextResponse.json({
                ok: false,
                message: "Missing required booking information: Room Name"
            }, { status: 400 });
        }

        if (roomPrice === undefined || roomPrice === null) {
            console.error("❌ Missing or invalid roomPrice");
            return NextResponse.json({
                ok: false,
                message: "Missing required booking information: Room Price"
            }, { status: 400 });
        }

        if (!checkInDate) {
            console.error("❌ Missing checkInDate");
            return NextResponse.json({
                ok: false,
                message: "Missing required booking information: Check-in Date"
            }, { status: 400 });
        }

        if (!checkOutDate) {
            console.error("❌ Missing checkOutDate");
            return NextResponse.json({
                ok: false,
                message: "Missing required booking information: Check-out Date"
            }, { status: 400 });
        }

        // Validate dates
        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            console.error("❌ Invalid date format");
            return NextResponse.json({
                ok: false,
                message: "Invalid date format"
            }, { status: 400 });
        }

        if (start >= end) {
            console.error("❌ Check-out date must be after check-in date");
            return NextResponse.json({
                ok: false,
                message: "Check-out date must be after check-in date"
            }, { status: 400 });
        }

        // Create booking object with proper types
        let roomObjectId;

        try {
            if (mongoose.Types.ObjectId.isValid(roomId)) {
                roomObjectId = new mongoose.Types.ObjectId(roomId);
            } else {
                roomObjectId = new mongoose.Types.ObjectId();
                console.log("⚠️  Creating virtual room reference for mock ID:", roomId);
            }
        } catch (err) {
            console.error("❌ Error creating ObjectId:", err);
            roomObjectId = new mongoose.Types.ObjectId();
        }

        // Calculate price
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const totalPrice = diffDays * (roomPrice || 0);

        console.log("💰 Booking price:", { pricePerNight: roomPrice, nights: diffDays, totalPrice });

        // Create booking
        const newBooking = new Booking({
            guestName: userName || "Guest",
            guestEmail: "guest@vitaminseahotel.com",
            guestPhone: "0000000000",
            room: roomObjectId,
            checkInDate: start,
            checkOutDate: end,
            numberOfGuests: guests || 1,
            totalAmount: totalPrice,
            advancePayment: 0,
            paymentStatus: "Pending",
            status: "Confirmed",
            notes: `Room: ${roomName} (ID: ${roomId}), Guests: ${guests || 1}`
        });

        const savedBooking = await newBooking.save();
        console.log("✅ Booking saved successfully:", savedBooking._id);

        return NextResponse.json({
            ok: true,
            message: "Booking created successfully!",
            data: {
                bookingId: savedBooking._id,
                roomName: roomName,
                totalPrice: totalPrice,
                nights: diffDays,
                checkIn: start.toLocaleDateString(),
                checkOut: end.toLocaleDateString()
            }
        }, { status: 201 });

    } catch (error) {
        console.error("❌ Booking error:", error);

        let errorMessage = "Internal server error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json({
            ok: false,
            message: errorMessage
        }, { status: 500 });
    }
}






