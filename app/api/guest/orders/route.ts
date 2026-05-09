import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import FoodOrder from '@/models/FoodOrder';
import RoomBooking from '@/models/RoomBokking';
import FoodItem from '@/models/FoodItem';

// ─── GET: Fetch Guest's Orders ────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const email = request.nextUrl.searchParams.get('email');
    const name = request.nextUrl.searchParams.get('name');

    if (!email) {
      return NextResponse.json({ ok: false, message: 'Email is required' }, { status: 400 });
    }

    const bookingQuery: any = { $or: [{ guestEmail: email }] };
    if (name) {
      bookingQuery.$or.push({ guestEmail: 'guest@vitaminseahotel.com', guestName: name });
    }

    // 1. Find all bookings for this guest
    const guestBookings = await RoomBooking.find(bookingQuery).select('_id').lean();
    const bookingIds = guestBookings.map((b: any) => b._id);

    // 2. Find all food orders for these bookings
    const orders = await FoodOrder.find({ roomBookingId: { $in: bookingIds } })
      .populate('items.foodItem', 'name image category')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ ok: true, orders });
  } catch (error) {
    console.error('Error fetching guest food orders:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}

// ─── POST: Create New Food Order ──────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, name, items, totalBill, specialInstructions } = body;

    if (!email || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, message: 'Missing required fields or empty cart' }, { status: 400 });
    }

    const bookingQuery: any = { 
      status: { $in: ['Checked-In', 'Confirmed'] },
      $or: [{ guestEmail: email }] 
    };
    
    if (name) {
      bookingQuery.$or.push({ guestEmail: 'guest@vitaminseahotel.com', guestName: name });
    }

    // 1. Find the guest's ACTIVE booking
    let activeBooking = await RoomBooking.findOne(bookingQuery).sort({ checkInDate: 1 }).lean() as any;

    // Fallback: If no Checked-In booking, but they have a Confirmed booking for today, maybe allow it?
    // Based on standard hotel policy, only Checked-In guests have a room to deliver to.
    if (!activeBooking) {
      return NextResponse.json({ 
        ok: false, 
        message: 'No active booking found. You must have a confirmed or checked-in room to order in-room dining.' 
      }, { status: 403 });
    }

    // 2. Validate and recalculate total bill to prevent frontend tampering
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const foodDb = await FoodItem.findById(item.foodItemId).lean() as any;
      if (!foodDb || !foodDb.isAvailable) {
        return NextResponse.json({ 
          ok: false, 
          message: `Item ${item.name || 'selected'} is currently unavailable.` 
        }, { status: 400 });
      }

      const itemTotal = (foodDb.prices.normal) * item.quantity;
      calculatedTotal += itemTotal;

      validatedItems.push({
        foodItem: foodDb._id,
        quantity: item.quantity,
        subTotal: itemTotal,
      });
    }

    // 3. Create the Order
    const newOrder = new FoodOrder({
      roomBookingId: activeBooking._id,
      orderType: 'Room',
      items: validatedItems,
      totalBill: calculatedTotal,
      orderStatus: 'Pending',
      // We can append special instructions to notes if the model supported it, 
      // but FoodOrder doesn't have a notes field yet. We will just use the exact model schema.
    });

    const savedOrder = await newOrder.save();

    return NextResponse.json({ 
      ok: true, 
      message: 'Order placed successfully!',
      order: savedOrder 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating food order:', error);
    return NextResponse.json({ 
      ok: false, 
      message: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}
