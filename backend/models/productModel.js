import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    images: { type: [String], required: true, default: [] },
    category: { type: String, required: true, trim: true },
    subCategory: { type: String, required: true, trim: true },
    sizes: { type: [String], required: true, default: [] },
    bestseller: { type: Boolean, default: false },
    stock: { type: Number, default: 0, min: 0 },
    date: { type: Number, default: Date.now }
}, { timestamps: true });

const ProductModel = mongoose.models.product || mongoose.model("products", productSchema);
export default ProductModel;
