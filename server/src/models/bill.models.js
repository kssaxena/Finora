import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    // Customer Details
    customer: {
      name: {
        type: String,
        required: true,
      },
      contact: {
        type: String,
        required: true,
      },
      email: {
        type: String,
      },
      address: {
        type: String,
      },
    },

    // Products Billed
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        discount: {
          type: Number,
          default: 0, // percentage (e.g., 10 means 10%)
        },
        taxRate: {
          type: Number,
          default: 0, // percentage
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],

    // Bill Summary
    summary: {
      subtotal: {
        type: Number,
        required: true,
      },
      totalDiscount: {
        type: Number,
        default: 0,
      },
      totalTax: {
        type: Number,
        default: 0,
      },
      grandTotal: {
        type: Number,
        required: true,
      },
    },

    // Payment Info
    payment: {
      method: {
        type: String,
        enum: ["Cash", "Card", "UPI", "Online", "Bank Transfer", "Other"],
        required: true,
      },
      status: {
        type: String,
        enum: ["Pending", "Completed", "Failed", "Refunded"],
        default: "Pending",
      },
      transactionId: {
        type: String,
      },
      paidAmount: {
        type: Number,
        required: true,
      },
      dueAmount: {
        type: Number,
        default: 0,
      },
    },

    // Invoice Info
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Operator", // user who created the bill
      required: true,
    },

    // Additional Fields
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Bill = mongoose.model("Bill", billSchema);
