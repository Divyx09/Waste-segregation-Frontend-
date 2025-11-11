import { Link, useNavigate } from "react-router-dom";
import { FaRecycle, FaShoppingCart, FaInfoCircle, FaRocket, FaBars, FaTimes, FaLeaf } from "react-icons/fa";
import { useState } from "react";
import "../assets/scss/style.scss";
import "../assets/scss/Navbar.modern.scss";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { href: "#sell", label: "Sell Waste", icon: FaRecycle },
    { href: "#buy", label: "Buy Materials", icon: FaShoppingCart },
    { href: "#about", label: "About", icon: FaInfoCircle },
  ];

  return (
    <header className="navbar-modern">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon-wrapper">
            <FaLeaf className="logo-icon" />
          </div>
          <div className="logo-text">
            <h1>EcoWorth</h1>
            <span className="logo-tagline">Sustainable Future</span>
          </div>
        </Link>

        <nav className={`navbar-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-links">
            {navLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <li key={index}>
                  <a 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="nav-link"
                  >
                    <IconComponent className="nav-icon" />
                    <span>{link.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <button 
            className="navbar-cta-btn"
            onClick={() => {
              navigate('/signup');
              setMobileMenuOpen(false);
            }}
          >
            <FaRocket className="btn-icon" />
            Get Started
            <div className="btn-shimmer"></div>
          </button>
        </nav>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
