import { useState, useEffect, useContext } from "react"; 
import { useNavigate } from "react-router-dom";
import { Sun, Moon, ShoppingCart, LogOut } from "lucide-react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import { AuthContext } from "../../Context/Authcontext.jsx";
import { FaFirstOrder } from "react-icons/fa";

import "./Navbar.css";

const Navbar = () => {
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  const shopCtx = useContext(ShopContext) || {};
  const cart = shopCtx.cart || [];
  const myCart = shopCtx.myCart || (() => {});

  const authCtx = useContext(AuthContext) || {};
  const setToken = authCtx.setToken || (() => {});

  useEffect(() => {
    myCart(); // fetch user's cart data
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === "dark" ? "light" : "dark"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/" },
    { name: "About", path: "/" },
    { name: "Contact", path: "/" }
  ];

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <h2 onClick={()=>navigate("/")}>
          Gold<span>Store</span>
        </h2>
      </div>

      {/* Links */}
      <ul className="navbar-links">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.path}
              className={window.location.pathname === link.path ? "active" : ""}
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>

      {/* Right Side */}
      <div className="navbar-right">
        {/* Orders Icon */}
        <div className="navbar-orders" onClick={() => navigate("/orders")}>
          <FaFirstOrder size={24} />
        </div>

        {/* Cart Icon */}
        <div className="navbar-cart" onClick={() => navigate("/cart")}>
          <ShoppingCart size={24} />
          {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
        </div>

        {/* Theme Toggle */}
        <div className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
        </div>

        {/* Logout Button */}
        <div className="logout-btn" onClick={handleLogout}>
          <LogOut size={24} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
