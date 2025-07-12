import mongoose, { Schema } from "mongoose";

const AppOwnerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNo: { type: String, required: true },
    photoUrl: { type: String },
    password: { type: String, required: true },
    superAdmin: [{ type: Schema.Types.ObjectId, ref: 'SuperAdmin' }],
    refreshToken: { type: String },
    accessToken: { type: String },

}, { timestamps: true });
module.exports = mongoose.model('appOwner', AppOwnerSchema);