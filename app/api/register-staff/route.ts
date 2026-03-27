import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import { UserRole } from "@/lib/type";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    // Get session with auth options
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Please login first" },
        { status: 401 },
      );
    }

    const userRole = (session.user as any)?.role;

    if (userRole !== "Admin") {
      return NextResponse.json(
        {
          error: `Unauthorized: Admin access required. Your role is: ${userRole}`,
        },
        { status: 403 },
      );
    }

    await connectDB();
    const body = await request.json();
    const { name, email, password, role, image } = body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, password, role" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    // Check for duplicate email
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return NextResponse.json(
        { error: "Email already registered in system" },
        { status: 409 },
      );
    }

    // Validate role
    const validRoles = ["Admin", "Waiter", "Receptionist", "Manager"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(", ")}` },
        { status: 400 },
      );
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role as UserRole,
      image: image || "",
      isActive: true,
    });

    await newUser.save();

    return NextResponse.json(
      {
        success: true,
        message: "Staff member registered successfully",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Staff registration error:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors)
        .map((err: any) => err.message)
        .join(", ");
      return NextResponse.json(
        { error: `Validation failed: ${messages}` },
        { status: 400 },
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Email already exists in system" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to register staff member",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

// GET endpoint to fetch all staff (admin only)
export async function GET(request: NextRequest) {
  try {
    // Get session with auth options
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Please login first" },
        { status: 401 },
      );
    }

    const userRole = (session.user as any)?.role;

    if (userRole !== "Admin") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 },
      );
    }

    await connectDB();

    const staff = await User.find({ isActive: true }).select(
      "name email role createdAt image",
    );

    return NextResponse.json(
      {
        success: true,
        count: staff.length,
        staff,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Staff fetch error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch staff members",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
