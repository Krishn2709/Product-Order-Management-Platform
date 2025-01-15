const express = require("express");
const {
  createCategory,
  getCategories,
} = require("../controllers/categoryController");
const router = express.Router();

// Add a new category
router.post("/", createCategory);

// Get all categories
router.get("/", getCategories);

module.exports = router;