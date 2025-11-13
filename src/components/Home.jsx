import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./home.css";

const Home = () => {
  const [hero, setHero] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showProjects, setShowProjects] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadHero = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/hero-data/", {
          signal: controller.signal,
        });

        if (!response.ok)
          throw new Error(`Request failed with status ${response.status}`);

        const data = await response.json();
        setHero(data);
      } catch (err) {
        if (err.name !== "AbortError")
          setError(
            "Unable to load hero information. Please try again later."
          );
      } finally {
        setLoading(false);
      }
    };

    const loadProjects = async () => {
      try {
        const response = await fetch("/projects-data/");
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadHero();
    loadProjects();

    return () => controller.abort();
  }, []);

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const renderHero = () => {
    if (loading) return <p className="home-status">Loading...</p>;
    if (error) return <p className="home-status error">{error}</p>;
    if (!hero) return null;

    return (
      <>
        <motion.h1
          className="home-name"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Hi, I'm{" "}
          <span style={{ color: hero.name_color || "#be123c" }}>
            {hero.name || "Meet Chovatiya"}
          </span>{" "}
          Frontend Engineer with Full Stack Expertise.
        </motion.h1>

        <motion.h2
          className="home-role"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {hero.role || "Role coming soon"}
        </motion.h2>

        <motion.p
          className="home-tagline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {hero.tagline || ""}
        </motion.p>

        <motion.p
          className="home-status-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {hero.available_for_work
            ? `Available for work — Currently based in ${hero.location}, open to relocate`
            : `Currently based in ${hero.location}`}
        </motion.p>

        <motion.div
          className="home-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {hero.resume_link && (
            <motion.a
              className="home-btn"
              href={hero.resume_link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              View Resume
            </motion.a>
          )}

          <motion.button
            className="home-btn outline"
            onClick={() => handleScroll("contact")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            Get in Touch
          </motion.button>
        </motion.div>

        <motion.div
          className="home-socials"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {hero.linkedin_icon && (
            <a
              href={hero.linkedin_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={hero.linkedin_icon}
                alt="LinkedIn"
                style={{ width: 32, height: 32 }}
              />
            </a>
          )}
          {hero.github_icon && (
            <a
              href={hero.github_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={hero.github_icon}
                alt="GitHub"
                style={{ width: 32, height: 32 }}
              />
            </a>
          )}
          {hero.instagram_icon && (
            <a
              href={hero.instagram_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={hero.instagram_icon}
                alt="Instagram"
                style={{ width: 32, height: 32 }}
              />
            </a>
          )}
        </motion.div>
      </>
    );
  };

  const renderProjects = () => {
    if (!projects.length) return <p>No projects found.</p>;

    return (
      <div className="projects-section">
        <h2>My Projects</h2>
        <div className="projects-grid">
          {projects.map((proj) => (
            <div key={proj.id} className="project-card">
              <h3>{proj.title}</h3>
              <p>{proj.description}</p>
              {proj.link && (
                <a href={proj.link} target="_blank" rel="noopener noreferrer">
                  View Project
                </a>
              )}
            </div>
          ))}
        </div>

        <button
          className="home-btn outline"
          onClick={() => setShowProjects(false)}
        >
          Back to Home
        </button>
      </div>
    );
  };

  return (
    <motion.section className="home-section">
      <motion.div className="home-content">
        {showProjects ? renderProjects() : renderHero()}
      </motion.div>
    </motion.section>
  );
};

export default Home;
