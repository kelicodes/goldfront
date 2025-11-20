// src/Pages/Checkout/Checkout.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Checkout.css";

const BASE_URL = "https://thegoldfina.onrender.com";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Mpesa");
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    apartment: "Apartment A",
    doorNumber: "",
  });

  const getToken = () => localStorage.getItem("token");
  const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

  // Fetch cart items
  const fetchCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/cart/getcart`, getAuthHeader());
      if (!res.data.items || res.data.items.length === 0) {
        setCart([]);
        return;
      }

      const items = res.data.items
        .filter((i) => i.productId)
        .map((i) => ({
          id: i._id,
          productId: i.productId._id,
          name: i.productId.name || "N/A",
          price: i.productId.price || 0,
          quantity: i.quantity || 1,
        }));

      setCart(items);
    } catch (err) {
      console.error("Fetch Cart Error:", err);
      setCart([]);
    }
  };

  useEffect(() => {
    fetchCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle order submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cart,
        totalAmount,
        paymentMethod,
        shippingAddress: { ...shippingInfo },
      };

      const res = await axios.post(`${BASE_URL}/orders/create`, orderData, getAuthHeader());

      if (res.data.success) {
        if (paymentMethod === "Cash") {
          toast.success("✅ Order placed! Pay when delivery arrives.");
        } else {
          toast.success("✅ Order created! Proceed to M-Pesa payment.");
        }

        setCart([]);
        setTimeout(() => navigate("/orders"), 1500);
      } else {
        toast.error(`⚠️ ${res.data.message}`);
      }
    } catch (err) {
      console.error("Checkout Error:", err.response?.data || err.message);
      toast.error("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="checkout-page">
      <h2 className="checkout-title">Checkout</h2>

      <div className="checkout-container">
        {/* Cart Summary */}
        <div className="cart-summary card">
          <h3>Order Summary</h3>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul className="cart-items-list">
              {cart.map((item) => (
                <li key={item.id} className="cart-item">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>KES {item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
          )}
          <hr />
          <p>
            <strong>Total Price:</strong> KES {totalAmount}
          </p>
        </div>

        {/* Shipping & Payment Form */}
        <form className="shipping-form card" onSubmit={handleSubmit}>
          <h3>Shipping Information</h3>

          <label>
            Name:
            <input type="text" name="name" value={shippingInfo.name} onChange={handleChange} required />
          </label>

          <label>
            Phone:
            <input type="text" name="phone" value={shippingInfo.phone} onChange={handleChange} required />
          </label>

          <label>
            Apartment:
            <select name="apartment" value={shippingInfo.apartment} onChange={handleChange}>
              <option value="Apartment A">Apartment A</option>
              <option value="Apartment B">Apartment B</option>
              <option value="Apartment C">Apartment C</option>
              <option value="Apartment D">Apartment D</option>
            </select>
          </label>

          <label>
            Door Number:
            <input type="text" name="doorNumber" value={shippingInfo.doorNumber} onChange={handleChange} required />
          </label>

          <label>
            Payment Method:
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="Mpesa">M-Pesa Payment</option>
              <option value="Cash">Pay on Delivery (Cash)</option>
            </select>
          </label>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Processing..." : "Place Order"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CheckoutPage;
