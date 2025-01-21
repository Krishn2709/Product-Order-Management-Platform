import React, { useEffect, useState, useCallback, useMemo } from "react";
import axiosInstance from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/customerProductPage.css";
import { ToastContainer, toast } from "react-toastify";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import SearchFilter from "../components/SearchFilter";
import Pagination from "../components/Pagination";
import CustomerProductCard from "../components/CustomerProductCard";

const CustomerProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Memoized fetch functions to prevent unnecessary re-renders
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error(error.response?.data?.message || "Error fetching products");
      toast.error("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error(
        error.response?.data?.message || "Error fetching categories"
      );
      toast.error("Failed to load categories. Please try again later.");
    }
  }, []);

  // Memoized handlers
  const handleAddToCart = useCallback(
    (product) => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const productIndex = cart.findIndex((item) => item.id === product.id);

      if (productIndex !== -1) {
        cart[productIndex].quantity += quantities[product.id] || 1;
      } else {
        product.quantity = quantities[product.id] || 1;
        cart.push(product);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      toast.success("Item Added to Cart");
    },
    [quantities]
  );

  const handleQuantityChange = useCallback(
    (productId, action) => {
      setQuantities((prevQuantities) => {
        const currentQuantity = prevQuantities[productId] || 0;
        const product = products.find((p) => p.id === productId);

        if (
          action === "increment" &&
          currentQuantity < product.stock_quantity
        ) {
          return { ...prevQuantities, [productId]: currentQuantity + 1 };
        } else if (action === "decrement" && currentQuantity > 0) {
          return { ...prevQuantities, [productId]: currentQuantity - 1 };
        }
        return prevQuantities;
      });
    },
    [products]
  );

  // Memoized filtered products calculation
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      filtered = filtered.filter((product) => {
        const nameMatch = product.name.toLowerCase().includes(searchLower);
        const wsCodeMatch = product.ws_code.toString().includes(searchLower);
        return nameMatch || wsCodeMatch;
      });
    }

    if (categoryFilter) {
      filtered = filtered.filter(
        (product) => product.category_id === parseInt(categoryFilter)
      );
    }

    return filtered;
  }, [products, search, categoryFilter]);

  // Calculate the paginated products

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

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter]);

  return (
    <>
      <Navbar />
      <main>
        <Carousel />
        <div className="customer-product-page">
          <SearchFilter
            search={search}
            setSearch={setSearch}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            categories={categories}
          />

          <div
            className="product-grid product-listing"
            role="region"
            aria-label="Products"
          >
            {loading ? (
              <p role="status">Loading products...</p>
            ) : paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <CustomerProductCard
                  key={product.id}
                  product={product}
                  quantities={quantities}
                  handleQuantityChange={handleQuantityChange}
                  handleAddToCart={handleAddToCart}
                />
              ))
            ) : (
              <p className="no-products-message" role="status">
                No products match your search
              </p>
            )}
          </div>

          {/* Pagination controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      </main>
      <ToastContainer />
      <Footer />
    </>
  );
};

export default CustomerProductPage;
