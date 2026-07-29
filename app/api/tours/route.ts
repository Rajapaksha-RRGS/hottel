import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import TourPackage from '@/models/TourPackage';

export async function GET() {
  try {
    await connectDB();
    const tours = await TourPackage.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ ok: true, tours, count: tours.length });
  } catch (error) {
    return NextResponse.json({ ok: false, message: 'Failed to fetch tours' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const requiredFields = ['name', 'description', 'location', 'duration', 'capacity', 'price', 'category'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ ok: false, message: `${field} is required` }, { status: 400 });
      }
    }

    const tourData = {
      name: body.name,
      description: body.description,
      location: body.location,
      duration: body.duration,
      capacity: Number(body.capacity),
      booked: Number(body.booked) || 0,
      rating: Number(body.rating) || 0,
      price: Number(body.price),
      status: body.status || 'Active',
      image: body.image || '',
      category: body.category,
      vehicle: body.vehicle || 'Air-conditioned Van',
      itinerary: body.itinerary || '',
      highlights: Array.isArray(body.highlights)
        ? body.highlights
        : (body.highlights || '').split(',').map((h: string) => h.trim()).filter(Boolean),
    };

    const tour = await TourPackage.create(tourData);
    return NextResponse.json({ ok: true, tour, message: 'Tour created successfully' }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ ok: false, message: messages.join(', ') }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: error.message || 'Failed to create tour' }, { status: 500 });
  }
}
