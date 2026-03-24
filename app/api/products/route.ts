import { NextResponse } from "next/server";
import { Db } from "@/lib/db";

export async function GET() {
  try {
    const db = await Db();
    const products = await db
      .collection("products")
      .find({})
      .limit(20)
      .toArray();

    return NextResponse.json({
      ok: true,
      data: products,
      message: "Products fetched successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to fetch products",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
