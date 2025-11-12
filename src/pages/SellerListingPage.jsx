import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaLeaf, 
  FaSignOutAlt, 
  FaBoxOpen, 
  FaRupeeSign, 
  FaMapMarkerAlt, 
  FaBuilding, 
  FaPhoneAlt, 
  FaInfoCircle,
  FaInbox,
  FaPlusCircle,
  FaTags,
  FaCheckCircle
} from "react-icons/fa";
import "../assets/scss/SellerListing.modern.scss";

export default function SellerListingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { category } = location.state || {};

  const [listings, setListings] = useState([]);

  const fetchList = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/listings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    // const result = res.data();
    console.log(res.data);
    setListings(res.data);
  };

  useEffect(() => {
    // Load existing listings from localStorage
    // const savedListings = localStorage.getItem("wasteListings");
    // if (savedListings) {
    //   setListings(JSON.parse(savedListings));
    // }

    fetchList();
  }, []);

  return (
    <div className="listing-page-modern">
      {/* Modern Header */}
      <header className="listing-header-modern">
        <div className="header-content">
          <div className="logo-section">
            <Link to="/" className="logo-link">
              <div className="logo-icon-wrapper">
                <FaLeaf className="logo-icon" />
              </div>
              <div className="logo-text">
                <h1>EcoWorth</h1>
                <span className="tagline">Marketplace</span>
              </div>
            </Link>
            <div className="header-info-section">
              <h2>Your Listings</h2>
              <p>Manage your recyclable material listings</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              localStorage.removeItem("isAuthenticated");
              localStorage.removeItem("authToken");
              localStorage.removeItem("user");
              window.dispatchEvent(new Event('authChange'));
              navigate("/login");
            }}
            className="logout-btn-listing"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </header>

      {/* Listings Section */}
      <div className="listings-container-modern">
        <div className="listings-header">
          <h3>
            <FaTags className="section-icon" />
            {category} Listings
          </h3>
          <span className="listing-count">
            {listings.filter((l) => l.category === category).length} Active
          </span>
        </div>

        {listings.filter((l) => l.category === category).length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrapper">
              <FaInbox className="empty-icon" />
            </div>
            <h4>No {category} listings yet</h4>
            <p>Start creating listings to showcase your recyclable materials</p>
            <button
              onClick={() => navigate("/seller-dashboard")}
              className="btn-create-listing"
            >
              <FaPlusCircle />
              Create New Listing
            </button>
          </div>
        ) : (
          <div className="listings-grid">
            {listings.map((listing) => (
              <div key={listing.id} className="listing-card-modern">
                <div className="card-header-listing">
                  <div className="category-badge">
                    <FaBoxOpen className="badge-icon" />
                    <span>{listing.category}</span>
                  </div>
                  <span className="status-badge">
                    <FaCheckCircle />
                    {listing.status}
                  </span>
                </div>

                <div className="card-body-listing">
                  <div className="info-row">
                    <div className="info-item">
                      <label>
                        <FaBoxOpen className="info-icon" />
                        Quantity
                      </label>
                      <div className="info-value quantity-value">
                        {listing.quantity} kg
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <label>
                        <FaRupeeSign className="info-icon" />
                        Price/kg
                      </label>
                      <div className="info-value price-value">
                        {listing.price}
                      </div>
                    </div>
                  </div>

                  <div className="total-value-section">
                    <label>Total Value</label>
                    <div className="total-amount">
                      ₹ {(
                        parseFloat(listing.quantity) *
                        parseFloat(listing.price.replace(/\D/g, ""))
                      ).toFixed(2)}
                    </div>
                  </div>

                  <div className="location-section">
                    <div className="location-item">
                      <FaMapMarkerAlt className="location-icon" />
                      <span>{listing.state}</span>
                    </div>
                    <div className="location-item">
                      <FaBuilding className="location-icon" />
                      <span>{listing.city}</span>
                    </div>
                  </div>

                  <div className="contact-section">
                    <FaPhoneAlt className="contact-icon" />
                    <span>{listing.contactNo}</span>
                  </div>

                  {listing.description && (
                    <div className="description-section">
                      <FaInfoCircle className="desc-icon" />
                      <p>{listing.description}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
