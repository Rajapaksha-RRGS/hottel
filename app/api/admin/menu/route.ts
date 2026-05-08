import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import FoodItem from '@/models/FoodItem';

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    
    let query = {};
    if (category && category !== 'All') {
      query = { category: category.trim() };
    }
    
    const items = await FoodItem.find(query).sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching food items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const categoryValue = body.category ? body.category.trim() : body.category;
    
    const newItem = new FoodItem({
      name: body.name,
      category: categoryValue,
      prices: body.prices,
      image: body.image,
      prepTime: body.prepTime,
      allergens: body.allergens,
      spiceLevel: body.spiceLevel,
      isAvailable: body.isAvailable ?? true,
      description: body.description,
    });
    
    await newItem.save();
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error creating food item:', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
