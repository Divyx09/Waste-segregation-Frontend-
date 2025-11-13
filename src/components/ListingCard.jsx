import React, { useEffect, useState } from 'react';
import {
  FaMapMarkerAlt,
  FaWeightHanging,
  FaCheckCircle,
  FaBookmark,
  FaRegBookmark,
  FaPhoneAlt,
  FaEnvelope,
  FaTimes,
  FaSpinner
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authUtils } from '../utils/auth';
import '../assets/scss/ListingCard.scss';

// --- Helper Functions ---
const getCategoryTheme = (category) => {
  switch (category?.toUpperCase()) {
    case 'PET': return { color: '#10b981', rgb: '16, 185, 129' };
    case 'HDPE': return { color: '#3b82f6', rgb: '59, 130, 246' };
    case 'LDPE': return { color: '#f59e0b', rgb: '245, 158, 11' };
    case 'PVC': return { color: '#ef4444', rgb: '239, 68, 68' };
    case 'PE': return { color: '#8b5cf6', rgb: '139, 92, 246' };
    default: return { color: '#64748b', rgb: '100, 116, 139' };
  }
};

const truncateText = (text, length) => {
  if (!text) return 'No description provided.';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// --- Seller Modal Component ---
const SellerModal = ({ listing, isContacted, onClose, markAsContacted }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMarkContacted = async () => {
    setIsSubmitting(true);
    try {
      await markAsContacted();
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactButtonText = isContacted
    ? <><FaCheckCircle /> Contacted</>
    : isSubmitting
      ? <><FaSpinner className="spinner" /> Recording...</>
      : <><FaEnvelope /> Mark as Contacted</>;

  return (
    <div className="seller-modal-overlay">
      <div className="seller-modal-content">
        <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
        <h3>Seller Details</h3>

        {isContacted ? (
          <div className="contacted-info-block">
            <p className="status-message"><FaCheckCircle /> You have successfully contacted this seller.</p>
            <p><strong>Name:</strong> {listing.sellerName || 'Verified Seller'}</p>
            <p><strong>Email:</strong> {listing.seller_email || 'Available upon request'}</p>
            <p><strong>Contact:</strong> {listing.contactNo || listing.contact || '***-***-****'}</p>
          </div>
        ) : (
          <div className="pre-contact-info-block">
            <p className="status-message"><FaPhoneAlt /> Seller details will be fully revealed after marking as contacted.</p>
            <p><strong>Location:</strong> {listing.city}, {listing.state}</p>
            <p><strong>Contact Type:</strong> Phone/Email</p>
          </div>
        )}

        <div className="modal-actions">
          <button
            className={`contact-btn ${isContacted ? 'contacted' : ''}`}
            onClick={handleMarkContacted}
            disabled={isContacted || isSubmitting}
          >
            {contactButtonText}
          </button>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// --- Main ListingCard Component ---
const ListingCard = ({ listing, savedListingsIds = [], contactedListingsIds = [], onSavedChange, onContact }) => {
  const navigate = useNavigate();
  const theme = getCategoryTheme(listing.category);
  const listingId = listing._id || listing.id;

  const cardStyle = {
    '--category-color': theme.color,
    '--category-color-rgb': theme.rgb,
  };

  const price = listing.price_per_kg || listing.price || 'N/A';

  // --- States ---
  const [isSaved, setIsSaved] = useState(savedListingsIds?.includes(listingId));
  const [loadingSave, setLoadingSave] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const isContacted = contactedListingsIds.includes(listingId);

  // --- Save / Unsave Listing ---
  const handleSaveListing = async () => {
    if (!authUtils.isAuthenticated()) {
      alert("Please login to save listings.");
      navigate('/login');
      return;
    }

    setLoadingSave(true);
    const token = localStorage.getItem('token');

    try {
      if (isSaved) {
        // UNSAVE
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/users/saved-listings/${listingId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsSaved(false);
        // if (onSavedChange) onSavedChange(listingId, false);
        alert("Listing removed from saved listings.");
      } else {
        // SAVE
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/users/save-listing/${listingId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsSaved(true);
        if (onSavedChange) onSavedChange(listingId, true);
        alert("Listing saved successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating saved listing.");
    } finally {
      setLoadingSave(false);
    }
  };

  // --- Contact Seller ---
  const handleContactSeller = () => {
    if (!authUtils.isAuthenticated()) {
      alert("Please login to see seller details.");
      navigate('/login');
      return;
    }
    setShowSellerModal(true);
  };

  const markAsContacted = async () => {
    if (!authUtils.isAuthenticated()) {
      alert("Please login to mark a listing as contacted.");
      navigate('/login');
      return;
    }

    if (isContacted) return; // Already contacted

    try {
      const token = localStorage.getItem('token');
      const url = `${import.meta.env.VITE_BASE_URL}/users/contacted-listing/${listingId}`;

      await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });

      if (onContact) onContact(listingId); 
      alert("Listing marked as contacted successfully! Details are now visible.");
    } catch (err) {
      console.error("Error marking listing as contacted:", err);
      alert("Failed to mark listing as contacted.");
    }
  };


  useEffect(()=>{

  },[isSaved])
  return (
    <>
      <div className="listing-card-modern" style={cardStyle}>
        <div className="card-content">
          {/* Header */}
          <div className="card-header">
            <h5 className="card-title">
              {listing.title || `${listing.quantity}kg of ${listing.category}`}
            </h5>
            <div className="card-header-right">
              <span className="card-category-tag">{listing.category || 'General'}</span>
              <button
                className={`save-btn ${isSaved ? 'saved' : ''}`}
                onClick={handleSaveListing}
                disabled={loadingSave}
                title={isSaved ? 'Saved' : 'Save Listing'}
              >
                {isSaved ? <FaBookmark color="#2563eb" /> : <FaRegBookmark color="#6b7280" />}
              </button>
            </div>
          </div>

          {/* Price & Description */}
          <div className="card-price">₹{price} /kg</div>
          <p className="card-description">{truncateText(listing.description, 80)}</p>

          {/* Details Grid */}
          <div className="card-details-grid">
            <div className="detail-item">
              <FaWeightHanging className="detail-icon" />
              <span className="detail-value">{listing.quantity} kg</span>
            </div>
            <div className="detail-item">
              <FaMapMarkerAlt className="detail-icon" />
              <span className="detail-value">{listing.city}, {listing.state}</span>
            </div>
          </div>

          {/* Seller Info */}
          <div className="card-seller-info">
            <button
              className={`see-seller-btn ${isContacted ? 'contacted' : ''}`}
              onClick={handleContactSeller}
            >
              {isContacted ? <><FaCheckCircle /> Contacted</> : <><FaPhoneAlt /> See Seller Details</>}
            </button>
          </div>
        </div>
      </div>

      {/* Seller Modal */}
      {showSellerModal && (
        <SellerModal
          listing={listing}
          isContacted={isContacted}
          onClose={() => setShowSellerModal(false)}
          markAsContacted={markAsContacted}
        />
      )}
    </>
  );
};

export default ListingCard;
