import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from "bcryptjs";

export type UserRole = "Admin" | "Waiter" | "Receptionist" | "Manager";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional if using OAuth/Google Login later
  role: UserRole;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 3. Create the Mongoose Schema
const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      select: false, // Don't return password by default in queries
    },
    role: {
      type: String,
      enum: ["Admin", "Waiter", "Receptionist", "Manager"],
      default: "Waiter",
    },
    image: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt
  },
);

// Pre-save middleware to hash password before saving
UserSchema.pre("save", async function () {
  // Only hash if password is modified and not already hashed
  if (!this.isModified("password")) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt (10 rounds)
    this.password = await bcrypt.hash(this.password!, salt);
  } catch (error: any) {
    throw new Error("Error hashing password: " + error.message);
  }
});

// 4. Export the model (Next.js specific check to prevent re-compilation)
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;