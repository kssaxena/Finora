import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadImages } from "../utils/imageKit.io.js";
import { Category } from "../models/category.models.js";
import { Subcategory } from "../models/subcategory.models.js";
import { Product } from "../models/product.models.js";
import { SuperAdmin } from "../models/superAdmin.models.js";
import { Brand } from "../models/brand.models.js";

const registerProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    subcategory,
    stockQuantity,
    sku,
    specifications,
    tags,
    brand,
    MRP,
    // SP,
    discount,
  } = req.body;
  console.log("Controller Reached");
  console.log([
    name,
    description,
    category,
    subcategory,
    stockQuantity,
    sku,
    specifications,
    tags,
    brand,
    MRP,
    // SP,
    discount,
  ]);

  const superAdminId = req.user._id;

  // Validate required fields
  if (
    !name ||
    !description ||
    !category ||
    !subcategory ||
    !stockQuantity ||
    !brand ||
    !sku || // Stock keeping unit => Provided to every unique type of products for keeping track of quantity.
    !MRP || // Maximum Retail Price
    !discount // Discount percentage
  ) {
    throw new ApiError(400, "All required fields must be filled");
  }

  const allTags = tags.split(",");
  console.log("allTags: ", allTags, typeof allTags);

  // Validate main category
  const existingCategory = await Category.findById(category);
  if (!existingCategory) throw new ApiError(400, "Invalid category selected");

  const existingSubCategory = await Subcategory.findById(subcategory);
  if (!existingSubCategory)
    throw new ApiError(400, "Invalid subcategory selected");

  // Check if SKU already exists
  const existingProduct = await Product.findOne({ sku });
  if (existingProduct) {
    // throw new ApiError(400, "A product with this SKU already exists");
    throw new ApiError(
      400,
      "This product SKU might have already been added!! Please try increasing the quantity"
    );
  }

  // Verify vendor exists
  const superAdmin = await SuperAdmin.findById(superAdminId);
  if (!superAdmin) {
    throw new ApiError(404, "superAdmin not found");
  }

  const checkBrand = await Brand.findById(brand);
  if (!checkBrand) throw new ApiError(404, "Brand not found");

  const ImageFile = req.file;
  const UploadedImage = await UploadImages(
    ImageFile.filename,
    {
      folderStructure: `all-superAdmin/${superAdmin.name
        .split(" ")
        .join("-")}/${category.split(" ").join("-")}/${subcategory
        .split(" ")
        .join("-")}/${name.split(" ").join("-")}`,
    },
    tags,
    { description, category, subcategory }
  );

  // console.log("UploadedImage", UploadedImage);

  // Create a new product instance
  const newProduct = new Product({
    name,
    description,
    category,
    subcategory,
    price: {
      MRP,
      sellingPrice: MRP - (MRP * discount) / 100,
      discount,
      discountedPrice: MRP - (MRP * discount) / 100,
    },
    stockQuantity,
    sku,
    images: {
      url: UploadedImage.url,
      altText: name,
      fileId: UploadedImage.fileId,
    },
    specifications: {
      details: `${specifications}`,
    },
    tags: allTags,
    superAdmin: superAdminId,
    brand,
  });

  // Save the product to the database
  await newProduct.save();

  // Add the product to the superAdmin's products list
  superAdmin.products.push(newProduct._id);
  await superAdmin.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { product: newProduct },
        "Product added successfully"
      )
    );
});

const getAllProductForAdmin = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("category", "title")
    .populate("subcategory", "title")
    .populate("vendor", "name email")
    .populate("brand", "title logo")
    .sort({ createdAt: -1 });

  if (!products || products.length === 0) {
    throw new ApiError(404, "No products found");
  }

  const response = new ApiResponse(
    200,
    products,
    "Products fetched successfully"
  );
  res.status(response.statusCode).json(response);
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const {
      category,
      subcategory,
      vendor,
      page = 1,
      limit = 10,
      userCity,
      userAddress,
    } = req.query;
    // const { userAddress } = req.params;

    // console.log({ query: req.query, params: req.params, body: req.body });

    // console.log("userCity", userCity);

    if (userCity) {
      const vendorsInCity = await VendorUser.find({
        "location.city": userCity,
      }).populate("products");
      if (vendorsInCity || vendorsInCity.length > 0) {
        const productsInCity = vendorsInCity.reduce((acc, vendor) => {
          if (vendor.products && vendor.products.length > 0) {
            acc.push(...vendor.products);
          }
          return acc;
        }, []);
        return res.status(200).json(
          new ApiResponse(
            200,
            {
              total: productsInCity.length,
              page: 1,
              limit: productsInCity.length,
              products: productsInCity,
            },
            `Products fetched successfully for ${userCity}`
          )
        );
      }
    }

    if (userAddress) {
      const aggregationPipeline = [
        // First, match products by category and subcategory (more efficient to do this first)
        {
          $match: {
            category: mongoose.Types.ObjectId(category),
            subcategory: mongoose.Types.ObjectId(subcategory),
          },
        },
        // Then join with the VendorUser collection to access location data
        {
          $lookup: {
            from: "VendorUser", // Make sure this matches your VendorUser collection name
            localField: "vendor",
            foreignField: "_id",
            as: "vendorData",
          },
        },
        // Unwind the vendorData array (since lookup returns an array)
        {
          $unwind: "$vendorData",
        },
        // Now filter by city
        {
          $match: {
            "vendorData.location.city": userAddress,
          },
        },
        // Optionally project only the fields you need
        {
          $project: {
            name: 1,
            description: 1,
            price: 1,
            stockQuantity: 1,
            images: 1,
            status: 1,
            // Include other fields you need
            "vendorData.location.city": 1,
            "vendorData.location.address": 1,
          },
        },
      ];

      const filteredProducts = await Product.aggregate(aggregationPipeline);
      return res.status(200).json({
        success: true,
        data: filteredProducts,
      });
    }

    const filter = {};
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (vendor) filter.vendor = vendor;

    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("vendor", "name email")
      .populate("brand")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    if (!products || products.length === 0) {
      throw new ApiError(404, "No products found");
    }

    const totalProducts = await Product.countDocuments(filter);

    const response = new ApiResponse(
      200,
      {
        total: totalProducts,
        page: parseInt(page),
        limit: parseInt(limit),
        products,
      },
      "Products fetched successfully"
    );

    res.status(response.statusCode).json(response);
  } catch (error) {
    throw new ApiError(500, error.message || "Internal Server Error");
  }
});

const getProductsOfVendor = asyncHandler(async (req, res) => {
  // console.log("controller reached");
  const { vendorId } = req.params;

  if (!vendorId) throw new ApiError(400, "Vendor ID is required");

  // Fetch the products of the given vendor ID
  const vendor = await VendorUser.findById(vendorId).populate({
    path: "products",
    populate: [
      { path: "category" }, // Populate category inside products
      { path: "subcategory" }, // Populate subcategory inside products
      { path: "brand" }, // Populate subcategory inside products
    ],
  });

  if (!vendor) throw new ApiError(404, "Vendor not found");

  const response = new ApiResponse(
    200,
    vendor.products,
    "Products fetched successfully"
  );
  res.status(response.statusCode).json(response);
});

const getProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Fetch the product by ID
  const product = await Product.findById(productId)
    .populate("category")
    .populate("subcategory")
    .populate("vendor")
    .populate("brand");

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

const editProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Find and update the product by ID
  const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
    new: true, // Return the updated document
    runValidators: true, // Ensure validation is run on updates
  });

  if (!updatedProduct) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: updatedProduct,
  });
});

const AddProductImages = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const images = req.files; // Array of uploaded images

  if (!productId) throw new ApiError(400, "Product ID is required");

  // Find the product by ID
  const product = await Product.findById(productId)
    .populate("vendor")
    .populate("category")
    .populate("subcategory");
  const { vendor, category, subcategory, name } = product;

  if (!product) throw new ApiError(404, "Product not found");

  // Upload each image and add to the product's images array
  for (const image of images) {
    const uploadedImage = await UploadImages(image.filename, {
      folderStructure: `all-vendor/${vendor.name
        .split(" ")
        .join("-")}/${category.title.split(" ").join("-")}/${subcategory.title
        .split(" ")
        .join("-")}/${name.split(" ").join("-")}`,
    });
    product.images.push({
      url: uploadedImage.url,
      altText: product.name,
      fileId: uploadedImage.fileId,
    });
  }

  // Save the updated product
  await product.save();

  res.status(200).json({
    success: true,
    message: "Images added successfully",
    data: product,
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Find the product by ID
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Delete the product
  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

const getProductByCategory = asyncHandler(async (req, res) => {
  // console.log("Fetching products by category");

  const { category, subcategory, userAddress } = req.params;

  // Check if both category and subcategory are provided
  if (!category || !subcategory) {
    return res.status(400).json({
      success: false,
      message: "Category and subcategory are required.",
    });
  }

  console.log({ query: req.query, params: req.params, body: req.body });
  console.log("userAddress: ", userAddress);

  if (userAddress) {
    const aggregationPipeline = [
      // First, match products by category and subcategory (more efficient to do this first)
      {
        $match: {
          category: mongoose.Types.ObjectId(category),
          subcategory: mongoose.Types.ObjectId(subcategory),
        },
      },
      // Then join with the VendorUser collection to access location data
      {
        $lookup: {
          from: "VendorUser", // Make sure this matches your VendorUser collection name
          localField: "vendor",
          foreignField: "_id",
          as: "vendorData",
        },
      },
      // Unwind the vendorData array (since lookup returns an array)
      {
        $unwind: "$vendorData",
      },
      // Now filter by city
      {
        $match: {
          "vendorData.location.city": userAddress,
        },
      },
      // Optionally project only the fields you need
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          stockQuantity: 1,
          images: 1,
          status: 1,
          // Include other fields you need
          "vendorData.location.city": 1,
          "vendorData.location.address": 1,
        },
      },
    ];

    const filteredProducts = await Product.aggregate(aggregationPipeline);
    return res.status(200).json({
      success: true,
      data: filteredProducts,
    });
  }

  // Fetch the product by category and subcategory
  const products = await Product.find({
    category,
    subcategory,
  }).populate("brand");

  // Check if products are found
  if (!products || products.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No products found for the selected category and subcategory.",
    });
  }

  // Return the found products
  return res.status(200).json({
    success: true,
    data: products,
  });
});

const addStockQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const quantityToAdd = Number(req.body.quantityToAdd); // Quantity to add to the stock
  console.log("Hello from controller line 357", productId, quantityToAdd);

  if (!productId) throw new ApiError(400, "Product ID is required");
  if (quantityToAdd <= 0)
    throw new ApiError(400, "Quantity to add must be greater than zero");

  // Find the product by ID
  const product = await Product.findById(productId);

  if (!product) throw new ApiError(404, "Product not found");

  // Add the quantity to the stock
  product.stockQuantity = product.stockQuantity + quantityToAdd;
  await product.save();

  const response = new ApiResponse(
    200,
    { stockQuantity: product.stockQuantity },
    "Stock quantity updated successfully"
  );
  res.status(response.statusCode).json(response);
});

// Controller to remove quantity from a product's stock
const removeStockQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const quantityToRemove = Number(req.body.quantityToRemove);

  if (!productId) throw new ApiError(400, "Product ID is required");
  if (quantityToRemove <= 0)
    throw new ApiError(400, "Quantity to remove must be greater than zero");

  // Find the product by ID
  const product = await Product.findById(productId);

  if (!product) throw new ApiError(404, "Product not found");

  // Ensure the quantity to remove is not more than the available stock
  if (product.stockQuantity < quantityToRemove) {
    throw new ApiError(
      400,
      "Insufficient stock to remove the specified quantity"
    );
  }

  // Remove the quantity from the stock
  product.stockQuantity -= quantityToRemove;
  await product.save();

  const response = new ApiResponse(
    200,
    { stockQuantity: product.stockQuantity },
    "Stock quantity updated successfully"
  );
  res.status(response.statusCode).json(response);
});

export {
  registerProduct,
  getAllProductForAdmin,
  getAllProducts,
  getProduct,
  editProduct,
  AddProductImages,
  deleteProduct,
  getProductsOfVendor,
  getProductByCategory,
  addStockQuantity,
  removeStockQuantity,
  //   searchProducts,
};
