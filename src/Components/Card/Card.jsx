import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext.jsx";
import { toast } from "react-toastify";
import { logAddToCart, logViewProduct, logBeginCheckout } from "../../analytics";
import "./Card.css";

const Card = ({ id, name, price, desc, category, image }) => {
  const { addToCart } = useContext(ShopContext);
  const navigate = useNavigate();

  // Add to cart handler
  const handleAddToCart = async (e) => {
    e.stopPropagation();

    // Use ShopContext addToCart (which internally uses requireAuth)
    const success = await addToCart(id);

    if (success) {
      const item = { productId: id, name, price, category, images: [image], quantity: 1 };
      logAddToCart(item); // analytics
      toast.success("Item added to cart!");
      setTimeout(() => navigate("/cart"), 800);
    } else {
      // If not successful, requireAuth already handled redirect
      toast.info("You need to login to add items to cart.");
    }
  };

  // Buy now handler
  const handleBuyNow = (e) => {
    e.stopPropagation();
    const item = { productId: id, name, price, category, images: [image], quantity: 1 };
    logBeginCheckout([item]); 
    navigate(`/buynow/${id}`);
  };

  // Card click handler (view product)
  const handleCardClick = () => {
    const item = { productId: id, name, price, category };
    logViewProduct(item); // analytics
    navigate(`/product/${id}`);
  };

  return (
    <div className="card" onClick={handleCardClick}>
      <img src={image} alt={name} className="card-image" />
      <div className="card-content">
        <h3 className="card-title">{name}</h3>
        <p className="card-desc">{desc}</p>
        <div className="card-footer">
          <span className="card-price">KES {price}</span>
          <div className="card-buttons">
            <button className="btn-add-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="btn-buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
