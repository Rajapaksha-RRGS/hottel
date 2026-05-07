import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectDB } from "@/lib/mongoose";
import FoodOrder from "@/models/FoodOrder";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    if (userRole !== "Admin" && userRole !== "Receptionist" && userRole !== "Manager") {
      return NextResponse.json({ error: "Unauthorized: Reception access required" }, { status: 403 });
    }

    const body = await req.json();
    const { roomBookingId, items, totalBill } = body;

    if (!roomBookingId || !items || items.length === 0 || !totalBill) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: roomBookingId, items, totalBill" },
        { status: 400 }
      );
    }

    const newOrder = await FoodOrder.create({
      roomBookingId,
      items,
      totalBill,
      orderStatus: "Pending",
    });

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error placing food order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to place order" },
      { status: 500 }
    );
  }
}
