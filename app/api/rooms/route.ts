import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Room from "@/models/Room";

export async function GET() {
  try {
    await connectDB();

    const rooms = await Room.find({});

    return NextResponse.json(
      {
        ok: true,
        rooms,
        count: rooms.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("/api/rooms error", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
