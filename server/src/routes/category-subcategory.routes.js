import Router from "express";
import {
  AddCategory,
  getSuperAdminCategoryById,
  GetSubcategoriesByCategory,
  AddNewSubcategoryToCategory,
  DeleteSubcategory,
} from "../controllers/category.controllers.js";
import {
  VerifyAdminUser,
  VerifySuperAdminUser,
} from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router
  .route("/category/add/new/:userId")
  .post(VerifySuperAdminUser, upload.single("image"), AddCategory);

router
  .route("/get-category-subcategory/:userId")
  .get(VerifySuperAdminUser, getSuperAdminCategoryById);

router
  .route("/get-subcategory/:categoryId")
  .get(VerifySuperAdminUser, GetSubcategoriesByCategory);

router
  .route("/new-subcategory/:userId")
  .post(
    VerifySuperAdminUser,
    upload.single("image"),
    AddNewSubcategoryToCategory
  );

router
  .route("/delete-subcategory/:subcategoryId/:userId")
  .delete(VerifySuperAdminUser, DeleteSubcategory);

export default router;
