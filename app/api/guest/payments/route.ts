import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import RoomBooking from '@/models/RoomBokking';
import FoodOrder from '@/models/FoodOrder';
import TourBooking from '@/models/TourBooking';
import '@/models/Room';
import '@/models/FoodItem';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const email = request.nextUrl.searchParams.get('email');
    const name = request.nextUrl.searchParams.get('name');

    if (!email) {
      return NextResponse.json({ ok: false, message: 'Email is required' }, { status: 400 });
    }

    // Auto update expired bookings to 'Checked-Out'
    const now = new Date();
    await RoomBooking.updateMany(
      {
        status: { $in: ['Confirmed', 'Checked-In'] },
        checkOutDate: { $lte: now },
      },
      { $set: { status: 'Checked-Out' } }
    );


    // Query for guest's room bookings
    const bookingQuery: any = {
      $or: [
        { guestEmail: email },
        ...(name ? [{ guestEmail: 'guest@vitaminseahotel.com', guestName: name }] : []),
      ],
    };

    const roomBookings = await RoomBooking.find(bookingQuery)
      .populate('room')
      .sort({ createdAt: -1 })
      .lean();

    // Query for guest's tour bookings
    const tourQuery: any = {
      $or: [
        { email: email },
        ...(name ? [{ email: 'guest@vitaminseahotel.com', fullName: name }] : []),
      ],
    };

    const allTourBookings = await TourBooking.find(tourQuery)
      .sort({ createdAt: -1 })
      .lean();

    // Find active booking (Checked-In or Confirmed)
    const activeBooking = roomBookings.find(
      (b: any) => b.status === 'Checked-In' || b.status === 'Confirmed'
    );

    let activeInvoice: any = null;

    if (activeBooking) {
      // 1. Room Charge
      const roomCharge = activeBooking.totalAmount || 0;

      // 2. Food Orders linked to this active room booking
      const foodOrdersRaw = await FoodOrder.find({ roomBookingId: activeBooking._id })
        .populate('items.foodItem', 'name image category prices')
        .sort({ createdAt: -1 })
        .lean();

      const foodOrders = foodOrdersRaw.map((order: any) => ({
        _id: order._id.toString(),
        orderType: order.orderType,
        orderStatus: order.orderStatus,
        totalBill: order.totalBill,
        createdAt: order.createdAt,
        items: (order.items || []).map((item: any) => ({
          foodName: item.foodItem?.name || 'Food Item',
          category: item.foodItem?.category || 'Dining',
          image: item.foodItem?.image || '',
          quantity: item.quantity,
          unitPrice: item.foodItem?.prices?.normal || 0,
          subTotal: item.subTotal,
        })),
      }));

      const foodTotal = foodOrders.reduce((sum: number, o: any) => sum + (o.totalBill || 0), 0);

      // 3. Confirmed Tour Packages for this guest
      const confirmedTours = allTourBookings.filter(
        (t: any) => t.status === 'Confirmed' || t.status === 'Scheduled' || t.status === 'Completed'
      );

      const tourTotal = confirmedTours.reduce((sum: number, t: any) => sum + (t.totalCost || 0), 0);

      // Summary Totals
      const totalCharges = roomCharge + foodTotal + tourTotal;
      const advancePaid = activeBooking.advancePayment || 0;
      const balanceDue = Math.max(0, totalCharges - advancePaid);

      activeInvoice = {
        bookingId: activeBooking._id.toString(),
        guestName: activeBooking.guestName,
        guestEmail: activeBooking.guestEmail,
        guestPhone: activeBooking.guestPhone,
        roomNumber: activeBooking.room?.roomNumber || 'N/A',
        roomType: activeBooking.room?.type || 'Standard',
        checkInDate: activeBooking.checkInDate,
        checkOutDate: activeBooking.checkOutDate,
        bookingStatus: activeBooking.status,
        paymentStatus: activeBooking.paymentStatus,
        roomCharge,
        foodOrders,
        foodTotal,
        tours: confirmedTours,
        tourTotal,
        totalCharges,
        advancePaid,
        balanceDue,
      };
    }

    // General Payment History (Room Bookings)
    const payments = roomBookings.map((b: any) => ({
      bookingId: b._id.toString(),
      roomType: b.room?.type || 'N/A',
      roomNumber: b.room?.roomNumber || 'N/A',
      checkInDate: b.checkInDate,
      checkOutDate: b.checkOutDate,
      totalAmount: b.totalAmount,
      advancePayment: b.advancePayment,
      paymentStatus: b.paymentStatus,
      bookingStatus: b.status,
      createdAt: b.createdAt,
    }));

    return NextResponse.json({
      ok: true,
      activeInvoice,
      payments,
      allTourBookings,
    });
  } catch (error: any) {
    console.error('Error fetching guest live payments/invoice:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}
