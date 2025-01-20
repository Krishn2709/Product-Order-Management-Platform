import React, { useState, useEffect } from "react";
import { Clock, Package, DollarSign } from "lucide-react";
import Navbar from "../components/Navbar";
import "../styles/myorder.css";
import axiosInstance from "../api/axios";
import Footer from "../components/Footer";

const MyOrders = () => {
  const [orders, setOrders] = useState([]); // Ensure it's initialized as an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("date-desc");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  //Fteching All orders Handler
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/orders/my-orders");

      // Check if response.data is an array
      if (Array.isArray(response.data.orders)) {
        setOrders(response.data.orders); // Set the orders state
        setError(null);
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  //Sorting Order Handler
  const sortOrders = (orders) => {
    if (!Array.isArray(orders)) return []; // Handle non-array input

    return [...orders].sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.created_at) - new Date(a.created_at);
        case "date-asc":
          return new Date(a.created_at) - new Date(b.created_at);
        case "price-desc":
          return parseFloat(b.total_price) - parseFloat(a.total_price);
        case "price-asc":
          return parseFloat(a.total_price) - parseFloat(b.total_price);
        default:
          return 0;
      }
    });
  };

  //Filtering Orders Handler
  const filterOrders = (orders) => {
    if (filterStatus === "all") return orders;
    return orders.filter(
      (order) => order.status.toLowerCase() === filterStatus.toLowerCase()
    );
  };

  //Formating Date Handler
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  //Order Status CSS Handler
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "dispatched":
        return "bg-gray-100 text-gray-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const processedOrders = filterOrders(sortOrders(orders));

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-gray-600">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="orders-container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <div className="filters">
            <select
              className="select-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="price-desc">Highest Price</option>
              <option value="price-asc">Lowest Price</option>
            </select>

            <select
              className="select-input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {processedOrders.length === 0 ? (
          <div className="no-orders">No orders found</div>
        ) : (
          <div className="orders-grid">
            {processedOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-id">Order #{order.id}</div>
                  <span
                    className={`status-badge ${getStatusClass(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="order-content">
                  <div className="order-info">
                    <Clock className="icon" />
                    <span className="order-detail">
                      {formatDate(order.created_at)}
                    </span>
                  </div>

                  <div className="order-info">
                    <Package className="icon" />
                    <span className="order-detail">
                      {order.quantities.reduce((a, b) => a + b, 0)} items
                    </span>
                  </div>

                  <div className="order-info">
                    <DollarSign className="icon" />
                    <span className="price order-detail">
                      ${parseFloat(order.total_price).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
