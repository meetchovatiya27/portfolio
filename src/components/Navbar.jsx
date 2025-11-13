import React, { useEffect, useState, useMemo } from "react";
import "./common.css";

const baseNavItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [hasTestimonials, setHasTestimonials] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu state

  // Check if testimonials exist
  useEffect(() => {
    const checkTestimonials = async () => {
      try {
        const response = await fetch("/testimonials-list/");
        if (response.ok) {
          const data = await response.json();
          setHasTestimonials(Array.isArray(data) && data.length > 0);
        }
      } catch {
        setHasTestimonials(false);
      }
    };
    checkTestimonials();
  }, []);

  // Memoize nav items
  const navItems = useMemo(() => {
    return hasTestimonials
      ? [
          ...baseNavItems.slice(0, -1),
          { id: "testimonials", label: "Testimonials" },
          baseNavItems[baseNavItems.length - 1],
        ]
      : baseNavItems;
  }, [hasTestimonials]);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offset = scrollY + window.innerHeight * 0.2;

      let currentSection = activeSection; // start with current section

      for (const { id } of navItems) {
        const section = document.getElementById(id);
        if (!section) continue;

        const top = section.offsetTop;
        const height = section.offsetHeight;

        if (offset >= top && offset < top + height) {
          currentSection = id;
          break;
        }
      }

      if (scrollY === 0) currentSection = "home";

      setActiveSection(currentSection);
      setScrolled(scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems, activeSection]);

  // Smooth scroll with offset
  const handleClick = (event, id) => {
    event.preventDefault();

    const section = document.getElementById(id);
    if (section) {
      let yOffset = -100;
      if (id === "home") yOffset = 0;

      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
      setMenuOpen(false); // close mobile menu after click
    } else {
      if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveSection("home");
      } else {
        console.warn(`Section with id "${id}" not found`);
      }
    }
  };

  return (
    <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`} aria-label="Primary Navigation">
      <div className="navbar-container">
        {/* Mobile Hamburger */}
        <button
          className="mobile-toggle"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="hamburger"></span>
        </button>

        {/* Navigation Links */}
        <ul className={`nav-links ${menuOpen ? "nav-links--open" : ""}`}>
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(event) => handleClick(event, item.id)}
                className={activeSection === item.id ? "active" : ""}
                aria-current={activeSection === item.id ? "page" : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
