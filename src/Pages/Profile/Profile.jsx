import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/Authcontext.jsx";
import { ShopContext } from "../../Context/ShopContext.jsx";
import axios from "axios";
import Spinner from "../../Components/Spinner/Spinner.jsx";
import "./Profile.css";

const BASE_URL = "https://goldback2.onrender.com";

const Profile = () => {
  const { token } = useContext(AuthContext);
  const { orders, fetchOrders } = useContext(ShopContext);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user info
  const fetchUser = async () => {
    try {
      if (!token) return;
      const res = await axios.get(`${BASE_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (e) {
      console.log("Fetch user error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchOrders();
  }, [token]);

  if (loading) return <Spinner />;

  if (!user) return <p className="not-logged">Please log in to view your profile.</p>;

  return (
    <section className="profile-container">
      <div className="profile-header">
        <div className="avatar">{user.name[0].toUpperCase()}</div>
        <div className="user-info">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <h3 className="orders-title">Your Orders</h3>
      <div className="orders-list">
        {orders.length === 0 ? (
          <p className="no-orders">No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <p><strong>Order ID:</strong> {order._id}</p>
                <span className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              <p><strong>Total:</strong> KES {order.totalPrice}</p>
              <p><strong>Items:</strong></p>
              <ul>
                {order.items.map((item) => (
                  <li key={item._id}>
                    {item.name} x {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Profile;
