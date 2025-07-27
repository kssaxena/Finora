import mongoose, { Schema } from "mongoose";

const subcategorySchema = new Schema(
  {
    title: { type: String, required: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: {
      fileId: {
        type: String, // ImageKit file ID
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
  },
  { timestamps: true }
);

export const Subcategory = mongoose.model("Subcategory", subcategorySchema);
