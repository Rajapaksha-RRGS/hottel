import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
  invoiceNumber: string;
  // මේ දෙකෙන් එකක් අනිවාර්යයෙන් තියෙන්න ඕනේ
  roomBookingId?: mongoose.Types.ObjectId; // In-house guest කෙනෙක් නම්
  tableNumber?: string;                  // Walk-in (Table) guest කෙනෙක් නම්
  
  invoiceType: 'Room' | 'Table';         // Invoice එක මොන වගේ එකක්ද කියලා හඳුනාගන්න
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
  
  // roomBookingId required: true එක ඉවත් කළා
  roomBookingId: { type: Schema.Types.ObjectId, ref: 'RoomBooking', required: false },
  tableNumber: { type: String, required: false },
  
  invoiceType: { 
    type: String, 
    enum: ['Room', 'Table'], 
    required: true 
  },

  roomCharges: { type: Number, default: 0 },
  foodCharges: { type: Number, default: 0 },
  tourCharges: { type: Number, default: 0 },
  serviceCharge: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  isPaid: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);