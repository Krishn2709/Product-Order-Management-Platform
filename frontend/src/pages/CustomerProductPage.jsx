import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/customerProductPage.css";

const CustomerProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quantities, setQuantities] = useState({}); // Changed to store quantities by product ID
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [loading, setLoading] = useState(false);

  // Fetch all active products
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

  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productIndex = cart.findIndex((item) => item.id === product.id);

    if (productIndex !== -1) {
      cart[productIndex].quantity += quantities[product.id] || 1;
    } else {
      product.quantity = quantities[product.id] || 1;
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  // Fetch all categories
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

  // Filter products based on search, category, and price range
  const getFilteredProducts = () => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory = categoryFilter
        ? product.categoryId === parseInt(categoryFilter)
        : true;
      const matchesPrice =
        product.price >= priceRange.min && product.price <= priceRange.max;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  };

  // Update quantity for specific product
  const handleIncrement = (productId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 0) + 1,
    }));
  };

  const handleDecrement = (productId) => {
    setQuantities((prevQuantities) => {
      const newQuantity = (prevQuantities[productId] || 1) - 1;
      return {
        ...prevQuantities,
        [productId]: newQuantity > 0 ? newQuantity : 0, // Prevent negative quantity
      };
    });
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = getFilteredProducts();

  return (
    <>
      <Navbar />
      <div className="customer-product-page">
        {/* Search Bar */}
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-bar"
          />
        </div>

        {/* Product List */}
        <div className="product-grid">
          {loading ? (
            <p>Loading products...</p>
          ) : search ? (
            // Show filtered products if there's a search term
            filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img
                      src={product.image || "/placeholder-image.png"}
                      alt={product.name}
                    />
                  </div>
                  <h2 className="product-name">{product.name}</h2>
                  <p className="product-price">
                    Price: ₹
                    {product.sales_price * (quantities[product.id] || 1)}
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
                  <button className="add-to-cart-btn">Add to Cart</button>
                </div>
              ))
            ) : (
              <p className="no-products-message">
                No products match your search
              </p>
            )
          ) : (
            // Show all products if no search term is entered
            products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img
                    src={product.image || "/placeholder-image.png"}
                    alt={product.name}
                  />
                </div>
                <h2 className="product-name">{product.name}</h2>
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
          )}
        </div>
      </div>
    </>
  );
};

export default CustomerProductPage;
