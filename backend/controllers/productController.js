const { addnewProduct, getallProducts, updateselectedProduct, deleteselectedProduct, deactivateselectedProduct } = require('../models/productModel');


// Add a new product
const addProduct = async (req, res) => {
    try {
        const product = await addnewProduct(req.body);
        res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all products
const getProducts = async (req, res) => {
    const { search, category, page, limit } = req.query;

    try {
        const products = await getallProducts({ search, category, page, limit });
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a product
const updateProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedProduct = await updateselectedProduct(id, req.body);

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    const { id } = req.params;  

    try {
        const deletedProduct = await deleteselectedProduct(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Deactivate the product
const deactivateProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedProduct = await deactivateselectedProduct(id);

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deactivated successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { addProduct, getProducts, updateProduct, deleteProduct,deactivateProduct };
