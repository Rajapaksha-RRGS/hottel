import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IProduct extends Document {
  productId: string;
  productName: string;
  altName?: string[];
  description: string;
  img?: string[];
  labelPrice: number;
  Price: number;
  stock: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema: Schema<IProduct> = new Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
    },
    productName: {
      type: String,
      required: true,
    },
    altName: [{ type: String }],
    description: {
      type: String,
      required: true,
    },
    img: [{ type: String }],
    labelPrice: {
      type: Number,
      required: true,
    },
    Price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;
