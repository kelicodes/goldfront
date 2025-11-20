import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext.jsx";
import {
  logAddToCart,
  logViewProduct,
  logBeginCheckout,
} from "../../analytics";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, createOrder } = useContext(ShopContext);

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch product by id from context
  useEffect(() => {
    const foundProduct = products.find((p) => p._id.toString() === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setMainImage(foundProduct.images?.[0] || "");
      window.scrollTo({ top: 0, behavior: "smooth" });

      // ✅ Track product view in GA
      logViewProduct({
        productId: foundProduct._id,
        name: foundProduct.name,
        price: foundProduct.price,
        category: foundProduct.category,
      });
    }
  }, [id, products]);

  if (!product) return <p className="loading">Loading product...</p>;

  const handleAddToCart = async () => {
    setLoading(true);

    try {
      const success = await addToCart(product._id, quantity);

      if (success) {
        // ✅ Track add to cart in GA
        logAddToCart({
          productId: product._id,
          name: product.name,
          price: product.price,
          category: product.category,
          quantity,
        });

        navigate("/cart");
      } else {
        alert("Failed to add to cart. You can try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    setLoading(true);

    try {
      const added = await addToCart(product._id, quantity);
      if (!added) {
        alert("Failed to add to cart. Try again.");
        return;
      }

      // ✅ Track begin checkout for this product
      logBeginCheckout([
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          category: product.category,
          quantity,
        },
      ]);

      // Replace with actual shipping info input
      const order = await createOrder("Mpesa", {
        name: "User Name",
        phone: "0712345678",
        apartment: "Apartment A",
        doorNumber: "101",
      });

      if (order.success) {
        alert("Order created! Proceed to payment.");
        navigate("/checkout");
      } else {
        alert("Failed to create order.");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing buy now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="product-detail">
      <div className="product-images">
        <img src={mainImage} alt={product.name} className="main-image" />
        <div className="thumbnail-images">
          {product.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${product.name}-${idx}`}
              className={img === mainImage ? "active-thumb" : ""}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
      </div>

      <div className="product-info">
        <h2 className="product-name">{product.name}</h2>
        <p className="product-category">Category: {product.category}</p>
        <p className="product-price">KES {product.price}</p>
        <p className="product-desc">{product.desc}</p>

        <div className="quantity-selector">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)}>+</button>
        </div>

        <div className="action-buttons">
          <button
            className="btn-add-cart"
            onClick={handleAddToCart}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add to Cart"}
          </button>

          <button
            className="btn-buy-now"
            onClick={handleBuyNow} // ✅ Fixed: call handleBuyNow, not handleAddToCart
            disabled={loading}
          >
            {loading ? "Processing..." : "Buy Now"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
