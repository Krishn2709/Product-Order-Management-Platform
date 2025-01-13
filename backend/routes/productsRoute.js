const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeCustomer, authorizeAdmin } = require('../middleware/authenticate');
const { addProduct, getProducts, updateProduct, deleteProduct, deactivateProduct } = require('../controllers/productController');

// Add a new product (Admin only)
router.post("/add", addProduct);

// Get all products
router.get("/", getProducts);

// Edit an existing product (Admin only)
router.put("/edit/:id", updateProduct);

// Delete a product (Admin only)
router.delete("/delete/:id", authenticateUser,authorizeAdmin,deleteProduct);

// Deactivate a product (Admin only)
router.patch("/deactivate/:id", deactivateProduct);

module.exports = router;
