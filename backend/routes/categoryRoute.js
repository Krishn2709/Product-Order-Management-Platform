const express = require("express");
const {
  createCategory,
  getCategories,
} = require("../controllers/categoryController");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middleware/authenticate");
const router = express.Router();

// Add a new category
router.post("/", createCategory, authenticateUser, authorizeAdmin);

// Get all categories
router.get("/", getCategories);

module.exports = router;
