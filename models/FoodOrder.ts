import mongoose, { Schema, Document, Model } from 'mongoose';

interface IOrderItem {
  foodItem: mongoose.Types.ObjectId;
  quantity: number;
  subTotal: number;
}

export interface IFoodOrder extends Document {
  roomBookingId: mongoose.Types.ObjectId; // කාමරයේ බිලට එකතු කිරීමට
  items: IOrderItem[];
  totalBill: number;
  orderStatus: 'Pending' | 'Served' | 'Billed';
}

const FoodOrderSchema = new Schema<IFoodOrder>({
  roomBookingId: { type: Schema.Types.ObjectId, ref: 'RoomBooking', required: true },
  items: [{
    foodItem: { type: Schema.Types.ObjectId, ref: 'FoodItem', required: true },
    quantity: { type: Number, required: true, min: 1 },
    subTotal: { type: Number, required: true }
  }],
  totalBill: { type: Number, required: true },
  orderStatus: { type: String, enum: ['Pending', 'Served', 'Billed'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.models.FoodOrder || mongoose.model<IFoodOrder>('FoodOrder', FoodOrderSchema);