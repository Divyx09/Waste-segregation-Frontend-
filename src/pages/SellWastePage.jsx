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
  FaEdit,
} from "react-icons/fa";
import axios from "axios";
import "../assets/scss/style.scss";
import "../assets/scss/HomePage.modern.scss";
import "../assets/scss/SellWastePage.scss";
import ListingCard from "../components/ListingCard";
import "../assets/scss/ListingModal.scss";

export default function SellWastePage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    // Check if user is a seller
    if (authUtils.isAuthenticated()) {
      const user = authUtils.getCurrentUser();
      setCurrentUser(user);
      setIsSeller(user.role?.toLowerCase() === "seller");
    }
  }, []);

  const fetchListings = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/listings/my`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      let allListings = [];
      if (Array.isArray(res.data)) {
        allListings = res.data;
      } else if (res.data && Array.isArray(res.data.listings)) {
        allListings = res.data.listings;
      }

      // If user is a seller, filter to show only their listings
      if (isSeller && currentUser) {
        const userListings = allListings.filter(
          (listing) =>
            listing.sellerId === currentUser.id ||
            listing.seller_id === currentUser.id
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

const statesWithCities = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Kakinada"],
    "Delhi": ["New Delhi", "North Delhi", "South Delhi", "West Delhi", "East Delhi"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
    "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Karnal"],
    "Karnataka": ["Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum"],
    "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam"],
    "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Chandigarh"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer"],
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
      navigate("/login");
      return;
    }

    const user = authUtils.getCurrentUser();
    if (user.role?.toLowerCase() === "seller") {
      navigate("/seller-dashboard");
    } else {
      alert("Only sellers can create listings");
    }
  };

  const handleBecomeSeller = () => {
    if (!authUtils.isAuthenticated()) {
      alert("Please login first to become a seller");
      navigate("/login");
      return;
    }

    const user = authUtils.getCurrentUser();

    // Check if user is already a seller
    if (user.role?.toLowerCase() === "seller") {
      alert("You are already a seller! You can create listings now.");
      navigate("/seller-listing");
      return;
    }

    // Navigate to license page for buyers who want to become sellers
    navigate("/license");
  };

  // --- LOGIC MOVED TO PARENT ---
  // Opens the modal and sets the selected listing
  const handleEditClick = (listing) => {
    setSelectedListing(listing);
    setIsEditModalOpen(true);
  };

  // Handles the deletion of a listing
  const handleDelete = async (listingId) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) {
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/listings/${listingId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Listing deleted successfully!");
      // Update state by removing the deleted listing
      setListings((prev) => prev.filter((listing) => listing.id !== listingId));
    } catch (err) {
      console.error("Error deleting listing:", err);
      alert("Failed to delete listing. Please try again.");
    }
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
            <span>
              {isSeller ? "Your Seller Dashboard" : "Waste to Worth Platform"}
            </span>
          </div>

          <h1 className="hero-title">
            {isSeller ? (
              <>
                Your <span className="gradient-text">Listings</span> Portfolio
              </>
            ) : (
              <>
                Transform Your Waste Into <span className="gradient-text">Profit</span>
              </>
            )}
          </h1>

          <p className="hero-subtitle">
            {isSeller
              ? `Manage your ${listings.length} active listings, track performance, and reach more buyers.`
              : "Join 1000+ sellers earning revenue from recyclable materials. List instantly, get discovered by verified buyers, and make a positive environmental impact."}
          </p>

          <div className="hero-cta">
            {isSeller ? (
              <>
                <button
                  className="btn-modern-primary"
                  onClick={handleCreateListing}
                >
                  <FaPlusCircle className="btn-icon" />
                  Create New Listing
                  <div className="btn-shimmer"></div>
                </button>
                <button
                  className="btn-modern-secondary"
                  onClick={() => navigate("/seller-dashboard")}
                >
                  <FaChartLine className="btn-icon" />
                  View Analytics
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn-modern-primary"
                  onClick={handleCreateListing}
                >
                  <FaPlusCircle className="btn-icon" />
                  Create Free Listing
                  <div className="btn-shimmer"></div>
                </button>
                <button
                  className="btn-modern-secondary"
                  onClick={handleBecomeSeller}
                >
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
                      {
                        listings.filter(
                          (l) => l.status?.toLowerCase() === "active"
                        ).length
                      }
                    </div>
                    <div className="stat-label">Active Now</div>
                  </div>
                </div>
                <div className="stat-item">
                  <FaTruck className="stat-icon" />
                  <div className="stat-content">
                    <div className="stat-number">
                      {
                        listings.filter(
                          (l) => l.status?.toLowerCase() === "sold"
                        ).length
                      }
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
              {isSeller ? "Your" : "Active"}{" "}
              <span className="gradient-text">
                {isSeller ? "Listings" : "Marketplace"}
              </span>
            </h2>
            <p className="section-subtitle-modern">
              {isSeller
                ? "Manage, edit, and track your waste material listings"
                : "Discover what other sellers are offering and get inspired"}
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
            // --- PROPS PASSED DOWN ---
            <ListingsGrid
              listings={filteredListings}
              isSeller={isSeller}
              onEditClick={handleEditClick}
              onDeleteClick={handleDelete}
            />
          )}
        </div>
      </section>

      {/* How It Works Section - Show only for non-sellers */}
      {!isSeller && <HowToSellSection />}

      <Footer />

      {/* --- THIS IS NOW THE ONLY MODAL --- */}
      {/* It will open when isEditModalOpen is true */}
      {isEditModalOpen && (
        <EditListingModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          listing={selectedListing}
          onSave={(updatedListing) => {
            setListings((prev) =>
              prev.map((listing) =>
                listing.id === updatedListing.id ? updatedListing : listing
              )
            );
            setIsEditModalOpen(false); // Close modal on save
          }}
          statesWithCities={statesWithCities} // Prop is correctly passed
        />
      )}
    </div>
  );
}

const CategoryFilter = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    { id: "all", label: "All Plastics", icon: FaBoxes, color: "#8b5cf6" },
    { id: "PET", label: "PET", icon: FaRecycle, color: "#3b82f6" },
    { id: "HDPE", label: "HDPE", icon: FaRecycle, color: "#10b981" },
    { id: "LDPE", label: "LDPE", icon: FaRecycle, color: "#f59e0b" },
    { id: "PE", label: "PE", icon: FaRecycle, color: "#06b6d4" },
    { id: "PVC", label: "PVC", icon: FaRecycle, color: "#ef4444" },
  ];

  return (
    <div className="category-filter-modern">
      {categories.map((cat) => {
        const IconComponent = cat.icon;
        return (
          <button
            key={cat.id}
            className={`category-btn-modern ${
              activeCategory === cat.id ? "active" : ""
            }`}
            onClick={() => setActiveCategory(cat.id)}
            style={{ "--category-color": cat.color }}
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

// --- SIMPLIFIED LISTINGSGRID ---
const ListingsGrid = ({ listings, isSeller, onEditClick, onDeleteClick }) => {
  if (listings.length === 0) {
    return (
      <div className="no-listings">
        <FaBoxes className="no-listings-icon" />
        <h3>No listings found</h3>
        <p>
          {isSeller
            ? "You haven't created any listings yet. Click 'Create New Listing' to get started!"
            : "Be the first to list your recyclable materials!"}
        </p>
      </div>
    );
  }

  return (
    <div className="listings-grid-modern">
      {listings.map((listing) => (
        <div key={listing.id} className="listing-card-wrapper">
          <ListingCard listing={listing} />
          {isSeller && (
            <div className="seller-actions mt-2">
              <button
                className="action-btn edit-btn"
                onClick={() => onEditClick(listing)}
              >
                {/* <FaEdit /> */}
                 Edit
              </button>
              <button
                className="action-btn delete-btn"
                onClick={() => onDeleteClick(listing.id)}
              >
                {/* <FaTimes />  */}
                Delete
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
      description:
        "AI-powered pricing recommendations ensure you get the best market rates for your materials",
      color: "#10b981",
    },
    {
      icon: FaUserCheck,
      title: "Verified Buyers",
      description:
        "Connect only with verified and trusted buyers for secure transactions",
      color: "#3b82f6",
    },
    {
      icon: FaTruck,
      title: "Fast Pickup",
      description: "Streamlined logistics with pickup options from your doorstep",
      color: "#f59e0b",
    },
    {
      icon: FaClock,
      title: "Quick Listings",
      description:
        "List your materials in under 2 minutes with our smart listing form",
      color: "#8b5cf6",
    },
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
            The Best Platform for{" "}
            <span className="gradient-text">Waste Sellers</span>
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
                style={{ "--benefit-color": benefit.color }}
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
      description:
        "Use our desktop app to scan and categorize your waste with AI, or manually create a listing on the web",
      icon: FaPlusCircle,
      color: "#3b82f6",
    },
    {
      number: "02",
      title: "Get Buyer Requests",
      description:
        "Verified buyers browse and send purchase requests with their offers",
      icon: FaShoppingCart,
      color: "#10b981",
    },
    {
      number: "03",
      title: "Complete Transaction",
      description:
        "Accept the best offer, schedule pickup, and receive payment securely",
      icon: FaDollarSign,
      color: "#8b5cf6",
    },
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
                style={{ "--step-color": step.color }}
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

// --- MODAL COMPONENT (UNCHANGED, BUT NOW WORKS) ---
const EditListingModal = ({
  isOpen,
  onClose,
  listing,
  onSave,
  statesWithCities = {}, // Default value is important
}) => {
  // Add category to formData and initialize from listing
  const [formData, setFormData] = useState({
    category: listing?.category || "",
    price: listing?.price_per_kg !== undefined && listing?.price_per_kg !== null ? listing.price_per_kg : "",
    state: listing?.state || "",
    city: listing?.city || "",
    description: listing?.description || "",
  });

  // Ensure formData updates if a different listing is selected
  useEffect(() => {
    setFormData({
      category: listing?.category || "",
      price: listing?.price !== undefined && listing?.price !== null ? listing.price : "",
      state: listing?.state || "",
      city: listing?.city || "",
      description: listing?.description || "",
    });
  }, [listing]);

  // Update cities when the state changes
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData((prev) => ({
      ...prev,
      state: selectedState,
      city: statesWithCities[selectedState]?.[0] || "",
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedListing = {
        ...listing,
        category: formData.category,
        price: formData.price,
        state: formData.state,
        city: formData.city,
        description: formData.description,
      };

      // Call the backend API to update the listing
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/listings/${listing.id}`,
        updatedListing,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Listing updated successfully!");
        onSave(updatedListing); // Update the parent state
        onClose(); // Close the modal
      } else {
        alert("Failed to update the listing. Please try again.");
      }
    } catch (err) {
      console.error("Error updating listing:", err);
      alert("An error occurred while updating the listing. Please try again.");
    }
  };

  if (!isOpen) return null;

  // Category options (customize as needed)
  const categoryOptions = [
    { value: "PET", label: "PET - Polyethylene Terephthalate" },
    { value: "HDPE", label: "HDPE - High-Density Polyethylene" },
    { value: "LDPE", label: "LDPE - Low-Density Polyethylene" },
    { value: "PVC", label: "PVC - Polyvinyl Chloride" },
    { value: "PE", label: "PE - Polyethylene" },
    { value: "metal", label: "Metal" },
    { value: "paper", label: "Paper" },
    { value: "glass", label: "Glass" },
    { value: "organic", label: "Organic" },
    { value: "electronic", label: "E-Waste" },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
        <h3 className="modal-title">Edit Listing</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              disabled
            >
              <option value="" disabled>
                Select Category
              </option>
              {categoryOptions.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Price (₹/kg)</label>
            <input
              type="number"
              name="price"
              value={formData.price_per_kg}
              onChange={handleInputChange}
              required
              placeholder="Enter price per kg"
            />
          </div>
          <div className="form-group">
            <label>State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleStateChange}
              required
            >
              <option value="" disabled>
                Select State
              </option>
              {Object.keys(statesWithCities).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>City</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select City
              </option>
              {statesWithCities[formData.state]?.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Enter a description for the listing"
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};