import mongoose, { Schema, Document, Model } from 'mongoose';

interface IOrderItem {
  foodItem: mongoose.Types.ObjectId;
  quantity: number;
  subTotal: number;
}

export interface IFoodOrder extends Document {
  // මේ දෙකෙන් එකක් අනිවාර්යයෙන් තියෙන්න ඕනේ
  roomBookingId?: mongoose.Types.ObjectId; // In-house guest කෙනෙක් නම්
  tableNumber?: string;                  // එළියෙන් ආපු (Walk-in) කෙනෙක් නම්
  
  orderType: 'Room' | 'Table';           // ඕඩර් එක මොන වගේද කියලා ඉක්මනින් දැනගන්න
  items: IOrderItem[];
  totalBill: number;
  orderStatus: 'Pending' | 'Served' | 'Billed';
}

const FoodOrderSchema = new Schema<IFoodOrder>({
  // roomBookingId required true එක අයින් කළා Table orders වලට ඉඩ දෙන්න
  roomBookingId: { type: Schema.Types.ObjectId, ref: 'RoomBooking', required: false },
  tableNumber: { type: String, required: false }, 
  
  orderType: { 
    type: String, 
    enum: ['Room', 'Table'], 
    required: true 
  },
  
  items: [{
    foodItem: { type: Schema.Types.ObjectId, ref: 'FoodItem', required: true },
    quantity: { type: Number, required: true, min: 1 },
    subTotal: { type: Number, required: true }
  }],
  totalBill: { type: Number, required: true },
  orderStatus: { type: String, enum: ['Pending', 'Served', 'Billed'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.models.FoodOrder || mongoose.model<IFoodOrder>('FoodOrder', FoodOrderSchema);