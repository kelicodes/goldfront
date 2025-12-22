import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CartCheckout.css";
import { logEvent } from "../../../analytics";

const BASE_URL = "https://thegoldfina.onrender.com";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    apartment: "",
    doorNumber: "",
  });
  const [orderLoading, setOrderLoading] = useState(false);

  // ----- Auth Helpers -----
  const getToken = () => localStorage.getItem("token");
  const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

  // ----- Fetch Cart -----
  const fetchCart = async () => {
    const token = getToken();
    if (!token) {
      setCart([]);
      return;
    }
    try {
      const res = await axios.get(`${BASE_URL}/cart/getcart`, getAuthHeader());
      const items = res.data.items
        ?.filter((i) => i.productId)
        .map((i) => ({
          id: i._id,
          productId: i.productId._id,
          name: i.productId.name || "N/A",
          price: i.productId.price || 0,
          category: i.productId.category || "N/A",
          images: Array.isArray(i.productId.images) ? i.productId.images : [],
          quantity: i.quantity || 1,
        })) || [];
      setCart(items);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart([]);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const loadCart = async () => {
      setLoading(true);
      await fetchCart();
      setLoading(false);
    };
    loadCart();
  }, []);

  // ----- Cart Calculations -----
  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ----- Clear Cart -----
  const clearCart = async () => {
    const token = getToken();
    if (!token) return;
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/cart/clear`, {}, getAuthHeader());
      logEvent("Cart", "Cleared", "User cleared the cart");
      setCart([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      alert("Failed to clear cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ----- Open Shipping Modal -----
  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    setShowModal(true);
  };

  // ----- Handle Shipping Info Change -----
  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  // ----- Submit Shipping Info & Create Order -----
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    const { name, phone, apartment, doorNumber } = shippingInfo;
    if (!name || !phone || !apartment || !doorNumber) {
      alert("Please fill in all shipping details.");
      return;
    }

    try {
      setOrderLoading(true);
      const res = await axios.post(
        `${BASE_URL}/orders/create`,
        {
          paymentMethod: "Mpesa",
          shippingAddress: shippingInfo,
        },
        getAuthHeader()
      );

      if (res.data.success && res.data.order?._id) {
        const orderId = res.data.order._id;
        logEvent("Checkout", "Proceed", "User proceeded to checkout");
        setShowModal(false);
        navigate(`/checkout/${orderId}`);
      } else {
        alert("Failed to create order. Try again.");
      }
    } catch (err) {
      console.error("Create Order Error:", err.response?.data || err.message);
      alert("Something went wrong. Please try again.");
    } finally {
      setOrderLoading(false);
    }
  };

  useEffect(()=>{
    window.scrollTo({
  top: 0,
  behavior: "smooth",
});

  },[])

  return (
    <section className="cart-checkout">
      <h2 className="cart-title">Your Cart</h2>

      {loading ? (
        <p className="loading-text">Loading your cart...</p>
      ) : cart.length === 0 ? (
        <div className="empty-cart-box">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Empty Cart"
            className="empty-cart-img"
          />
          <h3>Your cart is empty 🛒</h3>
          <p>Looks like you haven’t added anything yet. Explore our products and find something you love!</p>
          <button className="shop-now-btn" onClick={() => navigate("/")}>
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-grid">
            {cart.map((item, i) => (
              <div className="cart-item" key={`${item.productId}-${i}`}>
                {item.images[0] && <img src={item.images[0]} alt={item.name} className="cart-item-img" />}
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>Category: {item.category}</p>
                  <p>Price: KES {item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p className="subtotal">Subtotal: KES {item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <p>Total Items: {getTotalItems()}</p>
            <p>Total Price: KES {getTotalPrice()}</p>

            <div className="cart-actions">
              <button className="btn-clear" onClick={clearCart}>
                Clear Cart
              </button>
              <button className="btn-checkout" onClick={handleProceedToCheckout} disabled={loading}>
                {loading ? "Processing..." : "Proceed to Checkout"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* -------- Shipping Modal -------- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Enter Shipping Info</h3>
            <form onSubmit={handleSubmitOrder}>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={shippingInfo.name}
                onChange={handleChange}
                required
              />
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={shippingInfo.phone}
                onChange={handleChange}
                required
              />
              <label>Apartment/Street:</label>
              <input
                type="text"
                name="apartment"
                value={shippingInfo.apartment}
                onChange={handleChange}
                required
              />
              <label>Door Number:</label>
              <input
                type="text"
                name="doorNumber"
                value={shippingInfo.doorNumber}
                onChange={handleChange}
                required
              />
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
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

export default CartPage;
