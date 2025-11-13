// src/components/Testimonials.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Testimonials.css";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/testimonials-list/", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setTestimonials(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Unable to load testimonials. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();

    return () => controller.abort();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <p className="testimonials-status">Loading testimonials...</p>;
    }

    if (error) {
      return <p className="testimonials-status error">{error}</p>;
    }

    if (!testimonials || testimonials.length === 0) {
      return null;
    }

    return (
      <div className="testimonials-container">
        {testimonials.map((item, index) => (
          <motion.div
            className="testimonial-card"
            key={item.id || index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            {item.image && (
              <motion.img
                src={item.image}
                alt={item.name}
                className="testimonial-image"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              />
            )}
            <div className="testimonial-rating">
              {Array.from({ length: item.rating }, (_, i) => (
                <span key={i}>⭐</span>
              ))}
            </div>
            <p className="testimonial-feedback">"{item.feedback}"</p>
            <h3 className="testimonial-name">{item.name}</h3>
            <p className="testimonial-title">{item.title}</p>
            {item.company && <p className="testimonial-company">{item.company}</p>}
            <p className="testimonial-location">{item.location}</p>
          </motion.div>
        ))}
      </div>
    );
  };

  if (!loading && (!testimonials || testimonials.length === 0)) {
    return null;
  }

  return (
    <motion.section
      className="testimonials-section"
      id="testimonials"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 2 }} // slow fade for full section
    >
      <motion.div
        className="testimonials-inner"
        initial={{ y: 50 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }} // slow slide-up
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          Testimonials
        </motion.h2>
        <motion.p
          className="subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          What clients and colleagues say about my work
        </motion.p>
        {renderContent()}
      </motion.div>
    </motion.section>
  );
};

export default Testimonials;
