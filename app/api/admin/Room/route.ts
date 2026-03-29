import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Room from "@/models/Room";

// GET - Fetch all rooms
export async function GET() {
  try {
    await connectDB();
    const rooms = await Room.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      ok: true,
      data: rooms,
      message: "Rooms fetched successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to fetch rooms",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST - Create a new room
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const {
      roomNumber,
      type,
      status,
      pricePerNight,
      amenities,
      maxOccupancy,
      description,
      images,
    } = body;

    // Validation
    if (!roomNumber || !type || !pricePerNight) {
      return NextResponse.json(
        {
          ok: false,
          message: "Room number, type, and price are required",
        },
        { status: 400 }
      );
    }

    // Check if room number already exists
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return NextResponse.json(
        {
          ok: false,
          message: "Room number already exists",
        },
        { status: 409 }
      );
    }

    // Create new room
    const newRoom = await Room.create({
      roomNumber,
      type,
      status: status || "Available",
      pricePerNight,
      amenities: amenities || [],
      maxOccupancy: maxOccupancy || 2,
      description: description || "",
      images: images || [],
      lastCleaned: new Date(),
    });

    return NextResponse.json(
      {
        ok: true,
        data: newRoom,
        message: "Room created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          ok: false,
          message: "Validation error",
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        message: "Failed to create room",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
