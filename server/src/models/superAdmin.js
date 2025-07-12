import mongoose, { Schema } from "mongoose";


const SuperAdmin = new mongoose.Schema({
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is required"], unique: true },
    password: { type: String, required: [true, "Password is required"] },
    phoneNo: { type: String, required: [true, "Phone number is required"] },
    address: { type: String, required: true },
    role: {
        type: String,
        required: true
    },
    verified: { type: Boolean, default: false },
    subscription: { type: String, default: "free" },
    store: [{
        bussinessName: { type: String, required: true },
        address: { type: String, required: true },
        bussinessEmail: { type: String, required: true, unique: true },
        bussinessPhoneNo: { type: String, required: true },
        photoUrl: [
            {
                fileId: {
                    type: String, // ImageKit file ID
                    required: true, // The unique identifier for the uploaded image file
                },
                url: {
                    type: String,
                    required: true,
                },
                altText: {
                    type: String,
                    default: "",
                },
            }, 
        ],
        gstNo: { type: String, required: true },
        panNo: { type: String, required: true },
        
    }],
    admins: [{ type: Schema.Types.ObjectId, ref: 'Admin' }],
    operators: [{ type: Schema.Types.ObjectId, ref: 'Operator' }],
    bills: [{ type: Schema.Types.ObjectId, ref: 'Bill' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    refreshToken: { type: String },
    accessToken: { type: String },

}, { timestamps: true });

module.exports = mongoose.model('SuperAdmin', SuperAdmin);