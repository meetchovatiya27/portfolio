// src/App.js
import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import "./components/common.css";
import Contact from "./components/Contact";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import Faq from "./components/Faq";

function App() {
  const [hasTestimonials, setHasTestimonials] = useState(false);

  useEffect(() => {
    // Check if testimonials exist
    const checkTestimonials = async () => {
      try {
        const response = await fetch("/testimonials-list/");
        if (response.ok) {
          const data = await response.json();
          setHasTestimonials(data && data.length > 0);
        }
      } catch (err) {
        setHasTestimonials(false);
      }
    };

    checkTestimonials();
  }, []);

  return (
    <>
      <Navbar />
      <main className="page-content">
        <Home />
        <About />
        <Experience />
        <Projects />
        {hasTestimonials && <Testimonials />}
        <Faq/>
        <Contact/>
        <Footer/>
      </main>
    </>
  );
}

export default App;
