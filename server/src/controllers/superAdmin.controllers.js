import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { SuperAdmin as VendorUser } from "../models/superAdmin.models.js";
import { Product } from "../models/product.models.js";
import jwt from "jsonwebtoken";
import { UploadImages } from "../utils/imageKit.io.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerVendor = asyncHandler(async (req, res, next) => {
  const {
    name,
    email,
    contactNumber,
    address,
    city,
    state,
    country,
    postalCode, // Default to an empty object to avoid destructuring issues
    gstNumber,
    businessName,
    accountHolderName,
    accountNumber,
    bankName,
    ifscCode,
    password,
    panNumber,
  } = req.body;

  if (
    !name ||
    !email ||
    !contactNumber ||
    !address ||
    !city ||
    !state ||
    !country ||
    !postalCode ||
    !gstNumber ||
    !businessName ||
    !accountHolderName ||
    !accountNumber ||
    !bankName ||
    !ifscCode ||
    !password ||
    !panNumber
  ) {
    return next(new ApiError(400, "All fields are required"));
  }

  // Check if vendor already exists by email
  const existingVendor = await VendorUser.findOne({ email });
  if (existingVendor) {
    return next(new ApiError(400, "A vendor with this email already exists"));
  }

  const imageFile = req.files["image"][0];
  const canceledChequeFile = req.files["canceledCheque"]?.[0];

  if (!imageFile) throw new ApiError(404, "Image file not found!");
  if (!canceledChequeFile)
    throw new ApiError(404, "canceled cheque image file not found!");

  const image = await UploadImages(
    imageFile.filename,
    {
      folderStructure: `all-vendor/${name.split(" ").join("-")}/GST-Image`,
    },
    [`${name.split(" ").join("-")}-GST-Id`, `${gstNumber}`]
  );
  const canceledChequeImage = await UploadImages(
    canceledChequeFile.filename,
    {
      folderStructure: `all-vendor/${name
        .split(" ")
        .join("-")}/canceled-Cheque-Image`,
    },
    [`${name.split(" ").join("-")}-canceled-Cheque`]
  );

  if (!image)
    throw new ApiError(
      500,
      "Failed to upload image due to internal error! Please try again"
    );
  if (!canceledChequeImage)
    throw new ApiError(
      500,
      "Failed to upload canceled cheque image due to internal error! Please try again"
    );

  // Create new vendor instance
  const newVendor = new VendorUser({
    name,
    email,
    contactNumber,
    panNumber,
    location: {
      address,
      city,
      state,
      country,
      postalCode,
    },
    businessDetails: {
      gstNumber,
      businessName,
    },
    bankDetails: {
      accountHolderName,
      accountNumber,
      bankName,
      ifscCode,
    },
    imageGST: {
      url: image.url,
      fileId: image.fileId,
      altText: name,
    },
    password, // Password will be hashed in the pre-save middleware
    canceledCheque: {
      fileId: canceledChequeImage.fileId,
      url: canceledChequeImage.url,
    },
  });

  // Save the vendor to the database
  await newVendor.save();

  // Generate access and refresh tokens
  const accessToken = newVendor.generateAccessToken();
  const refreshToken = newVendor.generateRefreshToken();

  // Return success response
  const response = new ApiResponse(201, {
    vendor: {
      id: newVendor._id,
      name: newVendor.name,
      email: newVendor.email,
      contactNumber: newVendor.contactNumber,
      panNumber: newVendor.panNumber,
      location: newVendor.location,
      status: newVendor.status,
      createdAt: newVendor.createdAt,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  });

  res.status(response.statusCode).json(response);
});

const loginVendor = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return next(new ApiError(400, "Email and password are required"));
  }

  // Check if vendor exists
  const vendor = await VendorUser.findOne({ email });
  if (!vendor) {
    return next(new ApiError(401, "Invalid email or password"));
  }

  // Check if the password is correct
  const isPasswordValid = await vendor.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return next(new ApiError(401, "Invalid email or password"));
  }

  if (!vendor.isVerified) throw new ApiError(401, "You are not verified yet!");

  // Generate access and refresh tokens
  const accessToken = vendor.generateAccessToken();
  const refreshToken = vendor.generateRefreshToken();

  // Return success response
  const response = new ApiResponse(200, {
    vendor: {
      id: vendor._id,
      name: vendor.name,
      email: vendor.email,
      contactNumber: vendor.contactNumber,
      location: vendor.location,
      status: vendor.status,
      createdAt: vendor.createdAt,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  });

  res.status(response.statusCode).json(response);
});

const getVendorData = asyncHandler(async (req, res, next) => {
  const vendorId = req.user._id; // Assumes vendor's ID is available from authentication middleware

  // Fetch vendor profile
  const vendor = await VendorUser.findById(vendorId);

  if (!vendor) {
    return next(new ApiError(404, "Vendor not found"));
  }

  // Fetch products associated with the vendor
  const products = await Product.find({ vendor: vendorId });

  // Prepare and send response
  const response = new ApiResponse(200, {
    vendor: {
      name: vendor.name,
      email: vendor.email,
      contactNumber: vendor.contactNumber || "",
      businessName: vendor.businessName || "",
      address: vendor.address || "",
    },
    products,
  });

  res.status(response.statusCode).json(response);
});

const regenerateRefreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.RefreshToken || req.body.RefreshToken;

  if (!token) throw new ApiError(401, "Unauthorized request");

  const DecodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  console.log("DecodedToken", DecodedToken);

  const user = await VendorUser.findById(DecodedToken._id).select(
    "-password -refreshToken"
  );
  // console.log(user);

  if (!user) throw new ApiError(400, "Invalid Token");

  const AccessToken = user.generateAccessToken();
  const RefreshToken = user.generateRefreshToken();

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("RefreshToken", RefreshToken, options)
    .cookie("AccessToken", AccessToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user,
          tokens: {
            AccessToken,
            RefreshToken,
          },
        },
        "Refresh token regenerated successfully"
      )
    );
});

const editVendor = asyncHandler(async (req, res, next) => {
  const { vendorId } = req.params;
  const updateData = req.body;

  const vendor = await VendorUser.findById(vendorId);

  if (!vendor) {
    throw new ApiError(404, `Vendor with ID ${vendorId} not found`);
  }

  Object.assign(vendor, updateData);
  vendor.updatedAt = Date.now();

  await vendor.save();

  res
    .status(200)
    .json(new ApiResponse(200, vendor, "Vendor updated successfully"));
});

const deleteVendor = asyncHandler(async (req, res, next) => {
  const { vendorId } = req.params;

  const vendor = await VendorUser.findByIdAndDelete(vendorId);

  if (!vendor) {
    throw new ApiError(404, `Vendor with ID ${vendorId} not found`);
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Vendor deleted successfully"));
});

const getVendorDetailsByProductId = async (req, res) => {
  const { productId } = req.params;
  // console.log("controller reached", productId);

  try {
    // Find the product and populate the vendor details
    const product = await Product.findById(productId).populate("vendor");

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // Send the vendor details in the response
    const vendorDetails = product.vendor;
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          vendorDetails,
          "Vendor details fetched successfully"
        )
      );
  } catch (error) {
    console.log(error);
  }
};

const getAllVendors = asyncHandler(async (req, res) => {
  const vendors = await VendorUser.find({});
  res.json(
    new ApiResponse(200, { vendors }, "All vendors fetched successfully")
  );
});

const getVerifiedVendors = asyncHandler(async (req, res) => {
  const vendor = await VendorUser.find({ isVerified: true });
  res.json(
    new ApiResponse(200, { vendor }, "Verified vendors fetched successfully")
  );
});

const getUnverifiedVendors = asyncHandler(async (req, res) => {
  const vendor = await VendorUser.find({ isVerified: false });
  res.json(
    new ApiResponse(200, { vendor }, "Unverified vendors fetched successfully")
  );
});

const getCurrentVendor = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;
  try {
    const vendor = await VendorUser.findById(vendorId);
    if (!vendor) {
      throw new ApiError(404, "vendor not found");
    }
    res.json(new ApiResponse(200, { vendor }, "vendor fetched successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong");
  }
});

const VendorBan = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;

  const vendor = await VendorUser.findById(vendorId);
  if (!vendor) throw new ApiError(404, "vendor not found");

  vendor.isBanned = !vendor.isBanned;
  vendor.save();
  res.status(200).json(new ApiResponse(200, vendor, "vendor status updated"));
});

const rejectVendor = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;

  if (!vendorId) throw new ApiError(404, "vendor Id not found");
  const vendor = await VendorUser.findByIdAndDelete(vendorId);

  if (!vendor) throw new ApiError(404, "Vendor not found");

  res.status(200).json(new ApiResponse(200, null, "Vendor rejected!"));
});

const acceptVendor = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;
  if (!vendorId) throw new ApiError(404, "Vendor Id is required!");

  const vendor = await VendorUser.findByIdAndUpdate(
    vendorId,
    { isVerified: true },
    { new: true }
  );

  if (!vendor) throw new ApiError(404, "Vendor not found");
  res.status(200).json(new ApiResponse(200, vendor, "Vendor accepted!"));
});

export {
  registerVendor,
  loginVendor,
  getVendorData,
  regenerateRefreshToken,
  editVendor,
  deleteVendor,
  getVendorDetailsByProductId,
  getAllVendors,
  getVerifiedVendors,
  getUnverifiedVendors,
  getCurrentVendor,
  VendorBan,
  acceptVendor,
  rejectVendor,
};
