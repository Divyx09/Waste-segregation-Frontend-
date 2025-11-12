import React, { useState, useEffect } from "react";
import "../assets/scss/style.scss";
import "../assets/scss/HomePage.modern.scss";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";
import axios from 'axios';
import { FaFilter, FaPlusCircle, FaRecycle, FaCheckCircle, FaMapMarkerAlt, FaPhoneAlt, FaRupeeSign, FaInfoCircle, FaSpinner, FaLeaf, FaChartLine, FaShieldAlt, FaRocket, FaBolt, FaGlobe, FaStar, FaTimes } from "react-icons/fa";

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    category: "PET",
    quantity: "",
    pricePerKg: "",
    description: "",
    state: "",
    city: "",
    contactNumber: "",
  });

  // hrll9

  const fetchList = async () => {
    try {
      // GET /listings is a PUBLIC endpoint - no auth required
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/listings`);
      
      console.log("Listings API Response:", res.data);
      
      // Handle different response structures
      if (Array.isArray(res.data)) {
        setListings(res.data);
      } else if (res.data && Array.isArray(res.data.listings)) {
        setListings(res.data.listings);
      } else {
        console.warn("Unexpected response format:", res.data);
        setListings([]);
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
      console.error("Error details:", err.response?.data);
      setListings([]); // Set empty array on error
    } finally {
      setIsLoading(false); // ✅ Stop loading after fetching
    }
  };

  useEffect(() => {
    fetchList()
  }, []);

  // Ensure listings is always an array before filtering
  const listingsArray = Array.isArray(listings) ? listings : [];
  
  const filteredListings =
    activeCategory === "all"
      ? listingsArray
      : listingsArray.filter((item) => item.category === activeCategory);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateListing = (e) => {
    e.preventDefault();
    const newListing = {
      id: Date.now(),
      ...formData,
    };




    // Modal close & form reset
    setShowModal(false);
    setFormData({
      category: "PET",
      quantity: "",
      pricePerKg: "",
      description: "",
      state: "",
      city: "",
      contactNumber: "",
    });
  };

  return (
    <div className="recycle-app">
      <Navbar />
      <HeroSection openModal={() => setShowModal(true)} />

      {/* Sell Waste Section */}
      <div className="container">
        <CategoryFilter
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {isLoading ? (
          <div className="loading-spinner">
            <FaSpinner className="spinner" />
            <p>Analyzing waste streams with AI...</p>
          </div>
        ) : (
          <>
            <StatsBar listings={filteredListings} />
            <ListingsGrid listings={filteredListings} />
          </>
        )}
      </div>

      {/* Buy Materials Section */}
      <div>
        <HowItWorks />
      </div>

      {/* About Section */}
      <div>
        <Footer />
      </div>

      {/* Modern Create Listing Modal */}
      {showModal && (
        <div className="modal-overlay-modern" onClick={() => setShowModal(false)}>
          <div className="modal-content-modern" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setShowModal(false)}
              title="Close"
            >
              <FaTimes />
            </button>
            
            <div className="modal-header-modern">
              <div className="modal-icon-wrapper">
                <FaPlusCircle className="modal-icon" />
              </div>
              <h3>Create New Listing</h3>
              <p>List your recyclable materials and connect with buyers</p>
            </div>

            <form className="modal-form-modern" onSubmit={handleCreateListing}>
              <div className="form-row">
                <div className="form-group-modern full-width">
                  <label>
                    <FaRecycle className="label-icon" />
                    Material Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-select-modern"
                  >
                    <option value="PET">PET - Polyethylene Terephthalate</option>
                    <option value="HDPE">HDPE - High-Density Polyethylene</option>
                    <option value="LDPE">LDPE - Low-Density Polyethylene</option>
                    <option value="PVC">PVC - Polyvinyl Chloride</option>
                    <option value="PE">PE - Polyethylene</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group-modern">
                  <label>
                    <FaFilter className="label-icon" />
                    Quantity (kg)
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter quantity"
                    className="form-input-modern"
                    required
                  />
                </div>
                <div className="form-group-modern">
                  <label>
                    <FaRupeeSign className="label-icon" />
                    Price per kg (₹)
                  </label>
                  <input
                    type="number"
                    name="pricePerKg"
                    value={formData.pricePerKg}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    className="form-input-modern"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group-modern">
                  <label>
                    <FaMapMarkerAlt className="label-icon" />
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    className="form-input-modern"
                    required
                  />
                </div>
                <div className="form-group-modern">
                  <label>
                    <FaMapMarkerAlt className="label-icon" />
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    className="form-input-modern"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group-modern full-width">
                  <label>
                    <FaPhoneAlt className="label-icon" />
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="form-input-modern"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group-modern full-width">
                  <label>
                    <FaInfoCircle className="label-icon" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide details about the material condition, quality, etc."
                    className="form-textarea-modern"
                    rows="4"
                  />
                </div>
              </div>

              <div className="modal-actions-modern">
                <button
                  type="button"
                  className="btn-cancel-modern"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit-modern">
                  <FaPlusCircle className="btn-icon" />
                  Create Listing
                  <div className="btn-shimmer"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const HeroSection = ({ openModal }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="hero-modern">
      {/* Animated background elements */}
      <div className="hero-bg-elements">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>

      <div className="container hero-container">
        <div className="hero-content-modern" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          <div className="hero-badge">
            <FaLeaf className="badge-icon" />
            <span>Powered by AI & Sustainability</span>
          </div>
          
          <h1 className="hero-title-modern">
            Transform <span className="gradient-text">Waste</span> into
            <br />
            <span className="gradient-text-alt">Valuable Resources</span>
          </h1>
          
          <p className="hero-description-modern">
            Join the circular economy revolution. Our AI-powered marketplace 
            connects eco-conscious businesses with premium recycled materials, 
            making sustainability profitable and accessible.
          </p>

          <div className="hero-stats-inline">
            <div className="stat-pill">
              <FaBolt className="stat-icon" />
              <span><strong>10K+</strong> Transactions</span>
            </div>
            <div className="stat-pill">
              <FaGlobe className="stat-icon" />
              <span><strong>500+</strong> Partners</span>
            </div>
            <div className="stat-pill">
              <FaStar className="stat-icon" />
              <span><strong>98%</strong> Satisfaction</span>
            </div>
          </div>

          <div className="hero-cta-buttons">
            <button className="btn-modern-primary" onClick={openModal}>
              <FaPlusCircle className="btn-icon" />
              List Your Materials
              <div className="btn-shimmer"></div>
            </button>
            <button className="btn-modern-secondary">
              <FaRecycle className="btn-icon" />
              Explore Marketplace
            </button>
          </div>

          <div className="hero-trust-modern">
            <div className="trust-item">
              <FaShieldAlt className="trust-icon" />
              <span>Verified Suppliers</span>
            </div>
            <div className="trust-item">
              <FaCheckCircle className="trust-icon" />
              <span>Quality Assured</span>
            </div>
            <div className="trust-item">
              <FaChartLine className="trust-icon" />
              <span>AI Pricing</span>
            </div>
          </div>
        </div>

        {/* Interactive 3D illustration placeholder */}
        <div className="hero-visual-modern">
          <div className="visual-card card-1">
            <FaRecycle className="visual-icon" />
            <span>Smart Sorting</span>
          </div>
          <div className="visual-card card-2">
            <FaChartLine className="visual-icon" />
            <span>Price Analytics</span>
          </div>
          <div className="visual-card card-3">
            <FaGlobe className="visual-icon" />
            <span>Global Network</span>
          </div>
          <div className="central-orb">
            <div className="orb-ring"></div>
            <div className="orb-core">
              <FaRocket className="orb-icon" />
            </div>
          </div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="wave-separator">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  );
};

const CategoryFilter = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    { id: "all", name: "All Plastics", icon: FaRecycle, color: "#6366f1" },
    { id: "PET", name: "PET", icon: FaRecycle, color: "#10b981" },
    { id: "HDPE", name: "HDPE", icon: FaRecycle, color: "#3b82f6" },
    { id: "LDPE", name: "LDPE", icon: FaRecycle, color: "#f59e0b" },
    { id: "PVC", name: "PVC", icon: FaRecycle, color: "#ef4444" },
    { id: "PE", name: "PE", icon: FaRecycle, color: "#8b5cf6" },
  ];

  return (
    <div className="category-filter-modern">
      <div className="filter-header">
        <h3 className="filter-title-modern">
          <FaFilter className="filter-icon" />
          Filter by Material Type
        </h3>
        <span className="filter-count">{categories.length - 1} Types Available</span>
      </div>
      <div className="filter-buttons-modern">
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          return (
            <button
              key={cat.id}
              className={`filter-btn-modern ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                '--category-color': cat.color
              }}
            >
              <IconComponent className="category-icon" />
              <span className="category-name">{cat.name}</span>
              {activeCategory === cat.id && (
                <div className="active-indicator">
                  <FaCheckCircle />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const StatsBar = ({ listings }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

  const stats = [
    {
      value: listings.length,
      label: "Active Listings",
      icon: FaRecycle,
      color: "#10b981",
      suffix: ""
    },
    {
      value: "24",
      label: "Avg. Response Time",
      icon: FaBolt,
      color: "#f59e0b",
      suffix: "h"
    },
    {
      value: "98",
      label: "Verified Suppliers",
      icon: FaShieldAlt,
      color: "#3b82f6",
      suffix: "%"
    },
    {
      value: "AI",
      label: "Smart Pricing",
      icon: FaChartLine,
      color: "#8b5cf6",
      suffix: "",
      highlight: true
    }
  ];

  return (
    <div className="stats-bar-modern">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div 
            key={index}
            className={`stat-card-modern ${stat.highlight ? 'highlight' : ''} ${animated ? 'animated' : ''}`}
            style={{ 
              '--stat-color': stat.color,
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className="stat-icon-wrapper">
              <IconComponent className="stat-icon-modern" />
            </div>
            <div className="stat-content">
              <div className="stat-value-modern">
                {stat.value}{stat.suffix}
              </div>
              <div className="stat-label-modern">{stat.label}</div>
            </div>
            {stat.highlight && <div className="stat-pulse"></div>}
          </div>
        );
      })}
    </div>
  );
};

const ListingsGrid = ({ listings }) => {
  // Safety check: ensure listings is an array
  const listingsArray = Array.isArray(listings) ? listings : [];
  
  if (listingsArray.length === 0) {
    return (
      <div className="no-listings">
        <FaInfoCircle className="info-icon" />
        <h3>No listings available</h3>
        <p>Be the first to create a listing!</p>
      </div>
    );
  }

  return (
    <div className="listings-grid my-5 w-100">
      <div className="row g-4 w-100">
        {listingsArray.map(listing => (
          <div key={listing.id} className="col-md-4">
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "AI Material Analysis",
      description: "Our advanced AI instantly classifies your plastic waste and determines optimal pricing based on real-time market data and quality metrics.",
      icon: FaRecycle,
      color: "#10b981"
    },
    {
      number: "02",
      title: "Smart Matching Engine",
      description: "Intelligent algorithms connect you with verified buyers who need your specific materials, ensuring the perfect match every time.",
      icon: FaRocket,
      color: "#3b82f6"
    },
    {
      number: "03",
      title: "Seamless Transactions",
      description: "Enjoy secure payments, automated logistics coordination, and transparent tracking for effortless material exchange.",
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
            Our Process
          </span>
          <h2 className="section-title-modern">
            Circular Economy Made <span className="gradient-text">Simple</span>
          </h2>
          <p className="section-subtitle-modern">
            Revolutionizing plastic recycling with cutting-edge technology
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
                <div className="step-connector"></div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="cta-section-modern">
          <div className="cta-content">
            <h3>Ready to Start Your Sustainability Journey?</h3>
            <p>Join thousands of businesses making a positive environmental impact</p>
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

export default HomePage;
