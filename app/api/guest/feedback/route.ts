import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Feedback from '@/models/Feedback';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json({ ok: false, message: 'Email is required' }, { status: 400 });
    }

    const feedbacks = await Feedback.find({ guestEmail: email })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ ok: true, feedbacks });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, name, category, rating, message } = body;

    if (!email || !category || !rating || !message) {
      return NextResponse.json({ ok: false, message: 'All fields are required' }, { status: 400 });
    }

    const feedback = await Feedback.create({
      guestEmail: email,
      guestName: name || 'Guest',
      category,
      rating,
      message,
    });

    return NextResponse.json({ ok: true, feedback }, { status: 201 });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}
