import mongoose, { Schema, Document } from 'mongoose';

export interface ITourBooking extends Document {
  fullName: string;
  email: string;
  phone: string;
  tourPackageId: mongoose.Types.ObjectId;
  tourName: string;
  roomBookingId?: mongoose.Types.ObjectId;
  numberOfPeople: number;
  bookingDate: Date;
  totalCost: number;
  specialRequests?: string;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const TourBookingSchema = new Schema<ITourBooking>(
  {
    fullName: { type: String, required: [true, 'Full name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], lowercase: true, trim: true },
    phone: { type: String, required: [true, 'Phone number is required'], trim: true },
    tourPackageId: { type: Schema.Types.ObjectId, ref: 'TourPackage', required: true },
    tourName: { type: String, required: true, trim: true },
    roomBookingId: { type: Schema.Types.ObjectId, ref: 'RoomBooking', required: false },
    numberOfPeople: { type: Number, required: true, min: 1 },
    bookingDate: { type: Date, required: true },
    totalCost: { type: Number, required: true, min: 0 },
    specialRequests: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
  },
  { timestamps: true }
);

export default mongoose.models.TourBooking ||
  mongoose.model<ITourBooking>('TourBooking', TourBookingSchema);