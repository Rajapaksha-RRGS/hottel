import mongoose, { Schema, Document } from 'mongoose';

export interface ITourPackage extends Document {
  title: string; // උදා: Pigeon Island Snorkeling
  description: string;
  pricePerPerson: number;
  duration: string;
}

const TourPackageSchema = new Schema<ITourPackage>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  pricePerPerson: { type: Number, required: true },
  duration: { type: String, required: true }
});

export default mongoose.models.TourPackage || mongoose.model<ITourPackage>('TourPackage', TourPackageSchema);