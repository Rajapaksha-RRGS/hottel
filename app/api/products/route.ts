import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).limit(20);

    return NextResponse.json({
      ok: true,
      data: products,
      message: "Products fetched successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to fetch products",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
