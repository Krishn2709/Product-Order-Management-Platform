import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import "../styles/adminProductPage.css";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProductHeader from "../components/ProductHeader";
import SearchFilter from "../components/SearchFilter";
import AdminProductCard from "../components/AdminProductCard";
import Pagination from "../components/Pagination";
import AddProductModal from "../components/AddProductModal";
import AddCategoryModal from "../components/AddCategoryModal";
import EditProductModal from "../components/EditProductModal";

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
        {/* Header */}
        <ProductHeader
          setShowModal={setShowModal}
          setShowModalCat={setShowModalCat}
        />
        {/* Searchbar */}
        <SearchFilter
          search={search}
          setSearch={setSearch}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={categories}
        />

        {/* Product List */}
        <div className="p-6 bg-gray-50 min-h-screen listprod">
          <h1 className="text-2xl font-bold mb-6">Manage Products</h1>
          <div className="grid-container">
            {paginatedProducts.map((product) => (
              <AdminProductCard
                key={product.id}
                product={product}
                getCategoryName={getCategoryName}
                toggleProductActiveStatus={toggleProductActiveStatus}
                toggleProductDeletedStatus={toggleProductDeletedStatus}
                setEditProduct={setEditProduct}
                setShowEditModal={setShowEditModal}
              />
            ))}
          </div>
        </div>

        {/* Add Product Modal */}
        <AddProductModal
          showModal={showModal}
          setShowModal={setShowModal}
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          handleAddProduct={handleAddProduct}
          categories={categories}
          errors={errors}
          setErrors={setErrors}
          isUploading={isUploading}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
        />

        {/* Add Category Modal */}
        <AddCategoryModal
          showModalCat={showModalCat}
          setShowModalCat={setShowModalCat}
          newCat={newCat}
          setNewCat={setNewCat}
          handleAddCat={handleAddCat}
        />

        {/* Edit Product Modal */}
        <EditProductModal
          showEditModal={showEditModal}
          editProduct={editProduct}
          setEditProduct={setEditProduct}
          handleUpdateProduct={handleUpdateProduct}
          categories={categories}
          isUploading={isUploading}
          handleEditImageUpload={handleEditImageUpload}
          removeEditImage={removeEditImage}
        />
        {/* Pagination controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>
      <Footer />
    </>
  );
};

export default AdminProductPage;
