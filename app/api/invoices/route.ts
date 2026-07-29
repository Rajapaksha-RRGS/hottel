import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectDB } from "@/lib/mongoose";
import RoomBooking from "@/models/RoomBokking";
import FoodOrder from "@/models/FoodOrder";
import TourBooking from "@/models/TourBooking";
import { authOptions } from "@/lib/auth";

export interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export interface InvoiceData {
  _id: string;
  guestId: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  guestType: "Room" | "External";
  roomNumber?: string;
  tableNumber?: string;
  checkInDate?: string;
  checkOutDate?: string;
  numberOfGuests?: number;
  nights?: number;

  roomCharge: number;
  foodTotal: number;
  tourTotal: number;
  grandTotal: number;
  advancePayment: number;
  balanceDue: number;

  foodItems: InvoiceItem[];
  tourItems: InvoiceItem[];

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
    if (
      userRole !== "Admin" &&
      userRole !== "Receptionist" &&
      userRole !== "Manager"
    ) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Access required" },
        { status: 403 }
      );
    }

    const searchQuery = req.nextUrl.searchParams.get("search") || "";
    const statusFilter = req.nextUrl.searchParams.get("status") || "Pending"; // Pending | Paid | All
    const typeFilter = req.nextUrl.searchParams.get("type") || "All"; // All | Room | External

    const invoices: InvoiceData[] = [];

    // ── Room Bookings ────────────────────────────────────────────────────
    if (typeFilter === "All" || typeFilter === "Room") {
      const roomStatusFilter: any = { status: { $in: ["Confirmed", "Checked-In"] } };
      if (statusFilter === "Pending")
        roomStatusFilter.paymentStatus = { $in: ["Pending", "Partially-Paid"] };
      else if (statusFilter === "Paid") roomStatusFilter.paymentStatus = "Paid";

      const roomBookings = await RoomBooking.find(roomStatusFilter)
        .populate("room", "roomNumber roomType pricePerNight")
        .lean();

      for (const booking of roomBookings) {
        if (
          searchQuery &&
          !booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !booking._id.toString().includes(searchQuery) &&
          !(booking.room as any)?.roomNumber
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
        ) {
          continue;
        }

        // Food orders for this room
        const foodOrders = await FoodOrder.find({
          roomBookingId: booking._id,
          orderStatus: { $in: ["Served", "Billed"] },
          orderType: "Room",
        })
          .populate("items.foodItem", "name price")
          .lean();

        const foodItems: InvoiceItem[] = [];
        let foodTotal = 0;
        for (const order of foodOrders) {
          for (const item of order.items) {
            const fi = item.foodItem as any;
            foodItems.push({
              name: fi?.name || "Food Item",
              quantity: item.quantity,
              unitPrice: fi?.price || 0,
              subTotal: item.subTotal,
            });
            foodTotal += item.subTotal;
          }
        }

        // Tour bookings for this room (Confirmed or Completed)
        const tourBookings = await TourBooking.find({
          $or: [
            { roomBookingId: booking._id },
            { email: booking.guestEmail },
            { fullName: booking.guestName }
          ],
          status: { $in: ["Confirmed", "Completed"] },
        }).lean();

        const tourItems: InvoiceItem[] = [];
        let tourTotal = 0;
        for (const tour of tourBookings) {
          tourItems.push({
            name: tour.tourName || "Tour Package",
            quantity: tour.numberOfPeople || 1,
            unitPrice: (tour.totalCost && tour.numberOfPeople) ? tour.totalCost / tour.numberOfPeople : tour.totalCost,
            subTotal: tour.totalCost,
          });
          tourTotal += tour.totalCost;
        }

        const roomCharge = booking.totalAmount || 0;
        const advancePayment = booking.advancePayment || 0;
        const grandTotal = roomCharge + foodTotal + tourTotal;
        const balanceDue = Math.max(0, grandTotal - advancePayment);

        // Compute nights
        const checkIn = booking.checkInDate ? new Date(booking.checkInDate) : null;
        const checkOut = booking.checkOutDate ? new Date(booking.checkOutDate) : null;
        const nights =
          checkIn && checkOut
            ? Math.max(
                1,
                Math.ceil(
                  (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
                )
              )
            : 1;

        const roomObj = booking.room as any;

        invoices.push({
          _id: booking._id.toString(),
          guestId: booking._id.toString(),
          guestName: booking.guestName,
          guestEmail: booking.guestEmail,
          guestPhone: booking.guestPhone,
          guestType: "Room",
          roomNumber:
            roomObj?.roomNumber || booking.room?.toString() || "",
          checkInDate: booking.checkInDate?.toISOString(),
          checkOutDate: booking.checkOutDate?.toISOString(),
          numberOfGuests: booking.numberOfGuests,
          nights,
          roomCharge,
          foodTotal,
          tourTotal,
          grandTotal,
          advancePayment,
          balanceDue,
          foodItems,
          tourItems,
          paymentStatus: booking.paymentStatus === "Paid" ? "Paid" : "Pending",
          bookingStatus: booking.status,
          lastUpdated: booking.updatedAt || new Date(),
        });
      }
    }

    // ── External / Table Orders ──────────────────────────────────────────
    if (typeFilter === "All" || typeFilter === "External") {
      const tableStatusFilter: any = { orderType: "Table" };
      if (statusFilter === "Pending")
        tableStatusFilter.orderStatus = { $in: ["Pending", "Served"] };
      else if (statusFilter === "Paid")
        tableStatusFilter.orderStatus = "Billed";
      else tableStatusFilter.orderStatus = { $in: ["Pending", "Served", "Billed"] };

      const tableOrders = await FoodOrder.find(tableStatusFilter)
        .populate("items.foodItem", "name price")
        .lean();

      const externalMap = new Map<string, InvoiceData>();

      for (const order of tableOrders) {
        const tableKey = order.tableNumber || "Unknown";

        if (
          searchQuery &&
          !tableKey.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          continue;
        }

        if (!externalMap.has(tableKey)) {
          externalMap.set(tableKey, {
            _id: `table-${tableKey}`,
            guestId: `table-${tableKey}`,
            guestName: `Table ${tableKey}`,
            guestType: "External",
            tableNumber: tableKey,
            roomCharge: 0,
            foodTotal: 0,
            tourTotal: 0,
            grandTotal: 0,
            advancePayment: 0,
            balanceDue: 0,
            foodItems: [],
            tourItems: [],
            paymentStatus: "Pending",
            lastUpdated: new Date(),
          });
        }

        const inv = externalMap.get(tableKey)!;
        const isBilled = order.orderStatus === "Billed";

        // Mark as Paid only if ALL orders for this table are billed
        if (!isBilled) inv.paymentStatus = "Pending";

        for (const item of order.items) {
          const fi = item.foodItem as any;
          const existingIdx = inv.foodItems.findIndex(
            (fi2) => fi2.name === (fi?.name || "Food Item")
          );
          if (existingIdx >= 0) {
            inv.foodItems[existingIdx].quantity += item.quantity;
            inv.foodItems[existingIdx].subTotal += item.subTotal;
          } else {
            inv.foodItems.push({
              name: fi?.name || "Food Item",
              quantity: item.quantity,
              unitPrice: fi?.price || 0,
              subTotal: item.subTotal,
            });
          }
          inv.foodTotal += item.subTotal;
        }
        inv.grandTotal = inv.foodTotal;
        inv.balanceDue = inv.grandTotal;
        if (order.updatedAt && new Date(order.updatedAt) > new Date(inv.lastUpdated)) {
          inv.lastUpdated = order.updatedAt;
        }
      }

      // Re-check if all orders for a table are billed -> mark as Paid
      for (const [tableKey, inv] of externalMap.entries()) {
        const allOrders = await FoodOrder.find({
          orderType: "Table",
          tableNumber: tableKey,
          orderStatus: { $in: ["Served", "Pending", "Billed"] },
        })
          .select("orderStatus")
          .lean();

        const nonBilled = allOrders.filter((o) => o.orderStatus !== "Billed");
        inv.paymentStatus = nonBilled.length === 0 ? "Paid" : "Pending";
        if (statusFilter === "Paid" && inv.paymentStatus !== "Paid") continue;
        if (statusFilter === "Pending" && inv.paymentStatus !== "Pending") continue;
        invoices.push(inv);
      }

      if (statusFilter !== "All") {
        // Remove wrong-status table entries that may have slipped in
        const toRemove = invoices.filter(
          (inv) =>
            inv.guestType === "External" &&
            ((statusFilter === "Paid" && inv.paymentStatus !== "Paid") ||
              (statusFilter === "Pending" && inv.paymentStatus !== "Pending"))
        );
        toRemove.forEach((inv) => {
          const idx = invoices.indexOf(inv);
          if (idx > -1) invoices.splice(idx, 1);
        });
      }
    }

    return NextResponse.json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    console.error("❌ Error fetching invoices:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch invoices: " +
          (error instanceof Error ? error.message : "Unknown error"),
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
    if (
      userRole !== "Admin" &&
      userRole !== "Receptionist" &&
      userRole !== "Manager"
    ) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { guestId, paymentStatus, guestType } = body;

    if (!guestId || !paymentStatus || !guestType) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["Paid", "Pending", "Partially-Paid"].includes(paymentStatus)) {
      return NextResponse.json(
        { success: false, message: "Invalid payment status" },
        { status: 400 }
      );
    }

    // ── Room Booking Payment ──────────────────────────────────────────────
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

      let foodOrdersBilledCount = 0;
      let tourBookingsCompletedCount = 0;

      // Mark all associated food orders as Billed & confirmed tours as Completed when marking as Paid
      if (paymentStatus === "Paid") {
        const foodRes = await FoodOrder.updateMany(
          { roomBookingId: guestId, orderStatus: { $in: ["Pending", "Served"] } },
          { orderStatus: "Billed" }
        );
        foodOrdersBilledCount = foodRes.modifiedCount;

        const tourRes = await TourBooking.updateMany(
          {
            $or: [
              { roomBookingId: guestId },
              { email: updated.guestEmail },
              { fullName: updated.guestName }
            ],
            status: "Confirmed"
          },
          { status: "Completed" }
        );
        tourBookingsCompletedCount = tourRes.modifiedCount;
      }

      return NextResponse.json({
        success: true,
        message: "Payment status updated and saved to Database successfully",
        data: {
          guestId,
          paymentStatus: updated.paymentStatus,
          dbUpdates: {
            roomBookingPaid: true,
            foodOrdersBilledCount,
            tourBookingsCompletedCount
          }
        },
      });
    }

    // ── External / Table Order Payment ────────────────────────────────────
    if (guestType === "External") {
      // guestId format: "table-{tableNumber}"
      const tableNumber = guestId.replace("table-", "");

      const newOrderStatus = paymentStatus === "Paid" ? "Billed" : "Served";

      const result = await FoodOrder.updateMany(
        {
          orderType: "Table",
          tableNumber,
          orderStatus: { $in: ["Pending", "Served"] },
        },
        { orderStatus: newOrderStatus }
      );

      return NextResponse.json({
        success: true,
        message: `Table ${tableNumber} marked as ${paymentStatus}. ${result.modifiedCount} orders updated.`,
        data: { guestId, paymentStatus },
      });
    }

    return NextResponse.json(
      { success: false, message: "Unknown guest type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("❌ Error updating invoice:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update invoice: " +
          (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 500 }
    );
  }
}
