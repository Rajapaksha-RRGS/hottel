import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { sendInvoiceEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { guestEmail, invoiceData, paymentMethod } = body;

    if (!guestEmail || !invoiceData) {
      return NextResponse.json(
        { success: false, message: "Missing guestEmail or invoiceData" },
        { status: 400 }
      );
    }

    await sendInvoiceEmail({ guestEmail, invoiceData, paymentMethod });

    return NextResponse.json({
      success: true,
      message: `Invoice sent to ${guestEmail}`,
    });
  } catch (error) {
    console.error("❌ Error sending invoice email:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to send email: " +
          (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 500 }
    );
  }
}
