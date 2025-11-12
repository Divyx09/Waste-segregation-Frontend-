import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authUtils } from "../utils/auth";
import { 
  FaRecycle, 
  FaPlusCircle, 
  FaFilter, 
  FaSpinner, 
  FaBoxes, 
  FaLeaf, 
  FaShoppingCart,
  FaIndustry,
  FaNewspaper,
  FaWineBottle,
  FaMicrochip,
  FaDollarSign,
  FaChartLine,
  FaUserCheck,
  FaTruck,
  FaClock,
  FaStar,
  FaTimes,
  FaEdit
} from "react-icons/fa";
import axios from 'axios';
import "../assets/scss/style.scss";
import "../assets/scss/HomePage.modern.scss";
import "../assets/scss/SellWastePage.scss";
import ListingCard from "../components/ListingCard";

export default function SellWastePage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is a seller
    if (authUtils.isAuthenticated()) {
      const user = authUtils.getCurrentUser();
      setCurrentUser(user);
      setIsSeller(user.role?.toLowerCase() === 'seller');
    }
  }, []);

  const fetchListings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/listings`);
      
      let allListings = [];
      if (Array.isArray(res.data)) {
        allListings = res.data;
      } else if (res.data && Array.isArray(res.data.listings)) {
        allListings = res.data.listings;
      }

      // If user is a seller, filter to show only their listings
      if (isSeller && currentUser) {
        const userListings = allListings.filter(
          listing => listing.sellerId === currentUser.id || listing.seller_id === currentUser.id
        );
        setListings(userListings);
      } else {
        setListings(allListings);
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser !== null) {
      fetchListings();
    }
  }, [isSeller, currentUser]);

  const listingsArray = Array.isArray(listings) ? listings : [];
  const filteredListings =
    activeCategory === "all"
      ? listingsArray
      : listingsArray.filter((item) => item.category === activeCategory);

  const handleCreateListing = () => {
    if (!authUtils.isAuthenticated()) {
      alert("Please login to create a listing");
      navigate('/login');
      return;
    }
    
    const user = authUtils.getCurrentUser();
    if (user.role?.toLowerCase() === 'seller') {
      navigate('/seller-listing');
    } else {
      alert("Only sellers can create listings");
    }
  };

  const handleBecomeSeller = () => {
    if (!authUtils.isAuthenticated()) {
      alert("Please login first to become a seller");
      navigate('/login');
      return;
    }

    const user = authUtils.getCurrentUser();
    
    // Check if user is already a seller
    if (user.role?.toLowerCase() === 'seller') {
      alert("You are already a seller! You can create listings now.");
      navigate('/seller-listing');
      return;
    }
    
    // Navigate to license page for buyers who want to become sellers
    navigate('/license');
  };

  return (
    <div className="recycle-app sell-waste-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="sell-hero">
        <div className="hero-bg-elements">
          <div className="floating-circle circle-1"></div>
          <div className="floating-circle circle-2"></div>
          <div className="floating-circle circle-3"></div>
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <FaRecycle className="badge-icon" />
            <span>{isSeller ? "Your Seller Dashboard" : "Waste to Worth Platform"}</span>
          </div>
          
          <h1 className="hero-title">
            {isSeller ? (
              <>Your <span className="gradient-text">Listings</span> Portfolio</>
            ) : (
              <>Transform Your Waste Into <span className="gradient-text">Profit</span></>
            )}
          </h1>
          
          <p className="hero-subtitle">
            {isSeller 
              ? `Manage your ${listings.length} active listings, track performance, and reach more buyers.`
              : "Join 1000+ sellers earning revenue from recyclable materials. List instantly, get discovered by verified buyers, and make a positive environmental impact."
            }
          </p>
          
          <div className="hero-cta">
            {isSeller ? (
              <>
                <button className="btn-modern-primary" onClick={handleCreateListing}>
                  <FaPlusCircle className="btn-icon" />
                  Create New Listing
                  <div className="btn-shimmer"></div>
                </button>
                <button className="btn-modern-secondary" onClick={() => navigate('/seller-dashboard')}>
                  <FaChartLine className="btn-icon" />
                  View Analytics
                </button>
              </>
            ) : (
              <>
                <button className="btn-modern-primary" onClick={handleCreateListing}>
                  <FaPlusCircle className="btn-icon" />
                  Create Free Listing
                  <div className="btn-shimmer"></div>
                </button>
                <button className="btn-modern-secondary" onClick={handleBecomeSeller}>
                  <FaUserCheck className="btn-icon" />
                  Become a Seller
                </button>
              </>
            )}
          </div>

          {/* Hero Stats */}
          <div className="hero-stats">
            {isSeller ? (
              <>
                <div className="stat-item">
                  <FaBoxes className="stat-icon" />
                  <div className="stat-content">
                    <div className="stat-number">{listings.length}</div>
                    <div className="stat-label">Your Listings</div>
                  </div>
                </div>
                <div className="stat-item">
                  <FaChartLine className="stat-icon" />
                  <div className="stat-content">
                    <div className="stat-number">
                      {listings.filter(l => l.status?.toLowerCase() === 'active').length}
                    </div>
                    <div className="stat-label">Active Now</div>
                  </div>
                </div>
                <div className="stat-item">
                  <FaTruck className="stat-icon" />
                  <div className="stat-content">
                    <div className="stat-number">
                      {listings.filter(l => l.status?.toLowerCase() === 'sold').length}
                    </div>
                    <div className="stat-label">Sold Items</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="stat-item">
                  <FaChartLine className="stat-icon" />
                  <div className="stat-content">
                    <div className="stat-number">1,000+</div>
                    <div className="stat-label">Active Sellers</div>
                  </div>
                </div>
                <div className="stat-item">
                  <FaDollarSign className="stat-icon" />
                  <div className="stat-content">
                    <div className="stat-number">₹50L+</div>
                    <div className="stat-label">Revenue Generated</div>
                  </div>
                </div>
                <div className="stat-item">
                  <FaTruck className="stat-icon" />
                  <div className="stat-content">
                    <div className="stat-number">5,000+</div>
                    <div className="stat-label">Successful Deliveries</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Why Sell With Us Section - Show only for non-sellers */}
      {!isSeller && <WhySellSection />}

      {/* Marketplace Section */}
      <section className="marketplace-section">
        <div className="container">
          <div className="section-header-modern">
            <h2 className="section-title-modern">
              {isSeller ? "Your" : "Active"} <span className="gradient-text">
                {isSeller ? "Listings" : "Marketplace"}
              </span>
            </h2>
            <p className="section-subtitle-modern">
              {isSeller 
                ? "Manage, edit, and track your waste material listings"
                : "Discover what other sellers are offering and get inspired"
              }
            </p>
          </div>

          <CategoryFilter
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />

          {isLoading ? (
            <div className="loading-spinner">
              <FaSpinner className="spinner" />
              <p>Loading {isSeller ? "your" : "marketplace"} listings...</p>
            </div>
          ) : (
            <ListingsGrid listings={filteredListings} isSeller={isSeller} />
          )}
        </div>
      </section>

      {/* How It Works Section - Show only for non-sellers */}
      {!isSeller && <HowToSellSection />}

      <Footer />
    </div>
  );
}

const CategoryFilter = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    { id: "all", label: "All Materials", icon: FaBoxes, color: "#8b5cf6" },
    { id: "plastic", label: "Plastic", icon: FaRecycle, color: "#3b82f6" },
    { id: "metal", label: "Metal", icon: FaIndustry, color: "#64748b" },
    { id: "paper", label: "Paper", icon: FaNewspaper, color: "#f59e0b" },
    { id: "glass", label: "Glass", icon: FaWineBottle, color: "#06b6d4" },
    { id: "organic", label: "Organic", icon: FaLeaf, color: "#10b981" },
    { id: "electronic", label: "E-Waste", icon: FaMicrochip, color: "#ef4444" }
  ];

  return (
    <div className="category-filter-modern">
      {categories.map((cat) => {
        const IconComponent = cat.icon;
        return (
          <button
            key={cat.id}
            className={`category-btn-modern ${activeCategory === cat.id ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.id)}
            style={{ '--category-color': cat.color }}
          >
            <IconComponent className="category-icon" />
            <span>{cat.label}</span>
            {activeCategory === cat.id && <div className="active-indicator"></div>}
          </button>
        );
      })}
    </div>
  );
};

const ListingsGrid = ({ listings, isSeller }) => {
  const navigate = useNavigate();

  const handleEdit = (listing) => {
    navigate('/seller-listing', { state: { editListing: listing } });
  };

  const handleDelete = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/listings/${listingId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert('Listing deleted successfully!');
      window.location.reload(); // Refresh to update listings
    } catch (err) {
      console.error("Error deleting listing:", err);
      alert('Failed to delete listing. Please try again.');
    }
  };

  if (listings.length === 0) {
    return (
      <div className="no-listings">
        <FaBoxes className="no-listings-icon" />
        <h3>No listings found</h3>
        <p>{isSeller ? "You haven't created any listings yet. Click 'Create New Listing' to get started!" : "Be the first to list your recyclable materials!"}</p>
      </div>
    );
  }

  return (
    <div className="listings-grid-modern">
      {listings.map((listing) => (
        <div key={listing.id} className="listing-card-wrapper">
          <ListingCard listing={listing} />
          {isSeller && (
            <div className="seller-actions">
              <button className="action-btn edit-btn" onClick={() => handleEdit(listing)}>
                <FaEdit /> Edit
              </button>
              <button className="action-btn delete-btn" onClick={() => handleDelete(listing.id)}>
                <FaTimes /> Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const WhySellSection = () => {
  const benefits = [
    {
      icon: FaDollarSign,
      title: "Competitive Pricing",
      description: "AI-powered pricing recommendations ensure you get the best market rates for your materials",
      color: "#10b981"
    },
    {
      icon: FaUserCheck,
      title: "Verified Buyers",
      description: "Connect only with verified and trusted buyers for secure transactions",
      color: "#3b82f6"
    },
    {
      icon: FaTruck,
      title: "Fast Pickup",
      description: "Streamlined logistics with pickup options from your doorstep",
      color: "#f59e0b"
    },
    {
      icon: FaClock,
      title: "Quick Listings",
      description: "List your materials in under 2 minutes with our smart listing form",
      color: "#8b5cf6"
    }
  ];

  return (
    <section className="why-sell-section">
      <div className="container">
        <div className="section-header-modern">
          <span className="section-badge">
            <FaStar className="badge-icon" />
            Why Sell With Us
          </span>
          <h2 className="section-title-modern">
            The Best Platform for <span className="gradient-text">Waste Sellers</span>
          </h2>
          <p className="section-subtitle-modern">
            Join thousands of sellers earning sustainable revenue
          </p>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div 
                key={index}
                className="benefit-card"
                style={{ '--benefit-color': benefit.color }}
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
      </div>
    </section>
  );
};

const HowToSellSection = () => {
  const steps = [
    {
      number: "01",
      title: "Create Your Listing",
      description: "Use our desktop app to scan and categorize your waste with AI, or manually create a listing on the web",
      icon: FaPlusCircle,
      color: "#3b82f6"
    },
    {
      number: "02",
      title: "Get Buyer Requests",
      description: "Verified buyers browse and send purchase requests with their offers",
      icon: FaShoppingCart,
      color: "#10b981"
    },
    {
      number: "03",
      title: "Complete Transaction",
      description: "Accept the best offer, schedule pickup, and receive payment securely",
      icon: FaDollarSign,
      color: "#8b5cf6"
    }
  ];

  return (
    <section className="how-to-sell-section">
      <div className="container">
        <div className="section-header-modern">
          <h2 className="section-title-modern">
            How to <span className="gradient-text">Start Selling</span>
          </h2>
          <p className="section-subtitle-modern">
            Three simple steps to turn your waste into revenue
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div 
                key={index}
                className="step-card"
                style={{ '--step-color': step.color }}
              >
                <div className="step-number">{step.number}</div>
                <div className="step-icon">
                  <IconComponent />
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {index < steps.length - 1 && <div className="step-connector"></div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
