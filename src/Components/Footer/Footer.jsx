import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-section brand">
          <h2 className="footer-logo">MyShop</h2>
          <p>Your one-stop destination for quality products and great deals.</p>
        </div>

        {/* Links Section */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/shop">Shop</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul>
            <li>Email: support@myshop.com</li>
            <li>Phone: +254 700 000 000</li>
            <li>Location: Nairobi, Kenya</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MyShop. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
