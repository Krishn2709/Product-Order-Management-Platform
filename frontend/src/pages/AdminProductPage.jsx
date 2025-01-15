import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    ws_code: 0,
    sales_price: 0,
    mrp: 0,
    package_size: 0,
    tags: [],
    categories: [],
    images: [],
    is_active: true,
  });
  const [categories, setCategories] = useState([]);
  const [editProduct, setEditProduct] = useState([]);

  // Fetch all products for admin
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/products/admin");

      if (response.data && Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.error("Products not found or invalid data structure");
        setProducts([]); // fallback to an empty array
      }
    } catch (error) {
      console.error(error.response?.data?.message || "Error fetching products");
      setProducts([]); // fallback to an empty array in case of error
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories");
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error(
        error.response?.data?.message || "Error fetching categories"
      );
      setCategories([]); // fallback to empty array in case of error
    }
  };

  // Add a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      console.log(newProduct);
      const response = await axiosInstance.post("/products/add", newProduct);
      setProducts([...products, response.data]);
      setNewProduct({
        name: "",
        ws_code: 0,
        sales_price: 0,
        mrp: 0,
        package_size: 0,
        tags: [],
        categories: [],
        images: [],
        is_active: true,
      });
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
      // Update the products list with the edited product
      setProducts(
        products.map((prod) =>
          prod.id === editProduct.id ? response.data : prod
        )
      );
      setEditProduct(null); // Reset edit state
    } catch (error) {
      console.error(error.response?.data?.message || "Error updating product");
    }
  };

  // Toggle product status (Active/Inactive)
  const toggleProductStatus = async (id, isActive) => {
    try {
      await axiosInstance.patch(`/products/delete/${id}`, {
        isActive: !isActive,
      });
      setProducts(
        products.map((product) =>
          product.id === id ? { ...product, is_active: !isActive } : product
        )
      );
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Admin Product Management</h1>

      {/* Add New Product */}
      <form
        onSubmit={handleAddProduct}
        className="mb-6 bg-white p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
        />
        <input
          type="number"
          placeholder="WS Code"
          value={newProduct.ws_code}
          onChange={(e) =>
            setNewProduct({ ...newProduct, ws_code: +e.target.value })
          }
          className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
        />
        <input
          type="number"
          placeholder="Sales Price"
          value={newProduct.sales_price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, sales_price: +e.target.value })
          }
          className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
        />
        <input
          type="number"
          placeholder="MRP"
          value={newProduct.mrp}
          onChange={(e) =>
            setNewProduct({ ...newProduct, mrp: +e.target.value })
          }
          className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
        />
        <input
          type="number"
          placeholder="Package Size"
          value={newProduct.package_size}
          onChange={(e) =>
            setNewProduct({ ...newProduct, package_size: +e.target.value })
          }
          className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={newProduct.tags.join(", ")}
          onChange={(e) =>
            setNewProduct({ ...newProduct, tags: e.target.value.split(", ") })
          }
          className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
        />
        <input
          type="text"
          placeholder="Images (comma separated URLs)"
          value={newProduct.images.join(", ")}
          onChange={(e) =>
            setNewProduct({ ...newProduct, images: e.target.value.split(", ") })
          }
          className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
        />

        <input
          type="text"
          placeholder="Categories (comma separated categories)"
          value={newProduct.categories.join(", ")}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              categories: e.target.value.split(", "),
            })
          }
          className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
        />

        {/* <select
          value={products.categories}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              categories: Array.from(
                e.target.selectedOptions,
                (option) => option.value
              ),
            })
          }
          multiple
          className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
        >
          <option value="">Select Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select> */}
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600">
          Add Product
        </button>
      </form>

      {/* Product List */}
      <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b px-4 py-2 text-left text-sm font-medium">
                Name
              </th>
              <th className="border-b px-4 py-2 text-left text-sm font-medium">
                WS_code
              </th>
              <th className="border-b px-4 py-2 text-left text-sm font-medium">
                Sales Price
              </th>
              <th className="border-b px-4 py-2 text-left text-sm font-medium">
                MRP
              </th>
              <th className="border-b px-4 py-2 text-left text-sm font-medium">
                Package Size
              </th>
              <th className="border-b px-4 py-2 text-left text-sm font-medium">
                Categories
              </th>
              <th className="border-b px-4 py-2 text-left text-sm font-medium">
                Tags
              </th>
              <th className="border-b px-4 py-2 text-left text-sm font-medium">
                Active
              </th>
              <th className="border-b px-4 py-2 text-left text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="border-b px-4 py-2">{product.name}</td>
                <td className="border-b px-4 py-2">{product.ws_code}</td>
                <td className="border-b px-4 py-2">{product.sales_price}</td>
                <td className="border-b px-4 py-2">{product.mrp}</td>
                <td className="border-b px-4 py-2">{product.package_size}</td>

                <td className="border p-2">
                  {product.categories
                    ? product.categories.join(", ")
                    : "No Category"}
                </td>

                <td className="border-b px-4 py-2">
                  {product.tags ? product.tags.join(",") : "No Tags"}
                </td>
                <td className="border-b px-4 py-2">
                  {product.is_active ? "Active" : "Inactive"}
                </td>
                <td className="border-b px-4 py-2 space-x-2">
                  <button
                    onClick={() =>
                      setEditProduct({
                        id: product.id,
                        name: product.name,
                        sales_price: product.sales_price,
                        ws_code: product.ws_code,
                        mrp: product.mrp,
                        package_size: product.package_size,
                        tags: product.tags,
                        categories: product.categories,
                        images: product.images,
                        is_active: product.is_active,
                      })
                    }
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      toggleProductStatus(product.id, product.is_active)
                    }
                    className={`${
                      product.is_active ? "bg-red-500" : "bg-green-500"
                    } text-white px-4 py-2 rounded-md hover:bg-opacity-90`}
                  >
                    {product.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() =>
                      toggleProductStatus(product.id, product.is_deleted)
                    }
                    className={`${
                      product.is_deleted ? "bg-red-500" : "bg-green-500"
                    } text-white px-4 py-2 rounded-md hover:bg-opacity-90`}
                  >
                    {product.is_deleted ? "Delete" : "Retrive"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <form
            onSubmit={handleUpdateProduct}
            className="bg-white p-6 rounded-lg shadow-xl w-1/3"
          >
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            {/* Product Name */}
            <input
              type="text"
              value={editProduct.name}
              onChange={(e) =>
                setEditProduct({ ...editProduct, name: e.target.value })
              }
              className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
              placeholder="Product Name"
            />
            {/* WS Code */}
            <input
              type="number"
              value={editProduct.ws_code}
              onChange={(e) =>
                setEditProduct({ ...editProduct, ws_code: e.target.value })
              }
              className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
              placeholder="WS Code"
            />
            {/* Price */}
            <input
              type="number"
              value={editProduct.sales_price}
              onChange={(e) =>
                setEditProduct({ ...editProduct, sales_price: e.target.value })
              }
              className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
              placeholder="Price"
            />
            {/* MRP */}
            <input
              type="number"
              value={editProduct.mrp}
              onChange={(e) =>
                setEditProduct({ ...editProduct, mrp: e.target.value })
              }
              className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
              placeholder="MRP"
            />
            <input
              type="number"
              value={editProduct.package_size}
              onChange={(e) =>
                setEditProduct({ ...editProduct, package_size: e.target.value })
              }
              className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
              placeholder="MRP"
            />
            {/* Tags */}
            <input
              type="text"
              value={(editProduct.tags || []).join(", ")}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  tags: e.target.value.split(", "),
                })
              }
              className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
              placeholder="Tags (comma separated)"
            />
            {/* Categories */}

            <input
              type="text"
              value={(editProduct.categories || []).join(", ")}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  categories: e.target.value.split(", "),
                })
              }
              className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
              placeholder="Categories (comma separated)"
            />

            {/* <select
              value={editProduct.categories}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  categories: Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  ),
                })
              }
              multiple
              className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select> */}
            {/* Add other fields similarly... */}

            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Update Product
            </button>
            <button
              type="button"
              onClick={() => setEditProduct(null)}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 mt-4"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminProductPage;
