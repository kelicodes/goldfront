import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  // UI-level auth check (before API call)
  const requireAuth = () => {
    const token = getToken();

    if (!token) {
      const choice = window.confirm(
        "To add items to cart, you need to login.\n\nDo you want to login now?"
      );

      if (choice) navigate("/login");
      else navigate("/Collection");

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
          alert("Session expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  /* ================= PRODUCTS ================= */

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/fetch");
      if (res.data.products) setProducts(res.data.products);
    } catch (err) {
      console.error("Fetch products error:", err.response?.data || err.message);
    }
  };

  const fetchProductById = async (productId) => {
    try {
      const res = await api.get(`/products/fetch/${productId}`);
      return res.data.success ? res.data.theproduct : null;
    } catch (err) {
      console.error("Fetch product error:", err.response?.data || err.message);
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
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!requireAuth()) return false;

    await api.post(
      "/cart/add",
      { productId, quantity },
      getAuthHeader()
    );

    await myCart();
    return true;
  };

  const removeFromCart = async (productId) => {
    if (!requireAuth()) return;

    await api.post(
      "/cart/remove",
      { productId },
      getAuthHeader()
    );

    await myCart();
  };

  const updateCartItemQuantity = async (productId, quantity) => {
    if (!requireAuth()) return;

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    await api.post(
      "/cart/update",
      { productId, quantity },
      getAuthHeader()
    );

    await myCart();
  };

  const clearCart = async () => {
    if (!requireAuth()) return;

    await api.post("/cart/clear", {}, getAuthHeader());
    setCart([]);
  };

  const getTotalItems = () =>
    cart.reduce((sum, item) => sum + item.quantity, 0);

  const getTotalPrice = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  /* ================= ORDERS ================= */

  const fetchOrders = async () => {
    if (!getToken()) return;

    try {
      const res = await api.get(
        "/orders/userorders",
        getAuthHeader()
      );
      if (res.data) setOrders(res.data);
    } catch (err) {
      console.error("Fetch orders error:", err.response?.data || err.message);
    }
  };

  const createOrder = async (paymentMethod, shippingAddress) => {
    

    try {
      const res = await api.post(
        "/orders/create",
        { paymentMethod, shippingAddress },
        getAuthHeader()
      );

      if (res.data.order) {
        setOrders((prev) => [res.data.order, ...prev]);
        setCart([]);
      }

      return res.data;
    } catch (err) {
      console.error("Create order error:", err.response?.data || err.message);
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
