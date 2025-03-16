import { Link } from "react-router-dom";
import "../componentsCSS/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-logo">
        <Link to="/">
          <span className="logo-part Ai">PGIGA-</span>
          <span className="logo-part Models">Dashboard</span>
        </Link>
      </div>

      <div className="footer-text">
        <p>
        PGAGI Analytics Dashboard is a web-based platform built using the MERN stack (MongoDB, Express.js, React, Node.js) with Next.js and JavaScript. It integrates APIs for real-time weather, news, and financial data. Featuring Redux for state management, Tailwind CSS for styling, and advanced animations, it ensures high performance, accessibility, and a seamless user experience. The dashboard also includes authentication, dark mode, and interactive data visualizations.
        </p>
      </div>

      <div className="footer-copyright">
        <p>&copy; 2024 PGIGA-Dashboard. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
