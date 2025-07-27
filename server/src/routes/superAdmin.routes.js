import { Router } from "express";
import {
  getVendorData,
  loginVendor,
  regenerateRefreshToken,
  registerVendor,
  editVendor,
  deleteVendor,
  getVendorDetailsByProductId,
  getAllVendors,
  getCurrentVendor,
  getVerifiedVendors,
  getUnverifiedVendors,
  rejectVendor,
  acceptVendor,
} from "../controllers/superAdmin.controllers.js";
import {
  VerifyOwner,
  VerifySuperAdminUser,
} from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

// router.use(VerifyVendorUser);

router.route("/register").post(
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "canceledCheque", maxCount: 1 },
  ]),
  registerVendor
);
router.route("/login").post(loginVendor);
router.route("/re-login").post(regenerateRefreshToken);
router.route("/vendor-profile/:vendorId").get(getVendorData);
router.route("/edit-vendor").post(editVendor);
router.route("/delete-vendor/:vendorId").post(deleteVendor);
router
  .route("/get-vendor-by-product-id/:productId")
  .get(getVendorDetailsByProductId);

//admin routes
router.route("/admin/get-all-vendor").get(VerifyOwner, getAllVendors);
router
  .route("/admin/get-all-verified-vendor")
  .get(VerifyOwner, getVerifiedVendors);
router
  .route("/admin/get-all-unverified-vendor")
  .get(VerifyOwner, getUnverifiedVendors);
router
  .route("/admin/get-current-vendor/:vendorId")
  .get(VerifyOwner, getCurrentVendor);
router
  .route("/admin/ban-vendor/:vendorId")
  .post(VerifyOwner, deleteVendor);
router
  .route("/admin/delete-vendor/:vendorId")
  .delete(VerifyOwner, deleteVendor);

router
  .route("/admin/reject-vendor/:vendorId")
  .get(VerifyOwner, rejectVendor);
router
  .route("/admin/accept-vendor/:vendorId")
  .get(VerifyOwner, acceptVendor);

export default router;
