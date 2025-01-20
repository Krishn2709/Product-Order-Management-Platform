import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/adminProductPage.css";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const AdminProductPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    ws_code: "",
    sales_price: "",
    mrp: "",
    package_size: "",
    stock_quantity: "",
    tags: [],
    category_id: 0,
    images: [],
    is_active: true,
  });
  const [categories, setCategories] = useState([]);
  const [editProduct, setEditProduct] = useState([]);
  const [showModalCat, setShowModalCat] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [newCat, setNewCat] = useState({
    name: "",
  });

  //Validation for Add Product
  const validateForm = () => {
    const validationErrors = {};

    if (!newProduct.name) {
      validationErrors.name = "Product name is required.";
    }
    if (newProduct.ws_code <= 0) {
      validationErrors.ws_code = "WS Code must be a positive number.";
    }
    if (newProduct.sales_price <= 0) {
      validationErrors.sales_price = "Sales price must be a positive number.";
    }
    if (newProduct.mrp <= 0) {
      validationErrors.mrp = "MRP must be a positive number.";
    }
    if (newProduct.sales_price >= newProduct.mrp) {
      validationErrors.sales_price = "Sales price must be lower than MRP.";
    }
    if (
      newProduct.package_size <= 0 ||
      !Number.isInteger(newProduct.package_size)
    ) {
      validationErrors.package_size =
        "Package size must be a positive whole number.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Fetch all products for admin
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/products/admin");

      if (response.data && Array.isArray(response.data)) {
        const sortedProducts = response.data.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        setProducts(sortedProducts);
      } else {
        console.error("Products not found or invalid data structure");
        setProducts([]); // fallback to an empty array
      }
    } catch (error) {
      console.error(error.response?.data?.message || "Error fetching products");
      setProducts([]); // fallback to an empty array in case of error
    }
  };

  //Filtered Products
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

  // Calculate the paginated products
  const filteredProducts = getFilteredProducts();
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //Pagination
  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
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

  //Add New Category
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

  //Change Status of the Product
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

  //Change Delete Status of the Product
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

  //Fetching Category Name
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "No Category"; // Fallback if not found
  };

  // Add a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (!newProduct.name || !newProduct.category_id) {
          alert("Please fill in all required fields");
          return;
        }
        console.log(newProduct);
        const response = await axiosInstance.post("/products/add", newProduct);
        console.log(newProduct);
        setProducts((prevProducts) => [response.data, ...prevProducts]);
        setNewProduct({
          name: "",
          ws_code: "",
          sales_price: "",
          mrp: "",
          package_size: "",
          stock_quantity: "",
          tags: [],
          category_id: 0,
          images: [],
          is_active: true,
        });
        window.location.reload();
      } catch (error) {
        console.error(error.response?.data?.message || "Error adding product");
      }
    }
  };

  //Edit a Product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.put(
        `/products/edit/${editProduct.id}`,
        editProduct
      );
      // Update the product while maintaining its position
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

  //Upload Image
  const uploadImages = async (files) => {
    const urls = [];
    const UPLOAD_PRESET = "productOrderPlatform";
    const CLOUD_NAME = "dsdvswevh";
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

    try {
      for (const file of files) {
        // Validate file type and size
        if (!ALLOWED_TYPES.includes(file.type)) {
          throw new Error(
            `Invalid file type: ${file.type}. Allowed types: JPEG, PNG, WebP`
          );
        }

        if (file.size > MAX_FILE_SIZE) {
          throw new Error(
            `File too large: ${(file.size / 1024 / 1024).toFixed(
              2
            )}MB. Maximum size: 5MB`
          );
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        console.log(formData);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        urls.push(data.secure_url);
      }
      return urls;
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    }
  };

  // Component handlers for Image upload
  const handleImageUpload = async (e) => {
    try {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      // Show loading state
      setIsUploading(true);

      const uploadedUrls = await uploadImages(files);

      setNewProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (error) {
      // Handle error appropriately in your UI
      alert(error.message);
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  const handleEditImageUpload = async (e) => {
    try {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      // Show loading state
      setIsUploading(true);

      const uploadedUrls = await uploadImages(files);

      setEditProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (error) {
      // Handle error appropriately in your UI
      alert(error.message);
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  // Image removal handler with confirmation
  const removeImage = (index) => {
    if (window.confirm("Are you sure you want to remove this image?")) {
      setNewProduct((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    }
  };

  //Image handler (Edit a Product)
  const removeEditImage = (index) => {
    if (window.confirm("Are you sure you want to remove this image?")) {
      setEditProduct((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <>
      <Navbar />

      <div className=" bg-gray-50 min-h-screen admin-product-page">
        {/* //Header */}
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-search search-icon1"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
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

        {/* Product List */}
        <div className="p-6 bg-gray-50 min-h-screen listprod">
          <h1 className="text-2xl font-bold mb-6">Manage Products</h1>
          <div className="grid-container">
            {paginatedProducts.map((product) => (
              <div key={product.id} className="card">
                <div className="product-image">
                  <img src={product.images} alt={product.name} />
                </div>
                <h2 className="prodName">{product.name}</h2>
                <p>WS Code: {product.ws_code}</p>
                <p>MRP: ₹{product.mrp}</p>
                <p>Sales Price: ₹{product.sales_price}</p>
                <p>Package Size: {product.package_size}</p>
                <p>Available Stock: {product.stock_quantity}</p>
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

        {/* Add Product Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2 className="text-xl font-semibold mb-4 modalTitle">
                  Add New Product
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="Cancel-btn modalTitle"
                  aria-label="Close modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-x cancel-svg"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="modal-form">
                {/* Error state */}
                <div>
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="input-field11"
                  />
                </div>

                {/* WS Code */}
                <div className="relative">
                  <input
                    type="number"
                    placeholder="WS Code"
                    value={newProduct.ws_code}
                    onChange={(e) => {
                      const value = +e.target.value;
                      setNewProduct({ ...newProduct, ws_code: value });
                      setErrors((prev) => ({
                        ...prev,
                        ws_code:
                          value <= 0 ? "WS Code must be a positive number" : "",
                      }));
                    }}
                    className="input-field11"
                  />
                  {errors.ws_code && (
                    <div className="tooltip">{errors.ws_code}</div>
                  )}
                </div>

                {/* MRP */}
                <div className="relative">
                  <input
                    type="number"
                    placeholder="MRP"
                    value={newProduct.mrp}
                    onChange={(e) => {
                      const value = +e.target.value;
                      setNewProduct({ ...newProduct, mrp: value });
                      setErrors((prev) => ({
                        ...prev,
                        mrp: value <= 0 ? "MRP must be a positive number" : "",
                      }));
                    }}
                    className="input-field11"
                  />
                  {errors.mrp && <div className="tooltip">{errors.mrp}</div>}
                </div>
                {/* Sales Price */}
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Sales Price"
                    value={newProduct.sales_price}
                    onChange={(e) => {
                      const value = +e.target.value;
                      setNewProduct({ ...newProduct, sales_price: value });
                      setErrors((prev) => ({
                        ...prev,
                        sales_price:
                          value <= 0
                            ? "Sales price must be positive"
                            : value >= newProduct.mrp
                            ? "Sales price must be less than MRP"
                            : "",
                      }));
                    }}
                    className="input-field11"
                  />
                  {errors.sales_price && (
                    <div className="tooltip">{errors.sales_price}</div>
                  )}
                </div>

                {/* Package Size */}
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Package Size"
                    value={newProduct.package_size}
                    onChange={(e) => {
                      const value = +e.target.value;
                      setNewProduct({ ...newProduct, package_size: value });
                      setErrors((prev) => ({
                        ...prev,
                        package_size:
                          value <= 0
                            ? "Package size must be a positive number"
                            : !Number.isInteger(value)
                            ? "Package size must be a whole number"
                            : "",
                      }));
                    }}
                    className="input-field11"
                  />
                  {errors.package_size && (
                    <div className="tooltip">{errors.package_size}</div>
                  )}
                </div>

                {/* stock_quantity */}
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Stock Quantity"
                    value={newProduct.stock_quantity}
                    onChange={(e) => {
                      const value = +e.target.value;
                      setNewProduct({ ...newProduct, stock_quantity: value });
                      setErrors((prev) => ({
                        ...prev,
                        stock_quantity:
                          value <= 0
                            ? "Stock Quantity must be a positive number"
                            : !Number.isInteger(value)
                            ? "Stock Quantity must be a whole number"
                            : "",
                      }));
                    }}
                    className="input-field11"
                  />
                  {errors.package_size && (
                    <div className="tooltip">{errors.package_size}</div>
                  )}
                </div>

                {/* Tags */}
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
                  className="input-field11"
                />

                {/* Image Upload */}
                <div className="upload-container">
                  {isUploading && (
                    <span className="upload-status">Uploading images...</span>
                  )}
                  <div className="upload-controls">
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="file-input"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`upload-button ${
                        isUploading ? "upload-button-disabled" : ""
                      }`}
                    >
                      {isUploading ? "Uploading..." : "Upload Images"}
                    </label>
                  </div>

                  <div className="image-grid">
                    {newProduct.images.map((url, index) => (
                      <div key={index} className="image-container">
                        <img
                          src={url}
                          alt={`Product ${index + 1}`}
                          className="product-image"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="remove-button"
                          title="Remove image"
                        >
                          <svg
                            className="remove-icon"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Dropdown */}
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

                {/* Submit Button */}
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  Add Product
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Add Category Modal */}
        {showModalCat && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2 className="text-xl font-semibold mb-4 modalTitle">
                  Add New Category
                </h2>
                <button
                  onClick={() => setShowModalCat(false)}
                  className="Cancel-btn modalTitle"
                  aria-label="Close modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-x cancel-svg"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

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
              </form>
              {/* Close button */}
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {editProduct && showEditModal && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2 className="text-xl font-semibold mb-4 modalTitle">
                  Edit Product
                </h2>
                <button
                  onClick={() => setEditProduct(false)}
                  className="Cancel-btn modalTitle"
                  aria-label="Close modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-x cancel-svg"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

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
                {/* pakage size */}
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
                {/* Stock Quantity */}
                <input
                  type="number"
                  value={editProduct.stock_quantity}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      stock_quantity: e.target.value,
                    })
                  }
                  className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
                  placeholder="Available Stock"
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

                <div className="upload-container">
                  {isUploading && (
                    <span className="upload-status">Uploading images...</span>
                  )}
                  <div className="upload-controls">
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleEditImageUpload}
                      disabled={isUploading}
                      className="file-input"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`upload-button ${
                        isUploading ? "upload-button-disabled" : ""
                      }`}
                    >
                      {isUploading ? "Uploading..." : "Upload Images"}
                    </label>
                  </div>

                  <div className="image-grid">
                    {editProduct.images.map((url, index) => (
                      <div key={index} className="image-container">
                        <img
                          src={url}
                          alt={`Product ${index + 1}`}
                          className="product-image"
                        />
                        <button
                          type="button"
                          onClick={() => removeEditImage(index)}
                          className="remove-button"
                          title="Remove image"
                        >
                          <svg
                            className="remove-icon"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

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
              </form>
            </div>
          </div>
        )}

        {/* Pagination controls */}
        <div className="pagination-controls1">
          <button
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminProductPage;
