import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Jwt from "jsonwebtoken";

const superAdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    panNumber: {
      type: String,
      required: true,
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      reviewsCount: {
        type: Number,
        default: 0,
      },
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    category: [
      {
        title: { type: String, required: true },
        status: {
          type: String,
          default: "Under-review",
          enum: ["Verified", "Under-review"],
        },
        subcategory: [
          {
            title: { type: String, required: true },
            image: {
              fileId: { type: String, required: true },
              url: { type: String, required: true },
              altText: { type: String, default: "" },
            },
          },
        ],
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

    // For gst certificate
    imageGST: {
      fileId: {
        type: String, //  ImageKit file ID
        default: null,
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

    businessDetails: {
      gstNumber: {
        type: String,
        required: true,
        unique: true,
      },
      businessName: {
        type: String,
        required: true,
        trim: true,
      },
      registrationDate: {
        type: Date,
        default: Date.now,
      },
    },
    bankDetails: {
      accountHolderName: {
        type: String,
        required: true,
      },
      accountNumber: {
        type: String,
        required: true,
      },
      bankName: {
        type: String,
        required: true,
      },
      ifscCode: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String,
      required: true,
      // minlength: 8,
    },
  },
  { timestamps: true }
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
