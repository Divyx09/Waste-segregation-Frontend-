import React from 'react';
import { 
  FaMapMarkerAlt, 
  FaWeightHanging, 
  FaRupeeSign, 
  FaPhoneAlt,
  FaCheckCircle,
  FaArrowRight
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../assets/scss/ListingCard.scss'; // Make sure this new SCSS file is imported

// Helper to map category IDs to their colors from your SCSS
const getCategoryTheme = (category) => {
  switch (category?.toUpperCase()) {
    case 'PET':
      return { color: '#10b981', rgb: '16, 185, 129' }; // $primary-green
    case 'HDPE':
      return { color: '#3b82f6', rgb: '59, 130, 246' }; // $primary-blue
    case 'LDPE':
      return { color: '#f59e0b', rgb: '245, 158, 11' }; // $primary-orange
    case 'PVC':
      return { color: '#ef4444', rgb: '239, 68, 68' };  // $primary-red
    case 'PE':
      return { color: '#8b5cf6', rgb: '139, 92, 246' }; // $primary-purple
    default:
      return { color: '#64748b', rgb: '100, 116, 139' }; // $gray
  }
};

// Helper to truncate text
const truncateText = (text, length) => {
  if (!text) return 'No description provided.';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();
  const theme = getCategoryTheme(listing.category);
  
  // This passes the dynamic color to the SCSS file
  const cardStyle = {
    '--category-color': theme.color,
    '--category-color-rgb': theme.rgb,
  };

  const handleCardClick = () => {
    // This can be used to navigate to a future detail page
    // navigate(`/listing/${listing.id || listing._id}`);
    console.log("Navigating to listing:", listing.id || listing._id);
  };

  // Use props from your component
  const price = listing.pricePerKg || listing.price || 'N/A';
  const contact = listing.contactNo || listing.contact || 'Hidden';

  return (
    <div className="listing-card-modern" style={cardStyle}>
      
      {/* We removed the top image placeholder. The top border is cleaner. */}

      <div className="card-content">
        
        {/* Header with Title and Category */}
        <div className="card-header">
          <h5 className="card-title">
            {listing.title || `${listing.quantity}kg of ${listing.category}`}
          </h5>
          <span className="card-category-tag">
            {listing.category || 'General'}
          </span>
        </div>

        {/* --- UPDATED: Price formatting added back --- */}
        <div className="card-price">
          {/* <FaRupeeSign /> */}
          {price}
          <span></span>
        </div>

        {/* Description (Truncated) */}
        <p className="card-description">
          {truncateText(listing.description, 80)}
        </p>

        {/* --- UPDATED: Icons are now styled --- */}
        <div className="card-details-grid">
          <div className="detail-item">
            <FaWeightHanging className="detail-icon" />
            <div>
              {/* <span className="detail-label">Quantity</span> */}
              <span className="detail-value">{listing.quantity} kg</span>
            </div>
          </div>
          <div className="detail-item">
            <FaMapMarkerAlt className="detail-icon" />
            <div>
              {/* <span className="detail-label">Location</span> */}
              <span className="detail-value">{listing.city}, {listing.state}</span>
            </div>
          </div>
        </div>

        {/* Seller Info */}
        <div className="card-seller-info">
          <span className="seller-contact">
            <FaPhoneAlt /> {contact}
          </span>
          <span className="seller-verified-badge">
            <FaCheckCircle /> Verified
          </span>
        </div>

        {/* --- UPDATED: Button is un-commented --- */}
        {/* <div className="card-footer" onClick={handleCardClick}>
          <button className="btn-view-details">
            View Details
            <FaArrowRight className="btn-icon" />
            <div className="btn-shimmer"></div>
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ListingCard;