import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Complaint from '@/models/Complaint';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json({ ok: false, message: 'Email is required' }, { status: 400 });
    }

    const complaints = await Complaint.find({ guestEmail: email })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ ok: true, complaints });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, name, category, priority, subject, description } = body;

    if (!email || !category || !subject || !description) {
      return NextResponse.json({ ok: false, message: 'All fields are required' }, { status: 400 });
    }

    const complaint = await Complaint.create({
      guestEmail: email,
      guestName: name || 'Guest',
      category,
      priority: priority || 'Medium',
      subject,
      description,
    });

    return NextResponse.json({ ok: true, complaint }, { status: 201 });
  } catch (error) {
    console.error('Error submitting complaint:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}
