const { addCategory, getAllCategories } = require("../models/categoryModel");

// Add a new category
const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    // Validate the category name
    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ message: "Category name is required and must be a string" });
    }

    // Add the category to the database
    const category = await addCategory(name);
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    // Handle unique constraint error
    if (error.code === "23505") {
      return res.status(400).json({ message: "Category name must be unique" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    // Retrieve all categories from the database
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createCategory, getCategories };