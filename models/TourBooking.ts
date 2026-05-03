import mongoose, { Schema, Document } from 'mongoose';

export interface ITourBooking extends Document {
    roomBookingId: mongoose.Types.ObjectId;
    tourPackageId: mongoose.Types.ObjectId;
    numberOfPeople: number;
    bookingDate: Date;
    totalCost: number;
    status: 'Scheduled' | 'Completed' | 'Cancelled';
}

const TourBookingSchema = new Schema<ITourBooking>({
    roomBookingId: { type: Schema.Types.ObjectId, ref: 'RoomBooking', required: true },
    tourPackageId: { type: Schema.Types.ObjectId, ref: 'TourPackage', required: true },
    numberOfPeople: { type: Number, required: true },
    bookingDate: { type: Date, required: true },
    totalCost: { type: Number, required: true },
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }
}, { timestamps: true });

export default mongoose.models.TourBooking || mongoose.model<ITourBooking>('TourBooking', TourBookingSchema);