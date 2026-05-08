import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import FoodItem from '@/models/FoodItem';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const updatedItem = await FoodItem.findByIdAndUpdate(params.id, body, { new: true });
    
    if (!updatedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating food item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deletedItem = await FoodItem.findByIdAndDelete(params.id);
    
    if (!deletedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting food item:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
