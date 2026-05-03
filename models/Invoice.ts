import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
  invoiceNumber: string;
  roomBookingId: mongoose.Types.ObjectId;
  roomCharges: number;
  foodCharges: number;
  tourCharges: number;
  serviceCharge: number;
  tax: number;
  grandTotal: number;
  isPaid: boolean;
}

const InvoiceSchema = new Schema<IInvoice>({
  invoiceNumber: { type: String, required: true, unique: true },
  roomBookingId: { type: Schema.Types.ObjectId, ref: 'RoomBooking', required: true },
  roomCharges: { type: Number, default: 0 },
  foodCharges: { type: Number, default: 0 },
  tourCharges: { type: Number, default: 0 },
  serviceCharge: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  isPaid: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);