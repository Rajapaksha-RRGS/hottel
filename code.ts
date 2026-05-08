import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
  },
  productName: {
    type: String,
    required: true, // මෙතන 'require' නෙමෙයි 'required' වෙන්න ඕනේ
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
}, { timestamps: true }); // මේක දැම්මොත් දත්ත ඇතුළත් කරපු වෙලාව auto වැටෙනවා.

// මෙන්න මේ කොටස තමයි Next.js වලදී වැදගත්ම:
const Product = mongoose.models.products || mongoose.model("products", productSchema);

export default Product;
