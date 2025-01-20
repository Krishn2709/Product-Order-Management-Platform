import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/customerProductPage.css";
import { ToastContainer, toast } from "react-toastify";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";

const CustomerProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [quantities_stock, setQuantities_stock] = useState({});

  //Fetching All Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error(error.response?.data?.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  //Add to Cart handler
  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productIndex = cart.findIndex((item) => item.id === product.id);

    if (productIndex !== -1) {
      cart[productIndex].quantity += quantities[product.id] || 1;
    } else {
      product.quantity = quantities[product.id] || 1;
      cart.push(product);
    }

    toast("Item Added to Cart");

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const handleIncrement = (productId) => {
    const responseData = products
      .map((product) => {
        if (product.id === productId) {
          return {
            stock_quantity: product.stock_quantity,
          };
        }
      })
      .filter(Boolean);

    // Only increment if current quantity is less than stock quantity
    if ((quantities[productId] || 0) < responseData[0].stock_quantity) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: (prevQuantities[productId] || 0) + 1,
      }));
    }
  };

  const handleDecrement = (productId) => {
    setQuantities((prevQuantities) => {
      const newQuantity = (prevQuantities[productId] || 1) - 1;
      return {
        ...prevQuantities,
        [productId]: newQuantity > 0 ? newQuantity : 0,
      };
    });
  };

  //Fetching All Categories
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error(
        error.response?.data?.message || "Error fetching categories"
      );
    }
  };

  //Filtered Products Handler
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

  //Pagination Handlers
  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <>
      <Navbar />
      <Carousel />
      <div className="customer-product-page">
        {/* Header */}
        <div className="searchFilter2">
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
            className="search-bar1 searchbar2"
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

        {/* List All Products */}
        <div className="product-grid">
          {loading ? (
            <p>Loading products...</p>
          ) : paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.images} alt={product.name} />
                </div>
                <h2 className="product-name">{product.name}</h2>
                <p className="product-code">WS Code: {product.ws_code}</p>
                <p className="product-code">
                  MRP: <del>₹{product.mrp}</del>
                </p>
                <p className="product-price">
                  Price: ₹{product.sales_price * (quantities[product.id] || 1)}
                </p>

                <div className="quantity-container">
                  <button
                    className="quantity-btn"
                    onClick={() => handleDecrement(product.id)}
                  >
                    -
                  </button>
                  <span className="quantity-value">
                    {quantities[product.id] || 0}
                  </span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleIncrement(product.id)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <p className="no-products-message">No products match your search</p>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="page-span">
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
      <ToastContainer />
      <Footer />
    </>
  );
};

export default CustomerProductPage;
