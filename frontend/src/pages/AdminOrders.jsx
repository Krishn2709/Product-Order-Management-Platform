import React, { useState, useEffect } from "react";
import { Clock, Package, DollarSign, Edit, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import "../styles/adminOrder.css";
import axiosInstance from "../api/axios";
import Pagination from "../components/Pagination";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("date-desc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [searchUserId, setSearchUserId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/orders/allorders");
      if (Array.isArray(response.data.orders)) {
        setOrders(response.data.orders);
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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      await axiosInstance.put(`/orders/${orderId}/status`, {
        status: newStatus,
      });
      fetchOrders();
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update order status. Please try again.");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const sortOrders = (orders) => {
    if (!Array.isArray(orders)) return [];
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

  const filterOrders = (orders) => {
    return orders.filter((order) => {
      const statusMatch =
        filterStatus === "all" ||
        order.status.toLowerCase() === filterStatus.toLowerCase();
      const userIdMatch =
        !searchUserId || order.user_id.toString() === searchUserId.trim();
      return statusMatch && userIdMatch;
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate the paginated products
  const filteredProducts = filterOrders(sortOrders(orders));
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

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "dispatched":
        return "bg-gray-100 text-gray-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const isStatusChangeable = (status) => {
    return !["delivered", "cancelled"].includes(status.toLowerCase());
  };

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
      <div className="admin-orders-container">
        <div className="orders-header">
          <h1>Manage Orders</h1>
          <div className="filters flex items-center gap-4">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokewidth="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-search search-icon"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Search by User ID"
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value)}
                className="select-input pl-10 pr-4"
              />
            </div>

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
              <option value="Pending">Pending</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Canceled</option>
            </select>
          </div>
        </div>

        {paginatedProducts.length === 0 ? (
          <div className="no-orders">
            {searchUserId
              ? `No orders found for User ID: ${searchUserId}`
              : "No orders found"}
          </div>
        ) : (
          <div className="orders-grid">
            {paginatedProducts.map((order) => (
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-user"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="userId">User ID #{order.user_id}</span>
                  </div>
                  <div className="order-info">
                    <Clock className="icon" />
                    <span>{formatDate(order.created_at)}</span>
                  </div>

                  <div className="order-info">
                    <Package className="icon" />
                    <span>
                      {order.quantities.reduce((a, b) => a + b, 0)} items
                    </span>
                  </div>

                  <div className="order-info">
                    <DollarSign className="icon" />
                    <span className="price">
                      ${parseFloat(order.total_price).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="order-actions">
                  <label htmlFor={`status-${order.id}`}>Update Status:</label>
                  <select
                    id={`status-${order.id}`}
                    className={`select-input ${
                      !isStatusChangeable(order.status)
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                    disabled={
                      updatingOrder === order.id ||
                      !isStatusChangeable(order.status)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  {!isStatusChangeable(order.status) && (
                    <div className="text-sm text-gray-500 mt-1">
                      Status cannot be changed for {order.status.toLowerCase()}{" "}
                      orders
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Pagination controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default AdminOrders;
