import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaRupeeSign, FaRecycle } from "react-icons/fa";
import '../assets/scss/ListingCard.scss';

const ListingCard = ({ listing }) => {
  return (
    <div className="listing-card-modern ">
      <div className="card-header-modern">
        <div className="category-badge">{listing.category}</div>
        <div className="price-tag">
          <FaRupeeSign /> {listing.pricePerKg}/kg
        </div>
      </div>

      <div className="card-body-modern">
        <h3 className="card-title">{listing.category}</h3>
        <p className="card-quantity">
          <FaRecycle className="icon" />
          {listing.quantity} kg available
        </p>

        <div className="card-location">
          <FaMapMarkerAlt className="icon" />
          <span>
            {listing.city}, {listing.state}
          </span>
        </div>

        <p className="card-description">{listing.description}</p>
      </div>

      <div className="card-footer-modern">
        <div className="seller-info">
          <p className="seller-contact">
            <FaPhoneAlt className="icon" /> {listing.contactNo}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;