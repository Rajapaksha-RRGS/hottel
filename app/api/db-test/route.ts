import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";

export async function GET() {
  try {
    const connection = await connectDB();

    // Check connection readyState (0=disconnected, 1=connected, 2=connecting, 3=disconnecting)
    if (connection.connection.readyState === 1) {
      return NextResponse.json({
        ok: true,
        message: "MongoDB connected successfully",
      });
    } else {
      return NextResponse.json(
        {
          ok: false,
          message: "MongoDB not connected",
          readyState: connection.connection.readyState,
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: "MongoDB connection failed", error: error.message },
      { status: 500 },
    );
  }
}