import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext.jsx";
import { toast } from "react-toastify";
import "./Card.css";

const Card = ({ id, name, price, desc, category, image }) => {
  const { addToCart } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to add items to cart!");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    addToCart({
      _id: id,
      name,
      price,
      category,
      images: [image],
      quantity: 1,
    });

    toast.success("Item added to cart!");

    // ✅ Redirect user to cart after adding item
    setTimeout(() => {
      navigate("/cart");
    }, 800);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to continue!");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    navigate(`/buynow/${id}`);
  };

  const handleCardClick = () => {
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
