import mongoose, { Model } from "mongoose";

export interface IGest extends mongoose.Document {
    name : string;
    email: String ;
    phone: String;
    message: String;
    password: String;
    image?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const GetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,

    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number'],
    },
    message: {
        type: String,
        required: [true, 'Please provide a message'],
    },
    password: {
        type: String,
        required: [false, 'Please provide a password'],
        select: false, // Don't return password by default in queries
    },
    image: {
        type: String,
        default: '',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true, 
});
const Gest: Model<IGest> = mongoose.models.Gest || mongoose.model<IGest>('Gest', GetSchema);

export default Gest;
