import mongoose, { Schema } from "mongoose";


const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    sku: { type: String, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },
    images: [String],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
module.exports = mongoose.model('Product', ProductSchema);
