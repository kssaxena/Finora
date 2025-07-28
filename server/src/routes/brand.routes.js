import Router from "express";

import { AddBrandToSuperAdmin } from "../controllers/brand.controllers.js";
import {
  VerifyAdminUser,
  VerifySuperAdminUser,
} from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router
  .route("/add/new/brand/:userId")
  .post(VerifySuperAdminUser, upload.single("image"), AddBrandToSuperAdmin);

export default router;
