import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema(
  {
    // Personal Details
    personal: {
      name: {
        type: String,
        required: true,
      },
      contact: {
        type: String,
        required: true,
        unique: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
      password: {
        type: String,
        required: true,
      },
      panNumber: {
        type: String,
        required: true,
      },
    },
    operator: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Operator",
      },
    ],

    // Images
    image: [
      {
        url: {
          type: String,
        },
        fileId: {
          type: String,
        },
        filePath: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Password Hashing Middleware
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Instance Methods
adminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

adminSchema.methods.generateAccessToken = function () {
  return Jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

adminSchema.methods.generateRefreshToken = function () {
  return Jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const Admin = mongoose.model("Admin", adminSchema);
