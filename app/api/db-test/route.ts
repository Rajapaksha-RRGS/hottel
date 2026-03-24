import { NextResponse } from "next/server";
import { Db } from "@/lib/db";

export async function GET() {
  try {
    const db = await Db();
    await db.command({ ping: 1 });

    return NextResponse.json({ ok: true, message: "MongoDB connected" });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "MongoDB connection failed", error: String(error) },
      { status: 500 }
    );
  }
}