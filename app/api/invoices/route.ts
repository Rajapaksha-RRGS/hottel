import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectDB } from "@/lib/mongoose";
import RoomBooking from "@/models/RoomBokking";
import FoodOrder from "@/models/FoodOrder";
import TourBooking from "@/models/TourBooking";
import { authOptions } from "@/lib/auth";

interface InvoiceData {
  _id: string;
  guestId: string;
  guestName: string;
  guestType: "Room" | "External";
  roomNumber?: string;
  tableNumber?: string;
  roomCharge: number;
  foodTotal: number;
  tourTotal: number;
  grandTotal: number;
  paymentStatus: "Paid" | "Pending";
  bookingStatus?: string;
  lastUpdated: Date;
}

export async function GET(req: NextRequest) {
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
        { success: false, message: "Unauthorized: Access required" },
        { status: 403 }
      );
    }

    const searchQuery = req.nextUrl.searchParams.get("search") || "";
    const invoices: InvoiceData[] = [];

    // Fetch active room bookings (currently checked-in)
    const roomBookings = await RoomBooking.find({
      status: { $in: ["Confirmed", "Checked-In"] }
    }).lean();

    for (const booking of roomBookings) {
      // Skip if doesn't match search query
      if (
        searchQuery &&
        !booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !booking._id.toString().includes(searchQuery)
      ) {
        continue;
      }

      // Fetch food orders for this room (status: Served)
      const foodOrders = await FoodOrder.find({
        roomBookingId: booking._id,
        orderStatus: "Served",
        orderType: "Room"
      }).lean();

      const foodTotal = foodOrders.reduce((sum, order) => sum + order.totalBill, 0);

      // Fetch tour bookings (status: Completed)
      const tourBookings = await TourBooking.find({
        roomBookingId: booking._id,
        status: "Completed"
      }).lean();

      const tourTotal = tourBookings.reduce((sum, tour) => sum + tour.totalCost, 0);

      // Room charge is the base room price
      const roomCharge = booking.totalAmount || 0;

      const invoice: InvoiceData = {
        _id: booking._id.toString(),
        guestId: booking._id.toString(),
        guestName: booking.guestName,
        guestType: "Room",
        roomNumber: booking.room?.toString() || "",
        roomCharge,
        foodTotal,
        tourTotal,
        grandTotal: roomCharge + foodTotal + tourTotal,
        paymentStatus: booking.paymentStatus === "Paid" ? "Paid" : "Pending",
        bookingStatus: booking.status,
        lastUpdated: booking.updatedAt || new Date()
      };

      invoices.push(invoice);
    }

    // Fetch external guest invoices (table orders - walk-in guests)
    const tableOrders = await FoodOrder.find({
      orderType: "Table",
      orderStatus: "Served"
    }).lean();

    const externalInvoices = new Map<string, InvoiceData>();

    for (const order of tableOrders) {
      const tableKey = order.tableNumber || "Unknown";

      if (searchQuery && !tableKey.toLowerCase().includes(searchQuery.toLowerCase())) {
        continue;
      }

      if (!externalInvoices.has(tableKey)) {
        externalInvoices.set(tableKey, {
          _id: `table-${tableKey}`,
          guestId: `table-${tableKey}`,
          guestName: `Table ${tableKey}`,
          guestType: "External",
          tableNumber: tableKey,
          roomCharge: 0,
          foodTotal: 0,
          tourTotal: 0,
          grandTotal: 0,
          paymentStatus: "Pending",
          lastUpdated: new Date()
        });
      }

      const invoice = externalInvoices.get(tableKey)!;
      invoice.foodTotal += order.totalBill;
      invoice.grandTotal = invoice.foodTotal;
    }

    invoices.push(...externalInvoices.values());

    return NextResponse.json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    console.error("❌ Error fetching invoices:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch invoices: " + (error instanceof Error ? error.message : "Unknown error")
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
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
        { success: false, message: "Unauthorized: Access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { guestId, paymentStatus, guestType } = body;

    if (!guestId || !paymentStatus || !guestType) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: guestId, paymentStatus, guestType" },
        { status: 400 }
      );
    }

    if (!["Paid", "Pending", "Partially-Paid"].includes(paymentStatus)) {
      return NextResponse.json(
        { success: false, message: "Invalid payment status" },
        { status: 400 }
      );
    }

    // Only update room bookings, not external/table guests
    if (guestType === "Room") {
      const updated = await RoomBooking.findByIdAndUpdate(
        guestId,
        { paymentStatus },
        { new: true }
      );

      if (!updated) {
        return NextResponse.json(
          { success: false, message: "Booking not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Payment status updated successfully",
        data: {
          guestId,
          paymentStatus: updated.paymentStatus
        }
      });
    }

    return NextResponse.json({
      success: false,
      message: "External guest invoices cannot be marked as paid via API"
    });
  } catch (error) {
    console.error("❌ Error updating invoice:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update invoice: " + (error instanceof Error ? error.message : "Unknown error")
      },
      { status: 500 }
    );
  }
}
