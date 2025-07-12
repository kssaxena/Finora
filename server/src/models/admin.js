import mongoose, { Schema } from "mongoose";


const Admin = new mongoose.Schema({
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is required"], unique: true },
    password: { type: String, required: [true, "Password is required"] },
    phoneNo: { type: String, required: [true, "Phone number is required"] },
    role: {
        type: String,
        required: true
    },
    operators: [{ type: Schema.Types.ObjectId, ref: 'Operator' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    refreshToken: { type: String },
    accessToken: { type: String },

}, { timestamps: true });

module.exports = mongoose.model('Admin', Admin);
