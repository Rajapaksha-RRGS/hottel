import mongoose, { Schema, Document, Model } from 'mongoose';

export type ComplaintStatus = 'Open' | 'In-Progress' | 'Resolved';
export type ComplaintPriority = 'Low' | 'Medium' | 'High';
export type ComplaintCategory = 'Room' | 'Service' | 'Food' | 'Cleanliness' | 'Noise' | 'Other';

export interface IComplaint extends Document {
  guestEmail: string;
  guestName: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  subject: string;
  description: string;
  status: ComplaintStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema: Schema<IComplaint> = new Schema(
  {
    guestEmail: {
      type: String,
      required: [true, 'Guest email is required'],
      lowercase: true,
    },
    guestName: {
      type: String,
      required: [true, 'Guest name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Room', 'Service', 'Food', 'Cleanliness', 'Noise', 'Other'],
      required: [true, 'Category is required'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved'],
      default: 'Open',
    },
  },
  {
    timestamps: true,
  }
);

const Complaint: Model<IComplaint> =
  mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema);

export default Complaint;
