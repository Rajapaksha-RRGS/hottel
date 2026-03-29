import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Define Tour Status for TypeScript safety
export type TourStatus = "Active" | "Full" | "Inactive";

// 2. Define the Interface for the Tour Document
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
  createdAt: Date;
  updatedAt: Date;
}

// 3. Create the Mongoose Schema
const TourPackageSchema: Schema<ITourPackage> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tour name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    booked: {
      type: Number,
      default: 0,
      min: [0, "Booked cannot be negative"],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    status: {
      type: String,
      enum: ["Active", "Full", "Inactive"],
      default: "Active",
    },
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// Auto-update status based on capacity
TourPackageSchema.pre("save", function () {
  if (this.booked >= this.capacity) {
    this.status = "Full";
  }
});

// 4. Export the model
const TourPackage: Model<ITourPackage> =
  mongoose.models.TourPackage ||
  mongoose.model<ITourPackage>("TourPackage", TourPackageSchema);

export default TourPackage;
