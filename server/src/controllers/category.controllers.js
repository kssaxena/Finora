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
    throw new ApiError(404, "Category or subcategory is required!");
  }

  if (typeof category !== "string" || typeof subcategory !== "string") {
    throw new ApiError(400, "Invalid input type for category or subcategory!");
  }

  const existingCategory = await Category.findOne({ title: category });
  if (existingCategory) {
    throw new ApiError(400, "Category already exists!");
  }

  const superAdmin = await SuperAdmin.findById(userId);
  if (!superAdmin) {
    throw new ApiError(404, "SuperAdmin not found!");
  }

  // Create new category
  const newCategory = await Category.create({
    title: category,
    status: "Verified",
  });

  // Check for image
  const imageFile = req.file;
  if (!imageFile) throw new ApiError(404, "Image file not found!");

  const image = await UploadImages(imageFile.filename, {
    folderStructure: `images-Of-Subcategory/${subcategory
      .split(" ")
      .join("-")}`,
  });

  if (!image) {
    throw new ApiError(500, "Failed to upload image! Please try again");
  }

  // Create subcategory
  const newSubcategory = await Subcategory.create({
    title: subcategory,
    category: newCategory._id,
    image: { url: image.url, alt: subcategory, fileId: image.fileId },
  });

  if (!newCategory || !newSubcategory) {
    throw new ApiError(
      500,
      "Failed to create category or subcategory! Please try again"
    );
  }

  // Push subcategory to category
  newCategory.subcategory.push(newSubcategory._id);
  await newCategory.save();

  // Push category & subcategory to SuperAdmin
  superAdmin.category.push(newCategory._id);
  superAdmin.subcategory.push(newSubcategory._id);
  await superAdmin.save();

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { category: newCategory, subcategory: newSubcategory },
        "Successfully created a new category and updated SuperAdmin"
      )
    );
});

const getSuperAdminCategoryById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Find super admin and populate categories and subcategories
  const superAdmin = await SuperAdmin.findById(userId)
    .populate({
      path: "category",
      model: "Category",
      populate: {
        path: "subcategory",
        model: "Subcategory",
      },
    })
    .populate("subcategory");

  if (!superAdmin) {
    throw new ApiError(404, "SuperAdmin not found!");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        categories: superAdmin.category, // Array of categories with populated subcategories
        subcategories: superAdmin.subcategory, // Direct subcategories array
      },
      "Fetched categories and subcategories successfully"
    )
  );
});

const GetSubcategoriesByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  // Find the category and populate its subcategories
  const category = await Category.findById(categoryId).populate("subcategory");

  if (!category) {
    throw new ApiError(404, "Category not found!");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        category: { _id: category._id, title: category.title },
        subcategories: category.subcategory,
      },
      "Fetched subcategories successfully"
    )
  );
});

const AddNewSubcategoryToCategory = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { title, categoryId } = req.body; // userId (superAdmin) required to update their subcategory array
  console.log(title, categoryId, userId);

  if (!title) {
    throw new ApiError(400, "Subcategory title is required!");
  }

  // Find category
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found!");
  }

  // Find super admin
  const superAdmin = await SuperAdmin.findById(userId);
  if (!superAdmin) {
    throw new ApiError(404, "SuperAdmin not found!");
  }

  // Check for image file
  const imageFile = req.file;
  if (!imageFile) {
    throw new ApiError(400, "Image file is required!");
  }

  // Upload image
  const image = await UploadImages(imageFile.filename, {
    folderStructure: `images-Of-Subcategory/${title.split(" ").join("-")}`,
  });

  if (!image) {
    throw new ApiError(500, "Image upload failed!");
  }

  // Create new subcategory
  const newSubcategory = await Subcategory.create({
    title,
    category: category._id,
    image: { url: image.url, alt: title, fileId: image.fileId },
  });

  // Add subcategory to category
  category.subcategory.push(newSubcategory._id);
  await category.save();

  // Add subcategory to super admin
  superAdmin.subcategory.push(newSubcategory._id);
  await superAdmin.save();

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { subcategory: newSubcategory },
        "Subcategory added successfully"
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
