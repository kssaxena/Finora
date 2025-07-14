import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Jwt from "jsonwebtoken";

const superAdminSchema = new mongoose.Schema(
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

    // Business Details
    business: [
      {
        businessName: {
          type: String,
          required: true,
        },
        businessAddress: {
          type: String,
          required: true,
        },
        businessEmail: {
          type: String,
          required: true,
        },
        businessCity: {
          type: String,
          required: true,
        },
        businessState: {
          type: String,
          required: true,
        },
        businessContact: {
          type: String,
          required: true,
        },
        gstNumber: {
          type: String,
          required: true,
          unique: true,
        },
        businessPinCode: {
          type: String,
          required: true,
          // unique: true,
        },
      },
    ],

    admin: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },
    ],
    operator: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Operator",
      },
    ],
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },

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
    canceledCheque: {
      fileId: {
        type: String, //  ImageKit file ID
        default: null,
        required: true, // The unique identifier for the uploaded image file
      },
      url: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Password Hashing Middleware
superAdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Instance Methods
superAdminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

superAdminSchema.methods.generateAccessToken = function () {
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

superAdminSchema.methods.generateRefreshToken = function () {
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

export const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);
