import React from "react";
import "./Testimonials.css";

const testimonialsData = [
  {
    name: "John Doe",
    project: "Men's Sneakers",
    feedback: "These sneakers are amazing! Very durable and comfortable, perfect for daily use.",
  },
  {
    name: "Jane Smith",
    project: "Running Shoes",
    feedback: "The quality is top-notch! They fit perfectly and feel sturdy even after weeks of running.",
  },
  {
    name: "Ali Mohamed",
    project: "Leather Boots",
    feedback: "Bought these boots a month ago and they still look brand new. Extremely durable!",
  },
  {
    name: "Mary Wanjiku",
    project: "Casual Slip-ons",
    feedback: "Love these shoes! Very comfortable and long-lasting. Great value for money.",
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <h2 className="testimonials-title">Client Testimonials</h2>
      <div className="testimonials-marquee">
        <div className="testimonials-container">
          {testimonialsData.map((item, index) => (
            <div className="testimonial-card" key={index}>
              <p className="testimonial-feedback">"{item.feedback}"</p>
              <p className="testimonial-name">{item.name}</p>
              <p className="testimonial-project">{item.project}</p>
            </div>
          ))}
          {/* Repeat items for continuous scroll */}
          {testimonialsData.map((item, index) => (
            <div className="testimonial-card" key={index + testimonialsData.length}>
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
