import mongoose, { Schema, Document, Model } from "mongoose";

export type TourStatus = "Active" | "Full" | "Inactive";
export type TourCategory = "Cultural" | "Adventure" | "Wildlife";

export interface ITourPackage extends Document {
  name: string;
  description: string;
  location: string;
  duration: string;
  capacity: number;
  booked: number;
  rating: number;
  price: number;
  status: TourStatus;
  image: string;
  category: TourCategory;
  vehicle: string;
  itinerary: string;
  highlights: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TourPackageSchema: Schema<ITourPackage> = new Schema(
  {
    name: { type: String, required: [true, "Tour name is required"], trim: true },
    description: { type: String, required: [true, "Description is required"], trim: true },
    location: { type: String, required: [true, "Location is required"], trim: true },
    duration: { type: String, required: [true, "Duration is required"], trim: true },
    capacity: { type: Number, required: [true, "Capacity is required"], min: [1, "Capacity must be at least 1"] },
    booked: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    price: { type: Number, required: [true, "Price is required"], min: 0 },
    status: { type: String, enum: ["Active", "Full", "Inactive"], default: "Active" },
    image: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Cultural", "Adventure", "Wildlife"],
      required: [true, "Category is required"],
    },
    vehicle: { type: String, default: "Air-conditioned Van", trim: true },
    itinerary: { type: String, default: "", trim: true },
    highlights: { type: [String], default: [] },
  },
  { timestamps: true }
);

TourPackageSchema.pre("save", function () {
  if (this.booked >= this.capacity) {
    this.status = "Full";
  }
});

const TourPackage: Model<ITourPackage> =
  mongoose.models.TourPackage ||
  mongoose.model<ITourPackage>("TourPackage", TourPackageSchema);

export default TourPackage;
