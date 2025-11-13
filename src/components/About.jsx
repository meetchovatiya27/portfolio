// About.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./about.css";

const About = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadAbout = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/about/", { signal: controller.signal });

        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

        const data = await response.json();
        setAbout(data);
      } catch (err) {
        if (err.name !== "AbortError") setError("Unable to load about information right now.");
      } finally {
        setLoading(false);
      }
    };

    loadAbout();

    return () => controller.abort();
  }, []);

  const renderContent = () => {
    if (loading) return <p className="about-status">Loading...</p>;
    if (error) return <p className="about-status error">{error}</p>;
    if (!about) return null;

    return (
      <>
        {about.profile_image && (
          <motion.img
            className="about-avatar"
            src={about.profile_image}
            alt={about.name || "Profile"}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
          />
        )}
        <motion.h2
          className="about-heading"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {about.name || "About Me"}
        </motion.h2>
        <motion.p
          className="about-education"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {about.education}
        </motion.p>
        <motion.p
          className="about-text"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          {about.about_text}
        </motion.p>

        {/* Skills Grid */}
        {about.skills && about.skills.length > 0 && (
          <motion.div
            className="skills-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}
          >
            {about.skills.map((skill) => (
              <motion.div
                key={skill.name}
                style={{
                  width: "60px",
                  height: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(88, 166, 255, 0.1)",
                  borderRadius: "12px",
                  border: "1px solid rgba(88, 166, 255, 0.3)",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.3 }}
              >
                <img src={skill.icon} alt={skill.name} style={{ width: "40px", height: "40px" }} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </>
    );
  };

  return (
    <motion.section
      id="about"
      className="about-section"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5 }}
      style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}
    >
      <motion.div
        className="about-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        style={{ maxWidth: "800px", textAlign: "center" }}
      >
        {renderContent()}
      </motion.div>
    </motion.section>
  );
};

export default About;
