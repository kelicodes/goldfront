import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Testimonials.css";

const Testimonials = () => {
  const [products, setProducts] = useState([]);
  const BASE_URL = "https://thegoldfina.onrender.com";

  const clientNames = [
    "John Doe",
    "Jane Smith",
    "Ali Mohamed",
    "Mary Wanjiku",
    "Peter Kimani",
    "Grace Otieno"
  ];

  const feedbackPhrases = [
    "really solved my problem with uncomfortable shoes. I can wear them all day without any pain, and they still look great after weeks of use.",
    "were exactly what I needed. My old shoes kept wearing out quickly, but these feel sturdy, durable, and comfortable.",
    "gave me the support I was looking for. My feet used to hurt after long walks, but now I can go the whole day without issues.",
    "exceeded my expectations. The quality is outstanding and I finally found shoes that last and stay stylish at the same time.",
    "have been a game-changer for my daily routine. No more blisters or sore feet, and they fit perfectly!",
    "made my life easier. I’ve been struggling to find shoes that are both comfortable and long-lasting, and these are perfect."
  ];

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/products/fetch`);
      if (res.data.products) setProducts(res.data.products);
    } catch (err) {
      console.error("Fetch products error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Generate unique testimonials
  const testimonialsData = products.slice(0, 6).map((prod, idx) => ({
    name: clientNames[idx % clientNames.length],
    project: prod.name,
    feedback: `I bought these ${prod.name} and they ${feedbackPhrases[idx % feedbackPhrases.length]}`,
    image: prod.images?.[0] || null,
  }));

  // Duplicate for continuous scroll
  const scrollItems = [...testimonialsData, ...testimonialsData];

  return (
    <section className="testimonials-section">
      <h2 className="testimonials-title">Client Testimonials</h2>
      <div className="testimonials-marquee">
        <div className="testimonials-container">
          {scrollItems.map((item, index) => (
            <div className="testimonial-card" key={index}>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.project}
                  className="testimonial-image"
                />
              )}
              <p className="testimonial-feedback">"{item.feedback}"</p>
              <p className="testimonial-name">{item.name}</p>
              <p className="testimonial-project">{item.project}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
