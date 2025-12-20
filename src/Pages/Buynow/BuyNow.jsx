import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./BuyNow.css";
import { logEvent } from "../../../analytics";

const BASE_URL = "https://thegoldfina.onrender.com";

const BuyNowCheckout = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    apartment: "",
    doorNumber: "",
  });
  const [orderLoading, setOrderLoading] = useState(false);

  const getToken = () => localStorage.getItem("token");
  const getAuthHeader = () =>
    getToken() ? { headers: { Authorization: `Bearer ${getToken()}` } } : {};

  // Fetch product details
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/products/fetch/${productId}`);
      if (res.data.success) setProduct(res.data.theproduct);
      else console.error("Product fetch error:", res.data.message);
    } catch (err) {
      console.error("Error fetching product:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  // Buy Now click
  const handleBuyNow = () => {
    const token = getToken();
    if (!token) {
      // Guest flow → show shipping modal immediately
      setShowModal(true);
      return;
    }
    // Logged-in flow → redirect to checkout page
    navigate(`/checkout/${productId}`);
  };

  // Guest order submission
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    const { name, phone, apartment, doorNumber } = shippingInfo;

    if (!name || !phone || !apartment || !doorNumber) {
      alert("Please fill all fields");
      return;
    }

    try {
      setOrderLoading(true);

      // Guest order creation with STK push
      const res = await axios.post(`${BASE_URL}/orders/create`, {
        products: [{ productId, quantity: 1 }],
        paymentMethod: "Mpesa",
        shippingAddress: shippingInfo,
      });

      if (res.data.success && res.data.order?._id) {
        logEvent("BuyNow", "GuestCheckout", "Guest checkout initiated");
        alert(`Order created! STK push sent to ${phone}`);
        setShowModal(false);
        navigate(`/thankyou/${res.data.order._id}`);
      } else {
        alert("Failed to create order. Try again.");
      }
    } catch (err) {
      console.error("Error creating order:", err.response?.data || err.message);
      alert("Something went wrong. Please try again.");
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <section className="buynow-checkout-page">
      <h2>Checkout (Buy Now)</h2>

      <div className="buynow-grid">
        <div className="buynow-item">
          <img src={product.images?.[0]} alt={product.name} className="buynow-item-img" />
          <div className="buynow-item-info">
            <h3>{product.name}</h3>
            <p>Category: {product.category}</p>
            <p>Price: KES {product.price}</p>
            <p>Quantity: 1</p>
            <p>Subtotal: KES {product.price}</p>
          </div>
        </div>
      </div>

      <div className="buynow-summary">
        <p>Total Items: 1</p>
        <p>Total Price: KES {product.price}</p>

        <div className="buynow-actions">
          <button className="btn-back" onClick={() => navigate(-1)}>Back</button>
          <button className="btn-checkout" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Enter Shipping Info</h3>
            <form onSubmit={handleSubmitOrder}>
              <label>Name:</label>
              <input type="text" name="name" value={shippingInfo.name} onChange={handleChange} required />
              <label>Phone:</label>
              <input type="text" name="phone" value={shippingInfo.phone} onChange={handleChange} required />
              <label>Apartment/Street:</label>
              <input type="text" name="apartment" value={shippingInfo.apartment} onChange={handleChange} required />
              <label>Door Number:</label>
              <input type="text" name="doorNumber" value={shippingInfo.doorNumber} onChange={handleChange} required />
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" disabled={orderLoading}>
                  {orderLoading ? "Processing..." : "Submit & Pay"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default BuyNowCheckout;
