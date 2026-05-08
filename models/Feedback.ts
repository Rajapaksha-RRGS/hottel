import mongoose, { Schema, Document, Model } from 'mongoose';

export type FeedbackCategory = 'Room' | 'Service' | 'Food' | 'Overall';

export interface IFeedback extends Document {
  guestEmail: string;
  guestName: string;
  category: FeedbackCategory;
  rating: number;
  message: string;
  bookingId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema<IFeedback> = new Schema(
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
      enum: ['Room', 'Service', 'Food', 'Overall'],
      required: [true, 'Category is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    message: {
      type: String,
      required: [true, 'Feedback message is required'],
      trim: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'RoomBooking',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Feedback: Model<IFeedback> =
  mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);

export default Feedback;
