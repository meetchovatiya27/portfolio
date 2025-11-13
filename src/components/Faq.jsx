import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Faq.css";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null); // Track which FAQ is open

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch("/faq-list/");
        if (!response.ok) throw new Error("Failed to fetch FAQs");
        const data = await response.json();
        setFaqs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  if (loading) return <p>Loading FAQs...</p>;

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const answerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  };

  return (
    <section className="faq-section">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        Frequently Asked Questions
      </motion.h2>

      <motion.div
        className="faq-list"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {faqs.map((faq) => (
          <motion.div
            key={faq.id}
            className={`faq-item ${openId === faq.id ? "open" : ""}`}
            variants={itemVariants}
            onClick={() => toggleFAQ(faq.id)}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="faq-question">
              {faq.question}
              <span className={`arrow ${openId === faq.id ? "rotate" : ""}`}>
                ▼
              </span>
            </h3>

            <motion.div
              className="faq-answer-wrapper"
              variants={answerVariants}
              initial="hidden"
              animate={openId === faq.id ? "visible" : "hidden"}
            >
              <p className="faq-answer">{faq.answer}</p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FAQ;
