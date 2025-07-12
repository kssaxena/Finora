import mongoose, { Schema } from "mongoose";


const Operator = new mongoose.Schema({
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is required"], unique: true },
    password: { type: String, required: [true, "Password is required"] },
    phoneNo: { type: String, required: [true, "Phone number is required"] },
    role: {
        type: String,
        required: true
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
}, { timestamps: true });

module.exports = mongoose.model('Operator', Operator);
