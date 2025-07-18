import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    price: {
      MRP: {
        type: Number,
        required: true,
        min: 0,
      },
      sellingPrice: {
        type: Number,
        min: 0,
      },
      discount: {
        type: Number,
        min: 0,
        max: 100, // Maximum discount percentage allowed
      },
      discountedPrice: {
        type: Number,
        // required: true,
        min: 0, // Calculated discounted price based on MRP and discount percentage
        get: function () {
          return this.MRP - (this.MRP * this.discount) / 100;
        },
        set: function (value) {
          this.discountedPrice = value;
        },
      },
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true, // Stock Keeping Unit for unique product identification
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // Reference to the admin who registered the product
      required: true,
    },
    // superAdmin: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "VendorUser", // Reference to the super admin who registered the product
    //   required: true,
    // },
    images: [
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
    specifications: {
      type: Map,
      of: String, // Key-value pair for product specifications (e.g., "Color": "Red", "Size": "Large")
      default: {},
    },
    tags: {
      type: [String],
      default: [], // Optional tags for search and categorization
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Out-of-Stock"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to update the `updatedAt` timestamp before saving
productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Product = mongoose.model("Product", productSchema);
