import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadImages } from "../utils/imageKit.io.js";
import { Admin } from "../models/admin.models.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await Admin.findById(userId);
    const AccessToken = await user.generateAccessToken();
    const RefreshToken = await user.generateRefreshToken();

    return { AccessToken, RefreshToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

const registerAdmin = asyncHandler(async (req, res) => {
  const {
    name,
    contact,
    email,
    password,
    panNumber,
    
    // Operator creation not handled at registration
  } = req.body;

  // Validate required fields
  if (!name || !contact || !email || !password || !panNumber) {
    throw new ApiError(400, "Please provide all required fields");
  }

  if (contact.length !== 10) {
    throw new ApiError(400, "Contact number must be 10 digits long");
  }

  // Check for existing admin
  const existingAdmin = await Admin.findOne({
    $or: [{ "personal.contact": contact }, { "personal.email": email }],
  });

  if (existingAdmin) {
    throw new ApiError(400, "Admin with same contact or email already exists");
  }

  const imageFile = req.file;
  if (!imageFile) throw new ApiError(404, "Image file not found!");

  const images = await UploadImages(
    imageFile.filename,
    {
      folderStructure: `all-admins/${name.split(" ").join("-")}/logo_`,
    },
    [`${name.split(" ").join("-")}-logo_`, `${panNumber}`]
  );

  if (!images)
    throw new ApiError(
      500,
      "Failed to upload image due to internal error! Please try again"
    );

  // Create new Admin
  const admin = await Admin.create({
    personal: {
      name,
      contact,
      email,
      password,
      panNumber,
    },
    image: [
      {
        url: images.url,
        fileId: images.fileId,
        filePath: images.filePath,
      },
    ],
  });

  // Generate tokens
  const AccessToken = admin.generateAccessToken();
  const RefreshToken = admin.generateRefreshToken();

  // Send response
  res
    .status(201)
    .cookie("RefreshToken", RefreshToken)
    .cookie("AccessToken", AccessToken)
    .json(
      new ApiResponse(
        201,
        {
          admin,
          tokens: {
            AccessToken,
            RefreshToken,
          },
        },
        "Admin registration completed successfully"
      )
    );
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { contact, password } = req.body;

  if (!contact || !password) {
    throw new ApiError(400, "Please provide all required fields");
  }

  if (contact.length !== 10) {
    throw new ApiError(400, "Contact number must be 10 digits");
  }

  // Find user using nested contact field
  const admin = await Admin.findOne({ "personal.contact": contact });

  if (!admin) {
    throw new ApiError(404, "Invalid contact number");
  }

  // Validate password using instance method
  const isValid = await admin.isPasswordCorrect(password);

  if (!isValid) {
    throw new ApiError(401, "Incorrect credentials");
  }

  // Generate tokens from instance methods
  const AccessToken = admin.generateAccessToken();
  const RefreshToken = admin.generateRefreshToken();

  return res
    .status(200)
    .cookie("RefreshToken", RefreshToken)
    .cookie("AccessToken", AccessToken)
    .json(
      new ApiResponse(
        200,
        {
          admin,
          tokens: {
            AccessToken,
            RefreshToken,
          },
        },
        "You are logged in successfully"
      )
    );
});

const autoLogin = asyncHandler(async (req, res) => {
  const token = req.cookies.RefreshToken || req.body.RefreshToken;

  if (!token) throw new ApiError(401, "Unauthorized request");

  const DecodedToken = Jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const admin = await Admin.findById(DecodedToken._id).select(
    "-password -refreshToken"
  );

  if (!admin) throw new ApiError(400, "Invalid Token");

  const { RefreshToken, AccessToken } = await generateAccessAndRefreshTokens(
    admin._id
  );

  return res
    .status(201)
    .cookie("RefreshToken", RefreshToken)
    .cookie("AccessToken", AccessToken)
    .json(
      new ApiResponse(
        201,
        {
          admin,
          tokens: {
            AccessToken,
            RefreshToken,
          },
        },
        "Refresh token regenerated successfully"
      )
    );
});



export { registerAdmin, loginAdmin, autoLogin };
