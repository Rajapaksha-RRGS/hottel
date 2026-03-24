
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFoodItem extends Document {
  name: string;
  category: 'Appetizer' | 'Main' | 'Dessert' | 'Beverage' | 'Cocktail' | 'Shot';
  price: number;
  isAvailable: boolean;
  description?: string;
}

const FoodItemSchema = new Schema<IFoodItem>({
  name: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    enum: ['Appetizer', 'Main', 'Dessert', 'Beverage', 'Cocktail', 'Shot'], 
    required: true 
  },
  price: { type: Number, required: true, min: 0 },
  isAvailable: { type: Boolean, default: true },
  description: String,
});

export default mongoose.models.FoodItem || mongoose.model<IFoodItem>('FoodItem', FoodItemSchema);