import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Booking from "@/models/RoomBokking";
import Room from "@/models/Room";
import mongoose from "mongoose";
import { sendBookingConfirmationEmail } from "@/lib/email";

export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const year = searchParams.get("year");
        const month = searchParams.get("month");

        let query: any = {
            status: { $ne: "Cancelled" }
        };

        // Filter by year and month if provided
        if (year && month) {
            const startDate = new Date(Number(year), Number(month) - 1, 1);
            const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);

            query = {
                ...query,
                $or: [
                    { checkInDate: { $gte: startDate, $lte: endDate } },
                    { checkOutDate: { $gte: startDate, $lte: endDate } },
                    { checkInDate: { $lt: startDate }, checkOutDate: { $gt: endDate } }
                ]
            };
        }

        const bookings = await Booking.find(query)
            .populate("room", "roomNumber type")
            .sort({ checkInDate: 1 });

        return NextResponse.json({
            ok: true,
            bookings,
            count: bookings.length
        }, { status: 200 });

    } catch (error) {
        console.error("❌ Get bookings error:", error);
        return NextResponse.json({
            ok: false,
            message: "Failed to fetch bookings"
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        // ─── Destructure – now includes userEmail & userPhone ──────────────
        const {
            roomId,
            roomName,
            roomPrice,
            userId,
            userName,
            userEmail,      // ← Guest's real email (was missing before)
            userPhone,      // ← Guest's phone (optional)
            guests,
            checkInDate,
            checkOutDate,
            specialRequests,
        } = body;

        console.log("📝 Booking attempt:", { roomId, roomName, userEmail, userName, guests });

        // ─── Validation ────────────────────────────────────────────────────
        if (!roomId) return NextResponse.json({ ok: false, message: "Missing: Room ID" }, { status: 400 });
        if (!userId) return NextResponse.json({ ok: false, message: "Missing: User ID" }, { status: 400 });
        if (!roomName) return NextResponse.json({ ok: false, message: "Missing: Room Name" }, { status: 400 });
        if (!userEmail) return NextResponse.json({ ok: false, message: "Missing: Guest email" }, { status: 400 });
        if (roomPrice === undefined || roomPrice === null) return NextResponse.json({ ok: false, message: "Missing: Room Price" }, { status: 400 });
        if (!checkInDate) return NextResponse.json({ ok: false, message: "Missing: Check-in Date" }, { status: 400 });
        if (!checkOutDate) return NextResponse.json({ ok: false, message: "Missing: Check-out Date" }, { status: 400 });

        const start = new Date(checkInDate);
        const end   = new Date(checkOutDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return NextResponse.json({ ok: false, message: "Invalid date format" }, { status: 400 });
        }
        if (start >= end) {
            return NextResponse.json({ ok: false, message: "Check-out must be after check-in" }, { status: 400 });
        }

        // ─── Resolve Room ObjectId ─────────────────────────────────────────
        let roomObjectId: mongoose.Types.ObjectId;
        try {
            roomObjectId = mongoose.Types.ObjectId.isValid(roomId)
                ? new mongoose.Types.ObjectId(roomId)
                : new mongoose.Types.ObjectId();
        } catch {
            roomObjectId = new mongoose.Types.ObjectId();
        }

        // ─── Resolve real Room document for email (optional enrichment) ────
        let resolvedRoom: { roomNumber: string; type: string } | null = null;
        try {
            if (mongoose.Types.ObjectId.isValid(roomId)) {
                resolvedRoom = await Room.findById(roomObjectId).select('roomNumber type').lean() as any;
            }
        } catch { /* non-fatal */ }

        // ─── Calculate price ───────────────────────────────────────────────
        const nights      = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const totalAmount = nights * (roomPrice || 0);

        console.log("💰 Price:", { pricePerNight: roomPrice, nights, totalAmount });

        // ─── Save Booking ──────────────────────────────────────────────────
        const newBooking = new Booking({
            guestName:      userName  || "Guest",
            guestEmail:     userEmail,                          // ← Real email saved
            guestPhone:     userPhone || "Not provided",
            room:           roomObjectId,
            checkInDate:    start,
            checkOutDate:   end,
            numberOfGuests: guests || 1,
            totalAmount,
            advancePayment: 0,
            paymentStatus:  "Pending",
            status:         "Confirmed",
            specialRequests: specialRequests || "",
            notes: `Room: ${roomName} (ID: ${roomId}), Guests: ${guests || 1}`,
        });

        const saved = await newBooking.save();
        console.log("✅ Booking saved:", saved._id);

        // ─── Send Confirmation Email (non-blocking – errors logged, not thrown) ──
        const bookingRef = saved._id.toString().slice(-8).toUpperCase();
        try {
            await sendBookingConfirmationEmail({
                guestName:      userName || "Guest",
                guestEmail:     userEmail,
                bookingId:      bookingRef,
                roomType:       resolvedRoom?.type  || roomName,
                roomNumber:     resolvedRoom?.roomNumber || roomId,
                checkInDate:    start.toISOString(),
                checkOutDate:   end.toISOString(),
                numberOfGuests: guests || 1,
                totalAmount,
                nights,
            });
        } catch (emailErr) {
            // Email failure must NOT fail the booking response
            console.error("⚠️  Email send failed (booking still confirmed):", emailErr);
        }

        return NextResponse.json({
            ok: true,
            message: "Booking confirmed! A confirmation email has been sent.",
            data: {
                bookingId:  saved._id,
                bookingRef,
                roomName,
                totalAmount,
                nights,
                checkIn:    start.toLocaleDateString(),
                checkOut:   end.toLocaleDateString(),
            },
        }, { status: 201 });

    } catch (error) {
        console.error("❌ Booking error:", error);
        return NextResponse.json({
            ok: false,
            message: error instanceof Error ? error.message : "Internal server error",
        }, { status: 500 });
    }
}
