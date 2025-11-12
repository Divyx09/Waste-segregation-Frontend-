import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaHeart, FaRegHeart, FaShoppingCart, FaFilter, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBox, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { authUtils } from '../utils/auth';
import axios from 'axios';
import '../assets/scss/BuyerDashboard.scss';

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('browse');
  const [listings, setListings] = useState([]);
  const [savedListings, setSavedListings] = useState([]);
  const [contactHistory, setContactHistory] = useState([]);
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

  useEffect(() => {
    // Check if user is logged in and is buyer
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

    fetchBuyerData();
  }, [navigate]);

  const fetchBuyerData = async () => {
    try {
      // Fetch marketplace listings
      await fetchListings();
      
      // Fetch saved listings
      fetchSavedListings();
      
      // Fetch contact history
      fetchContactHistory();
    } catch (error) {
      console.error('Error fetching buyer data:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const fetchSavedListings = () => {
    // TODO: Replace with actual API call
    // GET /buyer/saved-listings
    const saved = JSON.parse(localStorage.getItem('savedListings') || '[]');
    setSavedListings(saved);
  };

  const fetchContactHistory = () => {
    // TODO: Replace with actual API call
    const demoHistory = [
      {
        id: 1,
        sellerName: 'John Doe',
        listingTitle: 'Plastic Bottles - 50kg',
        date: '2025-11-10',
        status: 'responded',
        message: 'Interested in purchasing'
      },
      {
        id: 2,
        sellerName: 'Jane Smith',
        listingTitle: 'Metal Scrap - 100kg',
        date: '2025-11-08',
        status: 'pending',
        message: 'What is your best price?'
      }
    ];
    setContactHistory(demoHistory);
  };

  const handleSaveListing = (listingId) => {
    const saved = JSON.parse(localStorage.getItem('savedListings') || '[]');
    
    if (saved.includes(listingId)) {
      // Remove from saved
      const updated = saved.filter(id => id !== listingId);
      localStorage.setItem('savedListings', JSON.stringify(updated));
      setSavedListings(updated);
    } else {
      // Add to saved
      const updated = [...saved, listingId];
      localStorage.setItem('savedListings', JSON.stringify(updated));
      setSavedListings(updated);
    }
  };

  const handleContactSeller = async (listing) => {
    // TODO: Replace with actual contact modal/API
    const message = prompt(`Contact ${listing.seller_name || 'Seller'} about "${listing.title}":\n\nEnter your message:`);
    
    if (message) {
      try {
        // await axios.post(`${import.meta.env.VITE_BASE_URL}/buyer/contact`, {
        //   listing_id: listing.id,
        //   message
        // }, {
        //   headers: { Authorization: `Bearer ${authUtils.getToken()}` }
        // });
        
        alert('Message sent successfully! Seller will contact you soon.');
        
        // Add to contact history
        const newContact = {
          id: Date.now(),
          sellerName: listing.seller_name || 'Seller',
          listingTitle: listing.title,
          date: new Date().toISOString().split('T')[0],
          status: 'pending',
          message
        };
        setContactHistory(prev => [newContact, ...prev]);
      } catch (error) {
        console.error('Error contacting seller:', error);
        alert('Failed to send message. Please try again.');
      }
    }
  };

  const getFilteredListings = () => {
    let filtered = [...listings];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(listing =>
        listing.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(listing =>
        listing.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Price filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(listing => {
        const price = listing.price || 0;
        if (priceRange === '0-100') return price <= 100;
        if (priceRange === '100-500') return price > 100 && price <= 500;
        if (priceRange === '500-1000') return price > 500 && price <= 1000;
        if (priceRange === '1000+') return price > 1000;
        return true;
      });
    }

    return filtered;
  };

  const getSavedListingsData = () => {
    return listings.filter(listing => savedListings.includes(listing.id));
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading buyer dashboard...</p>
      </div>
    );
  }

  const filteredListings = getFilteredListings();
  const savedListingsData = getSavedListingsData();

  return (
    <div className="buyer-dashboard">
      <Navbar />
      
      <div className="buyer-container">
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
              <h3>{savedListings.length}</h3>
              <p>Saved Items</p>
            </div>
            <div className="stat-item">
              <h3>{contactHistory.length}</h3>
              <p>Contacts</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="buyer-tabs">
          <button
            className={`tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            <FaSearch /> Browse Marketplace
          </button>
          <button
            className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <FaHeart /> Saved Listings ({savedListings.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            <FaEnvelope /> Contact History ({contactHistory.length})
          </button>
        </div>

        {/* Content */}
        <div className="buyer-content">
          {activeTab === 'browse' && (
            <div className="browse-section">
              {/* Filters */}
              <div className="filters-bar">
                <div className="search-box">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search listings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <FaFilter className="filter-icon" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="filter-select"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>

                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="filter-select"
                  >
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Listings Grid */}
              {filteredListings.length === 0 ? (
                <div className="empty-state">
                  <FaBox className="empty-icon" />
                  <h3>No Listings Found</h3>
                  <p>Try adjusting your filters or check back later</p>
                </div>
              ) : (
                <div className="listings-grid">
                  {filteredListings.map(listing => (
                    <div key={listing.id} className="listing-card">
                      <button
                        className="save-btn"
                        onClick={() => handleSaveListing(listing.id)}
                      >
                        {savedListings.includes(listing.id) ? (
                          <FaHeart className="saved" />
                        ) : (
                          <FaRegHeart />
                        )}
                      </button>
                      
                      <div className="listing-image">
                        {listing.image_url ? (
                          <img src={listing.image_url} alt={listing.title} />
                        ) : (
                          <div className="placeholder-image">
                            <FaBox />
                          </div>
                        )}
                      </div>

                      <div className="listing-info">
                        <span className="listing-category">{listing.category || 'Other'}</span>
                        <h3>{listing.title}</h3>
                        <p className="listing-description">{listing.description}</p>
                        
                        <div className="listing-details">
                          <div className="detail-item">
                            <FaBox className="detail-icon" />
                            <span>{listing.quantity || 0} {listing.unit || 'kg'}</span>
                          </div>
                          {listing.location && (
                            <div className="detail-item">
                              <FaMapMarkerAlt className="detail-icon" />
                              <span>{listing.location}</span>
                            </div>
                          )}
                        </div>

                        <div className="listing-footer">
                          <div className="price">₹{listing.price || 0}</div>
                          <button
                            className="contact-btn"
                            onClick={() => handleContactSeller(listing)}
                          >
                            <FaEnvelope /> Contact Seller
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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
                    <div key={listing.id} className="listing-card">
                      <button
                        className="save-btn"
                        onClick={() => handleSaveListing(listing.id)}
                      >
                        <FaHeart className="saved" />
                      </button>
                      
                      <div className="listing-image">
                        {listing.image_url ? (
                          <img src={listing.image_url} alt={listing.title} />
                        ) : (
                          <div className="placeholder-image">
                            <FaBox />
                          </div>
                        )}
                      </div>

                      <div className="listing-info">
                        <span className="listing-category">{listing.category || 'Other'}</span>
                        <h3>{listing.title}</h3>
                        <p className="listing-description">{listing.description}</p>
                        
                        <div className="listing-details">
                          <div className="detail-item">
                            <FaBox className="detail-icon" />
                            <span>{listing.quantity || 0} {listing.unit || 'kg'}</span>
                          </div>
                          {listing.location && (
                            <div className="detail-item">
                              <FaMapMarkerAlt className="detail-icon" />
                              <span>{listing.location}</span>
                            </div>
                          )}
                        </div>

                        <div className="listing-footer">
                          <div className="price">₹{listing.price || 0}</div>
                          <button
                            className="contact-btn"
                            onClick={() => handleContactSeller(listing)}
                          >
                            <FaEnvelope /> Contact Seller
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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
                  {contactHistory.map(contact => (
                    <div key={contact.id} className="contact-card">
                      <div className="contact-header">
                        <div className="contact-info">
                          <h3>{contact.sellerName}</h3>
                          <p className="listing-title">{contact.listingTitle}</p>
                        </div>
                        <span className={`status-badge ${contact.status}`}>
                          {contact.status === 'responded' ? (
                            <>
                              <FaCheckCircle /> Responded
                            </>
                          ) : (
                            <>
                              <FaClock /> Pending
                            </>
                          )}
                        </span>
                      </div>
                      <div className="contact-body">
                        <p className="contact-message">{contact.message}</p>
                        <div className="contact-date">
                          <FaClock className="date-icon" />
                          {contact.date}
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
