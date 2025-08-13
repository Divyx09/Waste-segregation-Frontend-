import React, { useState, useEffect } from "react";
import "../assets/scss/style.scss";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";
import axios from 'axios'

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
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/listings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    console.log(res.data);
    setListings(res.data);
  } catch (err) {
    console.error(err);
  } finally {
    setIsLoading(false); // ✅ Stop loading after fetching
  }
};

  useEffect(() => {


    fetchList()
  }, []);

  const filteredListings =
    activeCategory === "all"
      ? listings
      : listings.filter((item) => item.category === activeCategory);

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

      <div className="container">
        <CategoryFilter
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>AI is analyzing waste streams...</p>
          </div>
        ) : (
          <>
            <StatsBar listings={filteredListings} />
            <ListingsGrid listings={filteredListings} />
          </>
        )}
      </div>

      <HowItWorks />
      <Footer />

      {/* Create Listing Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Listing</h3>
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            <form className="modal-body" onSubmit={handleCreateListing}>
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="PET">PET</option>
                  <option value="HDPE">HDPE</option>
                  <option value="LDPE">LDPE</option>
                  <option value="PVC">PVC</option>
                  <option value="PE">PE</option>
                </select>
              </div>
              <div className="form-group">
                <label>Quantity (kg)</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price per kg (₹)</label>
                <input
                  type="number"
                  name="pricePerKg"
                  value={formData.pricePerKg}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Create Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const HeroSection = ({ openModal }) => (
  <section className="hero">
    <div className="container">
      <div className="hero-content">
        <h2>Transform Waste into Value</h2>
        <p className="subtitle">
          Our AI-powered marketplace connects sustainable businesses with
          quality recycled plastics
        </p>
        <div className="hero-buttons">
          <button
            className="btn-primary px-3 p-2 border border-0 rounded-5"
            onClick={openModal}
          >
            List Your Materials
          </button>
          <button className="btn-secondary px-3 p-2 border border-0 rounded-5">
            Find Recycled Plastics
          </button>
        </div>
        <div className="trust-badges">
          <span className="mx-2">✓ Verified Suppliers</span>
          <span className="mx-2">✓ Quality Guaranteed</span>
          <span className="mx-2">✓ Sustainable Partners</span>
        </div>
      </div>
    </div>
  </section>
);

const CategoryFilter = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    { id: "all", name: "All Plastics" },
    { id: "PET", name: "PET" },
    { id: "HDPE", name: "HDPE" },
    { id: "LDPE", name: "LDPE" },
    { id: "PVC", name: "PVC" },
    { id: "PE", name: "PE" },
  ];

  return (
    <div className="category-filter">
      <h3 className="filter-title">Filter by Material Type:</h3>
      <div className="filter-buttons">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-btn ${activeCategory === cat.id ? "active" : ""
              }`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};

const StatsBar = ({ listings }) => (
  <div className="stats-bar">
    <div className="stat-item">
      <div className="stat-value">{listings.length}</div>
      <div className="stat-label">Active Listings</div>
    </div>
    <div className="stat-item">
      <div className="stat-value">24h</div>
      <div className="stat-label">Avg. Response</div>
    </div>
    <div className="stat-item">
      <div className="stat-value">98%</div>
      <div className="stat-label">Verified</div>
    </div>
    <div className="stat-item highlight">
      <div className="stat-value">AI</div>
      <div className="stat-label">Optimized Pricing</div>
    </div>
  </div>
);

const ListingsGrid = ({ listings }) => (
  <div className="listings-grid my-5 w-100">
    <div className="row g-4 w-100">
      {listings.map(listing => (<div key={listing.id} className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="fw-bold text-primary mb-0">{listing.category}</h5>
                <span className="badge bg-success fs-6">{listing.status}</span>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Quantity:</span>
                  <strong>{listing.quantity} kg</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Price:</span>
                  <strong className="text-success">{listing.price}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Total Value:</span>
                  <strong className="text-primary">
                    ₹ {(parseFloat(listing.quantity) * parseFloat(listing.price.replace(/\D/g, ""))).toFixed(2)}
                  </strong>                                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">State:</span>
                  <span>{listing.state}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">City:</span>
                  <span>{listing.city}</span>
                </div>

                <div className="d-flex justify-content-between">
                  <span className="text-muted">Contact:</span>
                  <span>{listing.contactNo}</span>
                </div>
              </div>
              {listing.description && (
                <div className="mb-3">Description:
                  <small className="text-muted">{listing.description}</small>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>

  </div>
);

const HowItWorks = () => (
  <section className="how-it-works">
    <div className="container">
      <h2 className="section-title">Our Circular Economy Process</h2>
      <p className="section-subtitle">
        How we're revolutionizing plastic recycling with technology
      </p>
      <div className="steps">
        <div className="step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Material Analysis</h3>
            <p>
              Our AI classifies your plastic waste and determines optimal
              pricing based on current market trends
            </p>
          </div>
        </div>
        <div className="step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Smart Matching</h3>
            <p>
              Advanced algorithms connect you with verified buyers who need
              your specific materials
            </p>
          </div>
        </div>
        <div className="step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Efficient Transactions</h3>
            <p>
              Secure payments and logistics coordination for seamless material
              exchange
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HomePage;
