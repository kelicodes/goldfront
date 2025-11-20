import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import { initGA, logPageView } from "./analytics.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Pages/Home/Home.jsx";
import Login from "./Pages/Login/Login.jsx";
import Collection from "./Components/Collection/Collection.jsx";
import ProductDetail from "./Pages/Productdetail/Productdetail.jsx";
import Cartcheckout from "./Pages/Cartcheckout/Cartcheckout.jsx";
import CheckoutPage from "./Pages/Checkout/Checkout.jsx";
import Orders from "./Pages/Orders/Orders.jsx";
import ProtectedRoute from "./Components/Protected/ProtectedRoute.jsx";
import CategoryDisplay from "./Pages/Shopcat/Shopcat.jsx";
import BuyNowCheckout from "./Pages/Buynow/BuyNow.jsx";
import { useEffect } from "react";

const App = () => {
  const location = useLocation();

  const hideLayout = ["/login"];
  const showLayout = !hideLayout.includes(location.pathname);

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    logPageView(location.pathname);
  }, [location]);

  return (
    <div className="app">
      <ToastContainer position="top-center" autoClose={2000} />

      {showLayout && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cartcheckout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/buynow/:productId"
            element={
              <ProtectedRoute>
                <BuyNowCheckout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/category/:cat"
            element={
              <ProtectedRoute>
                <CategoryDisplay />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {showLayout && <Footer />}
    </div>
  );
};

export default App;
