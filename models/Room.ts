import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Define Room Status and Types for TypeScript safety
export type RoomStatus = 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';
export type RoomType = 'Standard' | 'Deluxe' | 'Beach-Cabana' | 'Family-Suite';

// 2. Define the Interface for the Room Document
export interface IRoom extends Document {
  roomNumber: string;
  type: RoomType;
  status: RoomStatus;
  pricePerNight: number;
  amenities: string[];
  maxOccupancy: number;
  description?: string;
  images: string[];
  lastCleaned: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 3. Create the Mongoose Schema
const RoomSchema: Schema<IRoom> = new Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Standard', 'Deluxe', 'Beach-Cabana', 'Family-Suite'],
      required: [true, 'Room type is required'],
    },
    status: {
      type: String,
      enum: ['Available', 'Occupied', 'Cleaning', 'Maintenance'],
      default: 'Available',
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [0, 'Price cannot be negative'],
    },
    amenities: {
      type: [String], // Array of strings (e.g., ["AC", "Free WiFi", "Sea View"])
      default: [],
    },
    maxOccupancy: {
      type: Number,
      required: true,
      default: 2,
    },
    description: {
      type: String,
      trim: true,
    },
    images: {
      type: [String], // URLs to images
      default: [],
    },
    lastCleaned: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// 4. Export the model
const Room: Model<IRoom> = mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);

export default Room;