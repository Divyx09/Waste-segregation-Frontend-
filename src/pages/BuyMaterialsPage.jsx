import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ListingCard from "../components/ListingCard";
import { authUtils } from "../utils/auth";
import { 
  FaShoppingCart, 
  FaRecycle, 
  FaRocket, 
  FaCheckCircle, 
  FaBolt, 
  FaChartLine, 
  FaShieldAlt, 
  FaLeaf, 
  FaSearch, 
  FaHandshake,
  FaFilter,
  FaSpinner,
  FaBoxes,
  FaIndustry,
  FaNewspaper,
  FaWineBottle,
  FaMicrochip,
  FaUserCheck,
  FaTruck,
  FaStar,
  FaDollarSign
} from "react-icons/fa";
import axios from 'axios';
import "../assets/scss/style.scss";
import "../assets/scss/HomePage.modern.scss";
import "../assets/scss/BuyMaterialsPage.scss";

export default function BuyMaterialsPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchListings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/listings`);
      
      if (Array.isArray(res.data)) {
        setListings(res.data);
      } else if (res.data && Array.isArray(res.data.listings)) {
        setListings(res.data.listings);
      } else {
        setListings([]);
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const filteredListings = activeCategory === "all" 
    ? listings 
    : listings.filter(listing => listing.category?.toLowerCase() === activeCategory.toLowerCase());

  const categories = [
    { id: "all", label: "All Materials", icon: FaBoxes, color: "#10b981" },
    { id: "plastic", label: "Plastic", icon: FaRecycle, color: "#3b82f6" },
    { id: "metal", label: "Metal", icon: FaIndustry, color: "#8b5cf6" },
    { id: "paper", label: "Paper", icon: FaNewspaper, color: "#f59e0b" },
    { id: "glass", label: "Glass", icon: FaWineBottle, color: "#10b981" },
    { id: "e-waste", label: "E-Waste", icon: FaMicrochip, color: "#ef4444" },
    { id: "organic", label: "Organic", icon: FaLeaf, color: "#22c55e" }
  ];

  const handleBecomeBuyer = () => {
    if (!authUtils.isAuthenticated()) {
      navigate('/signup');
    } else {
      const user = authUtils.getCurrentUser();
      if (user.role?.toLowerCase() === 'buyer' || user.role?.toLowerCase() === 'seller') {
        alert("You're already registered as a " + user.role);
      } else {
        navigate('/signup');
      }
    }
  };

  return (
    <div className="recycle-app buy-materials-page">
      <Navbar />
      {/* Marketplace Section */}
      <section id="marketplace-section" className="marketplace-section">
        <div className="container">
          <div className="section-header-modern">
            <span className="section-badge">
              <FaShoppingCart className="badge-icon" />
              Materials Marketplace
            </span>
            <h2 className="section-title-modern">
              Browse Available <span className="gradient-text">Materials</span>
            </h2>
            <p className="section-subtitle-modern">
              Discover quality recycled materials from verified suppliers
            </p>
          </div>

          {/* Enhanced Category Filter */}
          <div className="category-filter-modern">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              const categoryCount = activeCategory === "all" 
                ? listings.length 
                : listings.filter(l => l.category?.toLowerCase() === cat.id.toLowerCase()).length;
              
              return (
                <button
                  key={cat.id}
                  className={`category-btn-modern ${activeCategory === cat.id ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{ 
                    '--category-color': cat.color,
                    '--category-bg': activeCategory === cat.id ? cat.color : 'transparent'
                  }}
                >
                  <IconComponent className="category-icon" />
                  <span>{cat.label}</span>
                  {cat.id !== "all" && <span className="category-count">{categoryCount}</span>}
                  {activeCategory === cat.id && <div className="active-indicator"></div>}
                </button>
              );
            })}
          </div>

          {/* Results Info */}
          {!isLoading && (
            <div className="results-info">
              <p>
                Showing <strong>{filteredListings.length}</strong> {filteredListings.length === 1 ? 'material' : 'materials'}
                {activeCategory !== "all" && ` in "${activeCategory}"`}
              </p>
            </div>
          )}

          {/* Listings Grid */}
          {isLoading ? (
            <div className="loading-state">
              <FaSpinner className="spinner-icon" />
              <p>Loading materials...</p>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <FaBoxes className="empty-icon" />
              </div>
              <h3>No materials found</h3>
              <p>
                {activeCategory === "all" 
                  ? "No materials available at the moment. Check back soon!" 
                  : `No ${activeCategory} materials available. Try another category.`}
              </p>
              <button className="btn-modern-secondary" onClick={() => setActiveCategory("all")}>
                View All Materials
              </button>
            </div>
          ) : (
            <div className="listings-grid">
              {filteredListings.map((listing, index) => (
                <div 
                  key={listing.id} 
                  className="listing-wrapper"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Browse & Search",
      description: "Explore our extensive marketplace of verified recycled materials. Use advanced filters to find exactly what you need.",
      icon: FaSearch,
      color: "#10b981"
    },
    {
      number: "02",
      title: "Connect with Sellers",
      description: "Direct communication with verified suppliers. Review ratings, certifications, and material specifications.",
      icon: FaHandshake,
      color: "#3b82f6"
    },
    {
      number: "03",
      title: "Secure Transactions",
      description: "Complete your purchase with confidence. Enjoy secure payments, quality guarantees, and reliable logistics.",
      icon: FaCheckCircle,
      color: "#8b5cf6"
    }
  ];

  return (
    <section className="how-it-works-modern">
      <div className="container">
        <div className="section-header-modern">
          <span className="section-badge">
            <FaBolt className="badge-icon" />
            How It Works
          </span>
          <h2 className="section-title-modern">
            Your Journey to <span className="gradient-text">Sustainable Sourcing</span>
          </h2>
          <p className="section-subtitle-modern">
            Three simple steps to access premium recycled materials
          </p>
        </div>

        <div className="steps-modern">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div 
                key={index}
                className="step-card-modern"
                style={{ '--step-color': step.color }}
              >
                <div className="step-number-modern">{step.number}</div>
                <div className="step-icon-modern">
                  <IconComponent />
                </div>
                <h3 className="step-title-modern">{step.title}</h3>
                <p className="step-description-modern">{step.description}</p>
                {index < steps.length - 1 && <div className="step-connector"></div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const BenefitsSection = () => {
  const benefits = [
    {
      icon: FaShieldAlt,
      title: "Verified Suppliers",
      description: "All sellers are thoroughly vetted to ensure quality and reliability",
      color: "#3b82f6"
    },
    {
      icon: FaChartLine,
      title: "Competitive Pricing",
      description: "AI-powered price optimization ensures you get the best market rates",
      color: "#10b981"
    },
    {
      icon: FaBolt,
      title: "Fast Delivery",
      description: "Streamlined logistics for quick and efficient material delivery",
      color: "#f59e0b"
    },
    {
      icon: FaLeaf,
      title: "Sustainability Impact",
      description: "Track and showcase your environmental contribution",
      color: "#8b5cf6"
    }
  ];

  return (
    <section className="benefits-section">
      <div className="container">
        <div className="section-header-modern">
          <h2 className="section-title-modern">
            Why Choose <span className="gradient-text">EcoWorth</span>
          </h2>
          <p className="section-subtitle-modern">
            Premium features designed for modern businesses
          </p>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            const hexToRgb = (hex) => {
              const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
              return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
            };
            
            return (
              <div 
                key={index}
                className="benefit-card"
                style={{
                  '--card-color': benefit.color,
                  '--card-color-light': `${benefit.color}33`,
                  '--card-color-dark': `${benefit.color}dd`
                }}
              >
                <div className="benefit-icon">
                  <IconComponent />
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="cta-section-modern" style={{ marginTop: '4rem' }}>
          <div className="cta-content">
            <h3>Ready to Source Sustainable Materials?</h3>
            <p>Join hundreds of businesses making a positive environmental impact</p>
          </div>
          <button className="btn-modern-primary">
            <FaRocket className="btn-icon" />
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
};
