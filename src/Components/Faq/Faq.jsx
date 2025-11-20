// src/Components/FAQ/FAQ.jsx
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./FAQ.css";

const faqData = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept M-Pesa, Visa, MasterCard, and Cash on Delivery (Pay when your order arrives).",
  },
  {
    question: "How long does delivery take?",
    answer: "Delivery typically takes 2-5 business days depending on your location.",
  },
  {
    question: "Can I return or exchange a product?",
    answer: "Yes! Products can be returned or exchanged within 7 days of delivery if they are unused and in original condition.",
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is shipped, you will receive a tracking link via SMS and email to monitor its progress.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Currently, we only ship within Kenya. We plan to expand our shipping globally in the future.",
  },
  {
    question: "How do I contact customer support?",
    answer: "You can reach our support team via email at support@yourbrand.com or call us at +254 700 123 456.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-container">
        {faqData.map((item, index) => (
          <div className="faq-item" key={index}>
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <span>{item.question}</span>
              <span className="faq-icon">
                {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>
            {openIndex === index && <div className="faq-answer">{item.answer}</div>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
