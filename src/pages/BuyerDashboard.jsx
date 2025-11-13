import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaSearch, FaHeart, FaShoppingCart, FaFilter, FaEnvelope,
  FaClock, FaCheckCircle, FaBox,FaPhoneAlt
} from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ListingCard from '../components/ListingCard';
import { authUtils } from '../utils/auth';
import axios from 'axios';
import '../assets/scss/BuyerDashboard.scss';

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('saved'); // default to Saved Listings
  const [listings, setListings] = useState([]);
  const [savedListings, setSavedListings] = useState([]); // Array of IDs of saved listings
  const [savedListingsData, setSavedListingsData] = useState([]); // Array of full saved listing objects
  const [contactHistory, setContactHistory] = useState([]); // Array of full contacted listing objects
  const [contactedListingsIds, setContactedListingsIds] = useState([]); // Array of IDs of contacted listings
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['all', 'plastic', 'metal', 'paper', 'glass', 'organic', 'electronic'];
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-100', label: '₹0 - ₹100' },
    { value: '100-500', label: '₹100 - ₹500' },
    { value: '500-1000', label: '₹500 - ₹1000' },
    { value: '1000+', label: '₹1000+' }
  ];

  // --- FETCH CONTACTED LISTINGS (MODIFIED) ---
  const fetchContactedListings = async () => {
    if (!authUtils.isAuthenticated()) return;
    try {
      const token = authUtils.getToken();
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/contacted-listings`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const contactedData = Array.isArray(res.data) ? res.data : [];
      const ids = contactedData.map(item => item._id || item.id);
      
      // 1. Set the full listing data for the 'contacts' tab
      setContactHistory(contactedData); 
      // 2. Set the IDs array for passing to ListingCard
      setContactedListingsIds(ids); 
    } catch (err) {
      console.error("Error fetching contacted listings:", err);
      setContactHistory([]);
      setContactedListingsIds([]);
    }
  };


  useEffect(() => {
    if (!authUtils.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const currentUser = authUtils.getCurrentUser();
    setUser(currentUser);

    if (currentUser.role?.toLowerCase() !== 'buyer') {
      alert('Access Denied: Buyer privileges required');
      navigate('/home');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      // NOTE: Fetching all listings is not strictly needed for the Dashboard view, 
      // but keeping it for completeness if you have an 'All Listings' tab.
      await fetchListings(); 
      await fetchSavedListings();
      await fetchContactedListings(); // This now fetches both IDs and history
      setIsLoading(false);
    };

    fetchData();
  }, [navigate]);

  // --- Fetch all listings (Unchanged) ---
  const fetchListings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/listings`);
      const data = Array.isArray(response.data) ? response.data : response.data?.listings || [];
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setListings([]);
    }
  };

  // --- Fetch saved listings (Unchanged) ---
  const fetchSavedListings = async () => {
    try {
      const token = authUtils.getToken();
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/saved-listings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const savedData = Array.isArray(response.data) ? response.data : [];
      setSavedListings(savedData.map(listing => listing.id || listing._id));
      setSavedListingsData(savedData);
    } catch (error) {
      console.error('Error fetching saved listings:', error);
      setSavedListings([]);
      setSavedListingsData([]);
    }
  };

  // --- Save / Unsave a listing (Unchanged logic, just ensure onSavedChange prop matches) ---
  const handleSaveListing = async (listingId, isSaved) => {
    const token = authUtils.getToken();

    try {
      if (isSaved) { // If it was saved, now unsave it
        await axios.delete(`${import.meta.env.VITE_BASE_URL}/users/saved-listings/${listingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else { // If it was unsaved, now save it
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/save-listing/${listingId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      // Re-sync states after operation
      await fetchSavedListings();
    } catch (error) {
      console.error('Error updating saved listing:', error);
      alert('Failed to update saved listings. Please try again.');
    }
  };

  // --- Contact seller (Now updates contactedListingsIds) ---
  // This handler is called from the ListingCard after a successful API call there.
  const handleContactListingUpdate = (listingId) => {
    // 1. Update the list of contacted IDs
    setContactedListingsIds(prev => {
      if (!prev.includes(listingId)) {
        return [...prev, listingId];
      }
      return prev;
    });
    // 2. Re-fetch history to get the full updated listing object for the 'contacts' tab
    fetchContactedListings(); 
  };

  // --- Filter listings (Unchanged) ---
  const getFilteredListings = () => {
    let filtered = [...listings];
    // ... (filtering logic omitted for brevity) ...
    return filtered;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading buyer dashboard...</p>
      </div>
    );
  }

// useEffect(()=>{},[savedListingsData])

  return (
    <div className="buyer-dashboard">
      <Navbar />
      <div className="buyer-container">
        {/* ... Header and Tabs (unchanged) ... */}
        <div className="buyer-header">
          <div className="header-content">
            <FaShoppingCart className="header-icon" />
            <div className="header-text">
              <h1>Buyer Dashboard</h1>
              <p>Browse marketplace and manage your saved listings</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <h3>{listings.length}</h3>
              <p>Available Listings</p>
            </div>
            <div className="stat-item">
              <h3>{savedListingsData.length}</h3>
              <p>Saved Items</p>
            </div>
            <div className="stat-item">
              <h3>{contactHistory.length}</h3>
              <p>Contacts</p>
            </div>
          </div>
        </div>
        <div className="buyer-tabs">
          <button className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>
            <FaHeart /> Saved Listings ({savedListingsData.length})
          </button>
          <button className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`} onClick={() => setActiveTab('contacts')}>
            <FaEnvelope /> Contact History ({contactHistory.length})
          </button>
        </div>

        {/* Content */}
        <div className="buyer-content">
          {/* Saved Listings (PASSING CONTACTED IDS ARRAY HERE) */}
          {activeTab === 'saved' && (
            <div className="saved-section">
              <h2>Saved Listings</h2>
              {savedListingsData.length === 0 ? (
                <div className="empty-state">
                  <FaHeart className="empty-icon" />
                  <h3>No Saved Listings</h3>
                  <p>Save listings to view them here later</p>
                </div>
              ) : (
                <div className="listings-grid">
                  {savedListingsData.map(listing => (
                    <ListingCard
                      key={listing.id || listing._id}
                      listing={listing}
                      savedListingsIds={savedListings}
                      onSavedChange={handleSaveListing} // Renamed prop for consistency
                      onContact={handleContactListingUpdate} // Handler to update IDs
                      contactedListingsIds={contactedListingsIds} // <-- PASSING THE IDS HERE
                      showSaveButton={true} // Re-enable if you want unsaving capability
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Contacted Listings (Uses full listing objects from contactHistory) */}
          {activeTab === 'contacts' && (
            <div className="contacts-section">
              <h2>Contact History</h2>
              {contactHistory.length === 0 ? (
                <div className="empty-state">
                  <FaEnvelope className="empty-icon" />
                  <h3>No Contact History</h3>
                  <p>Start contacting sellers to build your history</p>
                </div>
              ) : (
                <div className="contacts-list">
                    {/* We display the actual contact objects here, not ListingCards, but you can change this if needed */}
                  {contactHistory.map(listing => (
                      <div key={listing.id || listing._id} className="contact-card">
                        <div className="contact-header">
                          <div className="contact-info">
                            <p className="listing-title">**{listing.title || listing.category}**</p>
                            <p>Category: {listing.category}</p>
                            <p>Price per kg: ₹{listing.price_per_kg || listing.price || '-'}</p>
                            <p>Description: {listing.description}</p>
                            <p><FaEnvelope /> Email: {listing.seller_email}</p>
                            <p><FaPhoneAlt /> Phone: {listing.contactNo}</p>
                            <p><FaBox /> Quantity: {listing.quantity} {listing.unit || 'Kg'}</p>
                            <p><FaCheckCircle className="date-icon" /> Details Seen: {new Date(listing.updatedAt || Date.now()).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}