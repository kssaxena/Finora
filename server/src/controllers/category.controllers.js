import { Category } from "../models/category.models.js";
import { Subcategory } from "../models/subcategory.models.js";
import { SuperAdmin } from "../models/superAdmin.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadImages } from "../utils/imageKit.io.js";

const AddCategory = asyncHandler(async (req, res) => {
  const { category, subcategory } = req.body;
  const { userId } = req.params;

  if (!category || !subcategory) {
    throw new ApiError(400, "Category and subcategory are required!");
  }

  if (typeof category !== "string" || typeof subcategory !== "string") {
    throw new ApiError(400, "Invalid input type for category or subcategory!");
  }

  // ✅ Find SuperAdmin
  const superAdmin = await SuperAdmin.findById(userId);
  if (!superAdmin) throw new ApiError(404, "SuperAdmin not found!");

  // ✅ Check if Category Already Exists
  const existingCategory = superAdmin.category.find(
    (cat) => cat.title.toLowerCase() === category.toLowerCase()
  );

  // ✅ Upload Subcategory Image
  if (!req.file) throw new ApiError(400, "Image file not found!");

  const image = await UploadImages(req.file.filename, {
    folderStructure: `images-Of-Subcategory/${subcategory.replace(
      /\s+/g,
      "-"
    )}`,
  });

  if (!image) throw new ApiError(500, "Image upload failed!");

  if (existingCategory) {
    // ✅ Check if subcategory already exists
    const existingSub = existingCategory.subcategory.find(
      (sub) => sub.title.toLowerCase() === subcategory.toLowerCase()
    );

    if (existingSub) {
      throw new ApiError(
        400,
        "Subcategory already exists under this category!"
      );
    }

    // ✅ Add new Subcategory to Existing Category
    existingCategory.subcategory.push({
      title: subcategory,
      image: { url: image.url, fileId: image.fileId, altText: subcategory },
    });
  } else {
    // ✅ Add New Category with Subcategory
    superAdmin.category.push({
      title: category,
      status: "Verified",
      subcategory: [
        {
          title: subcategory,
          image: { url: image.url, fileId: image.fileId, altText: subcategory },
        },
      ],
    });
  }

  await superAdmin.save();

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        superAdmin.category,
        "Category & Subcategory added successfully!"
      )
    );
});

const getSuperAdminCategoryById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // ✅ Just find SuperAdmin, no populate needed
  const superAdmin = await SuperAdmin.findById(userId);

  if (!superAdmin) {
    throw new ApiError(404, "SuperAdmin not found!");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        categories: superAdmin.category, // Already contains subcategories
      },
      "Fetched categories and subcategories successfully"
    )
  );
});

const GetSubcategoriesByCategory = asyncHandler(async (req, res) => {
  const { userId, categoryId } = req.params;

  // ✅ Find SuperAdmin
  const superAdmin = await SuperAdmin.findById(userId);
  if (!superAdmin) {
    throw new ApiError(404, "SuperAdmin not found!");
  }

  // ✅ Find category inside SuperAdmin
  const category = superAdmin.category.find(
    (cat) => cat._id.toString() === categoryId
  );

  if (!category) {
    throw new ApiError(404, "Category not found!");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        category: { _id: category._id, title: category.title },
        subcategories: category.subcategory, // ✅ Directly from embedded array
      },
      "Fetched subcategories successfully"
    )
  );
});

const AddNewSubcategoryToCategory = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { title, categoryId } = req.body;

  if (!title) {
    throw new ApiError(400, "Subcategory title is required!");
  }

  // ✅ Find SuperAdmin
  const superAdmin = await SuperAdmin.findById(userId);
  if (!superAdmin) {
    throw new ApiError(404, "SuperAdmin not found!");
  }

  // ✅ Find Category inside SuperAdmin
  const category = superAdmin.category.find(
    (cat) => cat._id.toString() === categoryId
  );

  if (!category) {
    throw new ApiError(404, "Category not found!");
  }

  // ✅ Check for image file
  if (!req.file) {
    throw new ApiError(400, "Image file is required!");
  }

  // ✅ Upload Image
  const image = await UploadImages(req.file.filename, {
    folderStructure: `images-Of-Subcategory/${title.replace(/\s+/g, "-")}`,
  });

  if (!image) {
    throw new ApiError(500, "Image upload failed!");
  }

  // ✅ Add Subcategory inside the Category
  category.subcategory.push({
    title,
    image: { url: image.url, fileId: image.fileId, altText: title },
  });

  await superAdmin.save();

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { categoryId: category._id, subcategories: category.subcategory },
        "Subcategory added successfully!"
      )
    );
});

const DeleteSubcategory = asyncHandler(async (req, res) => {
  const { subcategoryId, userId } = req.params;

  // Find subcategory
  const subcategory = await Subcategory.findById(subcategoryId);
  if (!subcategory) {
    throw new ApiError(404, "Subcategory not found!");
  }

  // Find the category that contains this subcategory
  const category = await Category.findById(subcategory.category);
  if (!category) {
    throw new ApiError(404, "Parent category not found!");
  }

  // Find super admin
  const superAdmin = await SuperAdmin.findById(userId);
  if (!superAdmin) {
    throw new ApiError(404, "SuperAdmin not found!");
  }

  // Remove subcategory from Category.subcategory[]
  category.subcategory = category.subcategory.filter(
    (id) => id.toString() !== subcategoryId
  );
  await category.save();

  // Remove subcategory from SuperAdmin.subcategory[]
  superAdmin.subcategory = superAdmin.subcategory.filter(
    (id) => id.toString() !== subcategoryId
  );
  await superAdmin.save();

  // Delete the subcategory document
  await Subcategory.findByIdAndDelete(subcategoryId);

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Subcategory deleted successfully"));
});

const getAllCategories = asyncHandler(async (req, res) => {
  // Fetch all categories and populate their subcategories
  const categories = await Category.find().populate("subcategory");

  if (!categories || categories.length === 0) {
    throw new ApiError(404, "No categories found!");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { categories },
        "Fetched all categories successfully"
      )
    );
});

export {
  AddCategory,
  getSuperAdminCategoryById,
  GetSubcategoriesByCategory,
  AddNewSubcategoryToCategory,
  DeleteSubcategory,
  getAllCategories,
};
