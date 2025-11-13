import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./experience.css";

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadExperiences = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/experiences/", { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setExperiences(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Unable to load experience details right now.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadExperiences();

    return () => controller.abort();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <p className="experience-status">Loading experiences…</p>;
    }

    if (error) {
      return <p className="experience-status error">{error}</p>;
    }

    if (!experiences.length) {
      return <p className="experience-status">Experience details coming soon.</p>;
    }

    return (
      <div className="experience-grid">
        {experiences.map((exp, idx) => (
          <motion.article
            key={`${exp.company_name}-${idx}`}
            className="experience-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.0, delay: idx * 0.15, ease: "easeOut" }}
          >
            <motion.header 
              className="experience-card__header"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.15 + 0.2, ease: "easeOut" }}
            >
              <h3 className="experience-card__company">{exp.company_name}</h3>
              <p className="experience-card__role">
                {exp.position}
                {exp.year ? (
                  <span className="experience-card__year"> · {exp.year}</span>
                ) : null}
              </p>
            </motion.header>
            {exp.languages && (
              <motion.div 
                className="experience-card__languages"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: idx * 0.15 + 0.4, ease: "easeOut" }}
              >
                {exp.languages.split(',').map((lang, langIdx) => (
                  <motion.span 
                    key={langIdx} 
                    className="experience-badge"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: idx * 0.15 + 0.5 + langIdx * 0.1, ease: "easeOut" }}
                    whileHover={{ scale: 1.15 }}
                  >
                    {lang.trim()}
                  </motion.span>
                ))}
              </motion.div>
            )}
            {exp.duration && (
              <motion.p 
                className="experience-card__meta"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15 + 0.6, ease: "easeOut" }}
              >
                <span className="label">Duration</span>
                <span>{exp.duration}</span>
              </motion.p>
            )}
            {exp.description && (
              <motion.p 
                className="experience-card__description"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: idx * 0.15 + 0.7, ease: "easeOut" }}
              >
                {exp.description}
              </motion.p>
            )}
          </motion.article>
        ))}
      </div>
    );
  };

  return (
    <section id="experience" className="experience-section">
      <motion.h2
        className="experience-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        Experience
      </motion.h2>
      {renderContent()}
    </section>
  );
};

export default Experience;
