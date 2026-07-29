import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import FoodItem from '@/models/FoodItem';
// @ts-ignore - seed data import
import { luxuryBeverages } from '@/lib/seedBeverages';

// POST /api/admin/seed-beverages
// Seeds luxury cocktails & shots into the database (skips duplicates)
export async function POST() {
  try {
    await connectDB();

    const results = [];
    for (const bev of luxuryBeverages) {
      const exists = await FoodItem.findOne({ name: bev.name });
      if (!exists) {
        const doc = await FoodItem.create(bev);
        results.push({ created: true, name: doc.name });
      } else {
        results.push({ created: false, name: bev.name, note: 'already exists' });
      }
    }

    const created = results.filter((r) => r.created).length;
    return NextResponse.json({
      ok: true,
      message: `Seeded ${created} new items (${results.length - created} already existed).`,
      results,
    });
  } catch (err) {
    console.error('Seed error:', err);
    return NextResponse.json({ ok: false, error: 'Seed failed' }, { status: 500 });
  }
}
