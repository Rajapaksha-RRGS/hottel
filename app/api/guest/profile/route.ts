import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Gest from '@/models/Gest';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json({ ok: false, message: 'Email is required' }, { status: 400 });
    }

    const guest = await Gest.findOne({ email }).lean();

    if (!guest) {
      return NextResponse.json({ ok: false, message: 'Guest not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, guest });
  } catch (error) {
    console.error('Error fetching guest profile:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, name, phone } = body;

    if (!email) {
      return NextResponse.json({ ok: false, message: 'Email is required' }, { status: 400 });
    }

    const updated = await Gest.findOneAndUpdate(
      { email },
      { $set: { name, phone } },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ ok: false, message: 'Guest not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, guest: updated });
  } catch (error) {
    console.error('Error updating guest profile:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}
