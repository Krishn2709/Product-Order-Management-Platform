const {
  addProduct,
  editProduct,
  deleteProduct,
  restoreDeletedProduct,
  getAllProducts,
  addCategoryToProduct,
  getAllProductsForAdmin,
} = require("../models/productModel");
const cloudinary = require("../config/cloudinary");

// Add a new product
const addProductController = async (req, res) => {
  try {
    const {
      name,
      ws_code,
      sales_price,
      mrp,
      package_size,
      tags,
      category_id,
      is_active,
    } = req.body;

    const images = [];
    if (req.files && req.files.length > 0) {
      // Upload each image to Cloudinary
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        images.push(result.secure_url);
      }
    }

    const product = await addProduct(
      name,
      ws_code,
      sales_price,
      mrp,
      package_size,
      images,
      tags,
      category_id,
      is_active
    );

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit a product
const editProductController = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProduct = await editProduct(id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Soft delete a product
const deleteProductController = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteProduct(id);
    res
      .status(200)
      .json({ message: "Product deleted successfully (soft delete)" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Restore deleted product
const restoreDeletedProductController = async (req, res) => {
  const { id } = req.params;
  try {
    await restoreDeletedProduct(id);
    res.status(200).json({ message: "Product restored successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products
const getAllProductsController = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products for Admin
const getAllProductsForAdminController = async (req, res) => {
  try {
    const products = await getAllProductsForAdmin();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
};

// Add a category to a product
const addCategoryToProductController = async (req, res) => {
  const { id } = req.params;
  const { categoryId } = req.body;
  try {
    await addCategoryToProduct(id, categoryId);
    res.status(200).json({ message: "Category added to product successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addProductController,
  editProductController,
  deleteProductController,
  restoreDeletedProductController,
  getAllProductsController,
  addCategoryToProductController,
  getAllProductsForAdminController,
};
