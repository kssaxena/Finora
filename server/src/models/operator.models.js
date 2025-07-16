import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Jwt from "jsonwebtoken";

const operatorSchema = new mongoose.Schema(
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

    bill: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bill",
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
operatorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Instance Methods
operatorSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

operatorSchema.methods.generateAccessToken = function () {
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

operatorSchema.methods.generateRefreshToken = function () {
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

export const Operator = mongoose.model("Operator", operatorSchema);
