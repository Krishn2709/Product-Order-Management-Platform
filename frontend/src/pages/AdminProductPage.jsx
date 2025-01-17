import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/adminProductPage.css";
import { Link } from "react-router-dom";

const AdminProductPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    ws_code: 0,
    sales_price: 0,
    mrp: 0,
    package_size: 0,
    tags: [],
    category_id: 0,
    images: [],
    is_active: true,
  });
  const [categories, setCategories] = useState([]);
  const [editProduct, setEditProduct] = useState([]);
  const [showModalCat, setShowModalCat] = useState(false);
  const [newCat, setNewCat] = useState({
    name: "",
  });

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

  const getFilteredProducts = () => {
    let filteredProducts = products;

    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      filteredProducts = filteredProducts.filter((product) => {
        const nameMatch = product.name.toLowerCase().includes(searchLower);
        const wsCodeMatch = product.ws_code.toString().includes(searchLower);
        return nameMatch || wsCodeMatch;
      });
    }

    if (categoryFilter) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category_id === parseInt(categoryFilter)
      );
    }

    return filteredProducts;
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories");
      setCategories(response.data || []);
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
      // Add the newly created product directly to the state
      setProducts((prevProducts) => [...prevProducts, response.data]);
      setNewProduct({
        name: "",
        ws_code: 0,
        sales_price: 0,
        mrp: 0,
        package_size: 0,
        tags: [],
        category_id: 0,
        images: [],
        is_active: true,
      });
      window.location.reload();
    } catch (error) {
      console.error(error.response?.data?.message || "Error adding product");
    }
  };

  const handleAddCat = async (e) => {
    e.preventDefault();
    try {
      console.log(newCat);
      const response = await axiosInstance.post("/categories", newCat);
      // Add the newly created product directly to the state
      setCategories((prevCat) => [...prevCat, response.data]);
      setNewProduct({
        name: "",
      });
      window.location.reload();
    } catch (error) {
      console.error(error.response?.data?.message || "Error adding product");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(
        `/products/edit/${editProduct.id}`,
        editProduct
      );
      // Optimistically update the products list
      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod.id === editProduct.id ? response.data : prod
        )
      );
      setEditProduct(null); // Reset edit state
      window.location.reload();
    } catch (error) {
      console.error(error.response?.data?.message || "Error updating product");
    }
  };

  const toggleProductActiveStatus = async (id, isActive) => {
    const updatedProducts = products.map((product) =>
      product.id === id ? { ...product, is_active: !isActive } : product
    );
    setProducts(updatedProducts);

    // Update the editProduct state for the active status
    const updatedEditProduct = updatedProducts.find((prod) => prod.id === id);
    setEditProduct(updatedEditProduct);

    try {
      await axiosInstance.put(`/products/edit/${id}`, {
        ...updatedEditProduct,
        is_active: !isActive,
      });
    } catch (error) {
      console.error(
        error.response?.data?.message || "Error toggling product active status"
      );
    }
  };
  const toggleProductDeletedStatus = async (id, isDeleted) => {
    try {
      const response = await axiosInstance.delete(`/products/delete/${id}`, {
        data: { is_deleted: !isDeleted },
      });

      // Reload the page after the API call
      window.location.reload();
    } catch (error) {
      console.error(
        error.response?.data?.message || "Error toggling product deleted status"
      );
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "No Category"; // Fallback if not found
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    // Show local image previews
    const uploadedImages = files.map((file) => URL.createObjectURL(file));

    setNewProduct((prevProduct) => ({
      ...prevProduct,
      images: uploadedImages, // Temporarily store image URLs for preview
    }));

    // Now, upload to Cloudinary in the background
    const cloudinaryImagePromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "krishn");

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dsdvswevh/image/upload",
          formData
        );
        return response.data.secure_url;
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
      }
    });

    const uploadedCloudinaryImages = await Promise.all(cloudinaryImagePromises);

    setNewProduct((prevProduct) => ({
      ...prevProduct,
      images: uploadedCloudinaryImages,
    }));
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <>
      <Navbar />
      <div className=" bg-gray-50 min-h-screen admin-product-page">
        <div className="headerbtn">
          <button onClick={() => setShowModal(true)} className="headerbtn1">
            + Add new Product
          </button>
          <button onClick={() => setShowModalCat(true)} className="headerbtn1">
            + Add new Category
          </button>
          <button className="headerbtn1 ">
            <Link className="allOrders" to="/admin/orders">
              All Orders
            </Link>
          </button>
        </div>
        <div className=" searchFilter1 ">
          <input
            type="text"
            placeholder="Search by name or WS code"
            className="search-bar1"
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)} // Update search state
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="categoryfilter"
            style={{
              marginLeft: "8px",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {showModalCat && (
          <div className="modal-overlay">
            <div className="modal-container">
              <h2 className="text-xl font-semibold mb-4 modalTitle">
                Add New Category
              </h2>
              <form onSubmit={handleAddCat} className="modal-form">
                <input
                  type="text"
                  placeholder="Category Name"
                  value={newCat.name}
                  onChange={(e) =>
                    setNewCat({ ...newCat, name: e.target.value })
                  }
                  className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
                />

                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  Add Category
                </button>
                <button
                  onClick={() => setShowModalCat(false)}
                  className="cancel"
                >
                  Cancel
                </button>
              </form>
              {/* Close button */}
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-container">
              <h2 className="text-xl font-semibold mb-4 modalTitle">
                Add New Product
              </h2>
              <form onSubmit={handleAddProduct} className="modal-form">
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
                    setNewProduct({
                      ...newProduct,
                      sales_price: +e.target.value,
                    })
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
                    setNewProduct({
                      ...newProduct,
                      package_size: +e.target.value,
                    })
                  }
                  className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
                />
                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={newProduct.tags.join(", ")}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      tags: e.target.value.split(", "),
                    })
                  }
                  className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
                />

                {/* File Input for Image Upload */}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e)}
                  className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
                />

                {/* Image Previews */}
                <div className="image-preview-container">
                  {newProduct.images.length > 0 &&
                    newProduct.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Preview ${index}`}
                        className="image-preview"
                      />
                    ))}
                </div>

                <select
                  value={newProduct.category_id}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      category_id: parseInt(e.target.value),
                    })
                  }
                  className="categories"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  Add Product
                </button>
                <button onClick={() => setShowModal(false)} className="cancel">
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Product List */}
        <div className="p-6 bg-gray-50 min-h-screen listprod">
          <h1 className="text-2xl font-bold mb-6">Manage Products</h1>
          <div className="grid-container">
            {getFilteredProducts().map((product) => (
              <div key={product.id} className="card">
                <h2 className="prodName">{product.name}</h2>
                <p>WS Code: {product.ws_code}</p>
                <p>Sales Price: ₹{product.sales_price}</p>
                <p>MRP: ₹{product.mrp}</p>
                <p>Package Size: {product.package_size}</p>
                <p>
                  Categories:{" "}
                  {product.category_id
                    ? getCategoryName(product.category_id)
                    : "No Categories"}
                </p>
                <p>
                  Tags: {product.tags ? product.tags.join(", ") : "No Tags"}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    product.is_active ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Status: {product.is_active ? "Active" : "Inactive"}
                </p>

                <div className="space-y-2 buttonsedit">
                  <button
                    onClick={() => {
                      setEditProduct({
                        id: product.id,
                        name: product.name,
                        sales_price: product.sales_price,
                        ws_code: product.ws_code,
                        mrp: product.mrp,
                        package_size: product.package_size,
                        tags: product.tags,
                        category_id: product.category_id,
                        images: product.images,
                        is_active: product.is_active,
                      });
                      setShowEditModal(true);
                    }}
                    className="bg-yellow-500  deactivate text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      toggleProductActiveStatus(product.id, product.is_active)
                    }
                    className={`${
                      product.is_active ? "bg-red-500" : "bg-green-500"
                    } text-white deactivate  rounded hover:bg-opacity-90`}
                  >
                    {product.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() =>
                      toggleProductDeletedStatus(product.id, product.is_deleted)
                    }
                    className="cancel"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Product Modal */}
        {editProduct && showEditModal && (
          <div className="modal-overlay">
            <div className="modal-container">
              <h2 className="text-xl font-semibold mb-4 modalTitle">
                Edit Product
              </h2>
              <form onSubmit={handleUpdateProduct} className="modal-form">
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
                    setEditProduct({
                      ...editProduct,
                      ws_code: e.target.value,
                    })
                  }
                  className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
                  placeholder="WS Code"
                />
                {/* Price */}
                <input
                  type="number"
                  value={editProduct.sales_price}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      sales_price: e.target.value,
                    })
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
                    setEditProduct({
                      ...editProduct,
                      package_size: e.target.value,
                    })
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

                <select
                  value={editProduct.category_id}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      category_id: parseInt(e.target.value), // Parse the value to integer
                    })
                  }
                  className="categories"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  Update Product
                </button>
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="cancel"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminProductPage;
