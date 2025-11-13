// src/components/Footer.jsx
import React, { useEffect, useState } from "react";

const Footer = () => {
  const [copyright, setCopyright] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/footer/")
      .then((res) => res.json())
      .then((data) => {
        setCopyright(data.copyright_text);
      })
      .catch((err) => {
        console.error("Failed to fetch footer:", err);
        setCopyright("© 2025 Meet Chovatiya. All rights reserved.");
      });
  }, []);

  return (
    <footer style={{ textAlign: "center", padding: "20px", background: "#0b1622", color: "#e6edf3" }}>
      {copyright}
    </footer>
  );
};

export default Footer;
