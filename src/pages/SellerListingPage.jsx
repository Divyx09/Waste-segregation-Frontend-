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
  FaCheckCircle,
  FaEdit,
  FaTimes,
  FaBoxes
} from "react-icons/fa";
import "../assets/scss/SellerListing.modern.scss";
import Navbar from "../components/Navbar";
import '../assets/scss/ListingModal.scss';

const EditListingModal = ({ isOpen, onClose, listing, onSave }) => {
  const [formData, setFormData] = useState({
    price: listing?.price || "",
    state: listing?.state || "",
    city: listing?.city || "",
    description: listing?.description || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedListing = {
        ...listing,
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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
        <h3 className="modal-title">Edit Listing</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Price (₹/kg)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              placeholder="Enter price per kg"
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
              placeholder="Enter state"
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
              placeholder="Enter city"
            />
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

const statesWithCities = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  Karnataka: ["Bangalore", "Mysore", "Mangalore"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
  Rajasthan: ["Jaipur", "Udaipur", "Jodhpur"],
};

const ListingsGrid = ({ listings, isSeller }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  const handleEdit = (listing) => {
    setSelectedListing(listing);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (listingId) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/listings/${listingId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Listing deleted successfully!");
      window.location.reload(); // Reload the page to reflect changes
    } catch (err) {
      console.error("Error deleting listing:", err);
      alert("Failed to delete listing. Please try again.");
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
          <div className="listing-card-modern">
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
      <EditListingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        listing={selectedListing}
        onSave={(updatedListing) => {
          setListings((prevListings) =>
            prevListings.map((item) =>
              item.id === updatedListing.id ? updatedListing : item
            )
          );
        }}
      />
    </div>
  );
};

export default function SellerListingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { category } = location.state || {};

  const [listings, setListings] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [city, setCity] = useState("");
  const [forecastMonths, setForecastMonths] = useState(3);

  const fetchList = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/listings/my`, {
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

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);

        const chartResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/predict/price`,
          {
            params: {
              city,
              category: selectedCategory,
              months: forecastMonths,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Ensure the response data is an array
        const data = Array.isArray(chartResponse.data) ? chartResponse.data : [];
        console.log("Chart Data:", data);

        setChartData(
          data.map((item) => ({
            month: `${item.month.substring(0, 3)} ${item.year}`,
            price: item.price_per_kg,
            quantity: item.quantity_kg,
            revenue: item.revenue,
          }))
        );

        setError(null);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError(err.message || "Failed to fetch chart data");
      } finally {
        setLoading(false);
      }
    };

    if (selectedCategory) {
      fetchChartData();
    }
  }, [selectedCategory, city, forecastMonths]);

  return (
    <div className="listing-page-modern">
      <Navbar />
      {/* Modern Header */}
      {/* <header className="listing-header-modern">
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
      </header> */}

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

        {listings.length === 0 ? (
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
          <ListingsGrid listings={listings} isSeller={true} />
        )}
      </div>
    </div>
  );
}
