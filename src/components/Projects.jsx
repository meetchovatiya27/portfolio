// src/components/Projects.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadProjects = async () => {
      try {
        const response = await fetch("/projects/", { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProjects();

    return () => controller.abort();
  }, []);

  if (loading) {
    return <p className="projects-status">Loading projects...</p>;
  }

  return (
    <motion.section
      id="projects"
      className="projects-section"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5 }}
      style={{ minHeight: "100vh", padding: "2rem 2rem" }}
    >
      <motion.h2
        className="projects-title"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{ textAlign: "center", marginBottom: "3rem" }}
      >
        Projects
      </motion.h2>

      <motion.div
        className="projects-grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}
      >
        {projects.map((project, idx) => (
          <motion.div
            key={idx}
            className="project-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 + idx * 0.2 }}
          >
            {project.image && (
              <img src={project.image} alt={project.title} className="project-card__image" />
            )}
            <div className="project-card__body">
              <h3 className="project-card__title">{project.title}</h3>
              <p className="project-card__summary">
                {project.description && project.description.length > 120
                  ? `${project.description.slice(0, 120)}…`
                  : project.description}
              </p>

              {/* Badges */}
              {project.badges && project.badges.length > 0 && (
                <div className="badges">
                  {project.badges.map((badge, i) => (
                    <span key={i} className="badge">
                      {badge}
                    </span>
                  ))}
                </div>
              )}

              {/* Links */}
              <div className="links">
                <a
                  className="github"
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                {project.demo && (
                  <a
                    className="demo"
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default Projects;
