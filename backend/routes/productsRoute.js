const express = require("express");
const upload = require("../middleware/multer");
const router = express.Router();
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middleware/authenticate");
const {
  addProductController,
  editProductController,
  deleteProductController,
  restoreDeletedProductController,
  getAllProductsController,
  getAllProductsForAdminController,
  addCategoryToProductController,
} = require("../controllers/productController");

// Get all products
router.get("/", getAllProductsController);

router.get(
  "/admin",
  authenticateUser,
  authorizeAdmin,
  getAllProductsForAdminController
);

router.post(
  "/add",
  authenticateUser,
  authorizeAdmin,
  upload.array("images"),
  addProductController
);
router.put(
  "/edit/:id",
  authenticateUser,
  authorizeAdmin,
  editProductController
);
router.delete(
  "/delete/:id",
  authenticateUser,
  authorizeAdmin,
  deleteProductController
);
router.post(
  "/add-category/:id",
  authenticateUser,
  authorizeAdmin,
  addCategoryToProductController
);
router.put(
  "/restore/:id",
  authenticateUser,
  authorizeAdmin,
  restoreDeletedProductController
);

router.post(
  "/:id/category",
  authenticateUser,
  authorizeAdmin,
  addCategoryToProductController
);

module.exports = router;
