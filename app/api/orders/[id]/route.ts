import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectDB } from "@/lib/mongoose";
import FoodOrder from "@/models/FoodOrder";
import { authOptions } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please login" },
        { status: 401 }
      );
    }

    const userRole = (session.user as any)?.role;
    if (userRole !== "Admin" && userRole !== "Receptionist" && userRole !== "Manager") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Reception access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { orderStatus } = body;

    if (!orderStatus) {
      return NextResponse.json(
        { success: false, message: "Order status is required" },
        { status: 400 }
      );
    }

    const validStatuses = ["Pending", "Served", "Billed"];
    if (!validStatuses.includes(orderStatus)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updatedOrder = await FoodOrder.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    )
      .populate({
        path: "items.foodItem",
        select: "name price category prepTime",
      })
      .populate({
        path: "roomBookingId",
        select: "guestName room",
        populate: { path: "room", select: "roomNumber" },
      });

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    console.log(`✅ Order ${id} marked as ${orderStatus}`);

    return NextResponse.json({
      success: true,
      message: `Order marked as ${orderStatus}`,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("❌ Error updating order:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update order: " + (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 500 }
    );
  }
}
