import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const BASE_URL = "https://thegoldfina.onrender.com";

/* ================= AXIOS INSTANCE ================= */
const api = axios.create({
  baseURL: BASE_URL,
});

export const ShopContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  /* ================= AUTH HELPERS ================= */
  const getToken = () => localStorage.getItem("token");

  const getAuthHeader = () => {
    const token = getToken();
    if (!token) return {};
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  // UI-level auth check before API calls
  const requireAuth = () => {
    const token = getToken();

    if (!token) {
      toast.info("You need to login to perform this action.", {
        position: "top-center",
        autoClose: 3000,
      });

      // Redirect after a short delay
      setTimeout(() => navigate("/login"), 1500);

      return false;
    }

    return true;
  };

  /* ================= AXIOS INTERCEPTOR ================= */
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.", {
            position: "top-center",
            autoClose: 2500,
          });
          localStorage.removeItem("token");
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, [navigate]);

  /* ================= PRODUCTS ================= */
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/fetch");
      if (res.data.products) setProducts(res.data.products);
    } catch (err) {
      console.error("Fetch products error:", err.response?.data || err.message);
      toast.error("Failed to fetch products", { autoClose: 2000 });
    }
  };

  const fetchProductById = async (productId) => {
    try {
      const res = await api.get(`/products/fetch/${productId}`);
      return res.data.success ? res.data.theproduct : null;
    } catch (err) {
      console.error("Fetch product error:", err.response?.data || err.message);
      toast.error("Failed to fetch product", { autoClose: 2000 });
      return null;
    }
  };

  /* ================= CART ================= */
  const myCart = async () => {
    if (!getToken()) {
      setCart([]);
      return;
    }

    try {
      const res = await api.get("/cart/getcart", getAuthHeader());

      if (!res.data.cart?.items) {
        setCart([]);
        return;
      }

      const items = await Promise.all(
        res.data.cart.items.map(async (item) => {
          const product = await fetchProductById(item.productId);
          return {
            productId: item.productId,
            name: product?.name || "N/A",
            price: product?.price || 0,
            images: product?.images || [],
            quantity: item.quantity,
          };
        })
      );

      setCart(items);
    } catch (err) {
      console.error("Fetch cart error:", err.response?.data || err.message);
      setCart([]);
      toast.error("Failed to fetch cart", { autoClose: 2000 });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!requireAuth()) return false;

    try {
      await api.post("/cart/add", { productId, quantity }, getAuthHeader());
      await myCart();
      toast.success("Added to cart", { autoClose: 1500 });
      return true;
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
      toast.error("Failed to add to cart", { autoClose: 2000 });
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    if (!requireAuth()) return;

    try {
      await api.post("/cart/remove", { productId }, getAuthHeader());
      await myCart();
      toast.success("Removed from cart", { autoClose: 1500 });
    } catch (err) {
      console.error("Remove from cart error:", err.response?.data || err.message);
      toast.error("Failed to remove from cart", { autoClose: 2000 });
    }
  };

  const updateCartItemQuantity = async (productId, quantity) => {
    if (!requireAuth()) return;

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      await api.post("/cart/update", { productId, quantity }, getAuthHeader());
      await myCart();
      toast.info("Cart updated", { autoClose: 1500 });
    } catch (err) {
      console.error("Update cart error:", err.response?.data || err.message);
      toast.error("Failed to update cart", { autoClose: 2000 });
    }
  };

  const clearCart = async () => {
    if (!requireAuth()) return;

    try {
      await api.post("/cart/clear", {}, getAuthHeader());
      setCart([]);
      toast.info("Cart cleared", { autoClose: 1500 });
    } catch (err) {
      console.error("Clear cart error:", err.response?.data || err.message);
      toast.error("Failed to clear cart", { autoClose: 2000 });
    }
  };

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  /* ================= ORDERS ================= */
  const fetchOrders = async () => {
    if (!getToken()) return;

    try {
      const res = await api.get("/orders/userorders", getAuthHeader());
      if (res.data) setOrders(res.data);
    } catch (err) {
      console.error("Fetch orders error:", err.response?.data || err.message);
      toast.error("Failed to fetch orders", { autoClose: 2000 });
    }
  };

  const createOrder = async (paymentMethod, shippingAddress) => {
    if (!requireAuth()) return { success: false };

    try {
      const res = await api.post(
        "/orders/create",
        { paymentMethod, shippingAddress },
        getAuthHeader()
      );

      if (res.data.order) {
        setOrders((prev) => [res.data.order, ...prev]);
        setCart([]);
        toast.success("Order created successfully!", { autoClose: 2000 });
      }

      return res.data;
    } catch (err) {
      console.error("Create order error:", err.response?.data || err.message);
      toast.error("Failed to create order", { autoClose: 2000 });
      return { success: false };
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchProducts();
    if (getToken()) {
      myCart();
      fetchOrders();
    }
  }, []);

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        orders,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        fetchProducts,
        fetchOrders,
        createOrder,
        fetchProductById,
        myCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
