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

    const body = await req.json();
    const { orderType, items, totalBill, roomBookingId, tableNumber } = body;

    // Validate required fields
    if (!orderType || !items || items.length === 0 || !totalBill) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: orderType, items, totalBill"
        },
        { status: 400 }
      );
    }

    // Validate orderType
    if (!['Room', 'Table'].includes(orderType)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid orderType. Must be 'Room' or 'Table'"
        },
        { status: 400 }
      );
    }

    // Validate Room order has roomBookingId
    if (orderType === 'Room' && !roomBookingId) {
      return NextResponse.json(
        {
          success: false,
          message: "Room orders require roomBookingId"
        },
        { status: 400 }
      );
    }

    // Validate Table order has tableNumber
    if (orderType === 'Table' && !tableNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Table orders require tableNumber"
        },
        { status: 400 }
      );
    }

    // Validate items structure
    for (const item of items) {
      if (!item.foodItem || !item.quantity || item.subTotal === undefined) {
        return NextResponse.json(
          {
            success: false,
            message: "Each item must have foodItem, quantity, and subTotal"
          },
          { status: 400 }
        );
      }
    }

    console.log("📦 Placing order:", {
      orderType,
      itemCount: items.length,
      totalBill,
      roomBookingId: roomBookingId || "N/A",
      tableNumber: tableNumber || "N/A"
    });

    // Create order object
    const orderPayload: any = {
      orderType,
      items,
      totalBill,
      orderStatus: "Pending"
    };

    // Add room or table reference
    if (orderType === 'Room') {
      orderPayload.roomBookingId = roomBookingId;
    } else if (orderType === 'Table') {
      orderPayload.tableNumber = tableNumber;
    }

    const newOrder = await FoodOrder.create(orderPayload);

    console.log("✅ Order created successfully:", newOrder._id);

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      data: {
        orderId: newOrder._id,
        orderType: newOrder.orderType,
        totalBill: newOrder.totalBill,
        orderStatus: newOrder.orderStatus
      }
    });
  } catch (error) {
    console.error("❌ Error placing food order:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to place order: " + (error instanceof Error ? error.message : "Unknown error")
      },
      { status: 500 }
    );
  }
}
