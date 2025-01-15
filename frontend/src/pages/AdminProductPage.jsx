import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    categoryId: "",
  });
  const [categories, setCategories] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/products/admin");
      setProducts(response.data.products);
    } catch (error) {
      console.error(error.response?.data?.message || "Error fetching products");
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories");
      setCategories(response.data.categories);
    } catch (error) {
      console.error(
        error.response?.data?.message || "Error fetching categories"
      );
    }
  };

  // Add a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/products/add", newProduct);
      setProducts([...products, response.data.product]);
      setNewProduct({ name: "", price: 0, categoryId: "" });
    } catch (error) {
      console.error(error.response?.data?.message || "Error adding product");
    }
  };

  // Update a product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(
        `/products/edit/${editProduct.id}`,
        editProduct
      );
      setProducts(
        products.map((prod) =>
          prod.id === editProduct.id ? response.data.product : prod
        )
      );
      setEditProduct(null);
    } catch (error) {
      console.error(error.response?.data?.message || "Error updating product");
    }
  };

  // Soft delete/restore a product
  const toggleProductStatus = async (id, isDeleted) => {
    try {
      await axiosInstance.patch(`/products/delete/${id}`, {
        isDeleted: !isDeleted,
      });
      fetchProducts();
    } catch (error) {
      console.error(
        error.response?.data?.message || "Error toggling product status"
      );
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Product Management</h1>

      {/* Add New Product */}
      <form onSubmit={handleAddProduct} className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add New Product</h2>
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className="p-2 border mb-2 w-full"
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: +e.target.value })
          }
          className="p-2 border mb-2 w-full"
        />
        <select
          value={newProduct.categoryId}
          onChange={(e) =>
            setNewProduct({ ...newProduct, categoryId: e.target.value })
          }
          className="p-2 border mb-2 w-full"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Product
        </button>
      </form>

      {/* Product List */}
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Active</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">{product.price}</td>
              <td className="border p-2">{product.categoryName}</td>
              <td className="border p-2">
                {product.isDeleted ? "Inactive" : "Active"}
              </td>
              <td className="border p-2">
                <button
                  onClick={() =>
                    setEditProduct({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      categoryId: product.categoryId,
                    })
                  }
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    toggleProductStatus(product.id, product.isDeleted)
                  }
                  className={`px-2 py-1 rounded ${
                    product.isDeleted
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {product.isDeleted ? "Restore" : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Product Modal */}
      {editProduct && (
        <form onSubmit={handleUpdateProduct} className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Edit Product</h2>
          <input
            type="text"
            value={editProduct.name}
            onChange={(e) =>
              setEditProduct({ ...editProduct, name: e.target.value })
            }
            className="p-2 border mb-2 w-full"
          />
          <input
            type="number"
            value={editProduct.price}
            onChange={(e) =>
              setEditProduct({ ...editProduct, price: +e.target.value })
            }
            className="p-2 border mb-2 w-full"
          />
          <select
            value={editProduct.categoryId}
            onChange={(e) =>
              setEditProduct({ ...editProduct, categoryId: e.target.value })
            }
            className="p-2 border mb-2 w-full"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Update Product
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminProductPage;
