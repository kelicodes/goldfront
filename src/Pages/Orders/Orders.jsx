import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";

const BASE_URL = "https://thegoldfina.onrender.com";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Function to get token from localStorage
  const getToken = () => localStorage.getItem("token");

  // Function to fetch user orders from backend
  const fetchOrders = async () => {
    const token = getToken();
    if (!token) {
      setError("You must be logged in to view orders.");
      setLoading(false);
      return [];
    }

    try {
      const res = await axios.get(`${BASE_URL}/orders/userorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    
      return res.data || [];
    } catch (err) {
      console.error("Error fetching orders:", err.response?.data || err.message);
      setError("Failed to load orders.");
      return [];
    }
  };

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      setError("");
      const data = await fetchOrders();
      console.log(data.orders)
      setOrders(data.orders);
      setLoading(false);
    };

    // Scroll to top on page load
    window.scrollTo({ top: 0, behavior: "smooth" });

    getOrders();
  }, []);

  if (loading) return <p className="loading">Loading orders...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!orders || orders.length === 0)
    return <p className="loading">No orders found.</p>;

  return (
    <section className="orders">
      <h2>Your Orders</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`status ${order.status?.toLowerCase()}`}>
                {order.status || "Pending"}
              </span>
            </p>
            <p>
              <strong>Total:</strong> KES{" "}
              {order.totalAmount?.toFixed(2) || order.total?.toFixed(2) || 0}
            </p>
            <p>
              <strong>Items:</strong>{" "}
              {order.items
                ?.map((i) => `${i.name} x ${i.quantity}`)
                .join(", ") || "No items"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Orders;
