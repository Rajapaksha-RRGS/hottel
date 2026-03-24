import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Booking Status සහ Payment Status සඳහා Types නිර්වචනය කිරීම
export type BookingStatus = 'Confirmed' | 'Checked-In' | 'Checked-Out' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Partially-Paid' | 'Paid';

export interface IRoomBooking extends Document {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  room: mongoose.Types.ObjectId; // Reference to Room model
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  totalAmount: number;
  advancePayment: number;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  specialRequests?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoomBookingSchema: Schema<IRoomBooking> = new Schema(
  {
    guestName: {
      type: String,
      required: [true, 'Guest name is required'],
      trim: true,
    },
    guestEmail: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
    },
    guestPhone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room', 
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    numberOfGuests: {
      type: Number,
      default: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    advancePayment: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Partially-Paid', 'Paid'],
      default: 'Pending',
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'],
      default: 'Confirmed',
    },
    specialRequests: String,
    notes: String,
  },
  {
    timestamps: true,
  }
);


const RoomBooking: Model<IRoomBooking> =
  mongoose.models.RoomBooking || mongoose.model<IRoomBooking>('RoomBooking', RoomBookingSchema);

export default RoomBooking;