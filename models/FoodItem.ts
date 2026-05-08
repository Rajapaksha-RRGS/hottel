
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFoodItem extends Document {
  name: string;
  category: 'Appetizer' | 'Main' | 'Dessert' | 'Beverage' | 'Cocktail' | 'Shot' | 'Grilled' | 'Fried' | 'Burgers' | 'Sandwich'| 'spaghetti' | 'pastha' ;
  prices: {
    normal: number;
    full?: number;
  };
  image: string;
  prepTime?: string;
  allergens?: string[];
  spiceLevel?: number;
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
  prices: {
    normal: { type: Number, required: true, min: 0 },
    full: { type: Number, min: 0 }
  },
  image: { type: String, required: true },
  prepTime: { type: String },
  allergens: [{ type: String }],
  spiceLevel: { type: Number, min: 0, max: 5 },
  isAvailable: { type: Boolean, default: true },
  description: String,
});

export default mongoose.models.FoodItem || mongoose.model<IFoodItem>('FoodItem', FoodItemSchema);