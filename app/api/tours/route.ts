import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import TourPackage from '@/models/TourPackage';

// GET: Fetch all tours
export async function GET() {
  try {
    await connectDB();

    const tours = await TourPackage.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      ok: true,
      tours,
      count: tours.length,
    });
  } catch (error) {
    console.error('GET /api/tours error:', error);
    return NextResponse.json(
      { ok: false, message: 'Failed to fetch tours' },
      { status: 500 }
    );
  }
}

// POST: Create a new tour
export async function POST(request: NextRequest) {
  try {
    
    await connectDB();
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'description', 'location', 'duration', 'capacity', 'price'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { ok: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Create the tour
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
    };

    

    const tour = await TourPackage.create(tourData);

    

    return NextResponse.json(
      { ok: true, tour, message: 'Tour created successfully' },
      { status: 201 }
    );
  } catch (error: any) {

    // Handle MongoDB connection errors
    if (error.name === 'MongoNetworkError' || error.message?.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { ok: false, message: 'Database connection failed. Please check MongoDB.' },
        { status: 503 }
      );
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { ok: false, message: messages.join(', ') },
        { status: 400 }
      );
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { ok: false, message: 'A tour with this name already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { ok: false, message: error.message || 'Failed to create tour' },
      { status: 500 }
    );
  }
}
