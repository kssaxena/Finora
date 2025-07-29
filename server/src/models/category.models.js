import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    title: { type: String, required: true },
    subcategory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subcategory",
      },
    ],
    status: {
      type: String,
      required: true,
      default: "Under-review",
      enum: ["Verified", "Under-review"],
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
