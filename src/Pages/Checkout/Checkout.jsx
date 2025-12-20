import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Checkout.css";

const BASE_URL = "https://thegoldfina.onrender.com";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("Mpesa");
  const [checkoutRequestID, setCheckoutRequestID] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // Fetch order on mount
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/orders/${orderId}`, getAuthHeader());
        if (res.data.success && res.data.order) {
          setOrder(res.data.order);
          setPaymentMethod(res.data.order.paymentMethod || "Mpesa");
        } else {
          toast.error("⚠️ Order not found.");
          navigate("/cart");
        }
      } catch (err) {
        console.error(err);
        toast.error("⚠️ Failed to fetch order.");
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  // Poll payment status
  useEffect(() => {
    if (!checkoutRequestID) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${BASE_URL}/orders/check-payment/${checkoutRequestID}`, getAuthHeader());
        if (res.data.paid) {
          toast.success("✅ Payment confirmed!");
          await axios.put(`${BASE_URL}/orders/${orderId}/status`, { status: "Completed" }, getAuthHeader());
          clearInterval(interval);
          navigate("/orders");
        } else if (res.data.failed) {
          toast.error("❌ Payment failed.");
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Payment polling error:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [checkoutRequestID, orderId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!order) return;

    setIsSubmitting(true);

    try {
      // Refresh order data before proceeding
      await axios.get(`${BASE_URL}/orders/${orderId}`, getAuthHeader());

      if (paymentMethod === "Mpesa") {
        const res = await axios.post(
          `${BASE_URL}/pay/stkpush`,
          {
            phone: order.shippingAddress.phone,
            amount: order.totalAmount,
            orderId,
            items: order.items ,
          },
          getAuthHeader()
        );
        console.log(res.data)
        console.log("CheckoutRequestID from STK Push:", res.data.CheckoutRequestID);

        if (res.data.success && res.data.CheckoutRequestID) {
          // Save CheckoutRequestID to database
          const patchRes = await axios.patch(
            `${BASE_URL}/orders/update-checkout/${orderId}`,
            { checkoutRequestID: res.data.CheckoutRequestID },
            getAuthHeader()
          );
          console.log("PATCH result:", patchRes.data);

          setCheckoutRequestID(res.data.CheckoutRequestID);
          toast.info("✅ STK Push sent. Check your phone to complete payment.");
        } else {
          toast.error("❌ Failed to initiate payment.");
        }
      } else {
        // Cash payment
        toast.success("✅ Order placed! Pay on delivery.");
        navigate("/orders");
      }
    } catch (err) {
      console.error("Checkout error:", err.response || err);
      toast.error("⚠️ Something went wrong during checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Loading order details...</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <section className="checkout-page">
      <h2 className="checkout-title">Checkout</h2>

      <div className="checkout-container">
        {/* Order Summary */}
        <div className="cart-summary card">
          <h3>Order Summary</h3>
          {order.items?.length > 0 ? (
            <ul className="cart-items-list">
              {order.items.map((item) => (
                <li key={item.productId} className="cart-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>KES {item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No items in this order.</p>
          )}
          <hr />
          <p><strong>Total Price:</strong> KES {order.totalAmount}</p>
          <p><strong>Shipping Phone:</strong> {order.shippingAddress.phone}</p>
        </div>

        {/* Payment Form */}
        <form className="payment-form card" onSubmit={handleSubmit}>
          <h3>Payment Method</h3>
          <label>
            Choose Payment:
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="Mpesa">M-Pesa Payment</option>
              <option value="Cash">Pay on Delivery (Cash)</option>
            </select>
          </label>

          <button className="btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Place Order"}
          </button>

          {isSubmitting && paymentMethod === "Mpesa" && (
            <p className="payment-spinner">⏳ Waiting for M-Pesa confirmation...</p>
          )}
        </form>
      </div>
    </section>
  );
};

export default CheckoutPage;
