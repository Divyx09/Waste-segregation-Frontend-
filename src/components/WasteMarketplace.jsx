import React, { useState, useEffect } from "react";

export default function WasteMarketplace({ userType = "buyer" }) {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [filters, setFilters] = useState({
    category: "all",
    location: "",
    maxPrice: "",
    minQuantity: ""
  });

  useEffect(() => {
    const savedListings = localStorage.getItem("wasteListings");
    if (savedListings) {
      const allListings = JSON.parse(savedListings);
      setListings(allListings);
      setFilteredListings(allListings);
    }
  }, []);

  useEffect(() => {
    let filtered = listings.filter(listing => listing.status === "available");
    
    if (filters.category !== "all") {
      filtered = filtered.filter(listing => listing.category === filters.category);
    }
    if (filters.location) {
      filtered = filtered.filter(listing => 
        listing.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(listing => 
        parseFloat(listing.pricePerKg) <= parseFloat(filters.maxPrice)
      );
    }
    if (filters.minQuantity) {
      filtered = filtered.filter(listing => 
        parseInt(listing.quantity) >= parseInt(filters.minQuantity)
      );
    }
    
    setFilteredListings(filtered);
  }, [listings, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleContact = (listing) => {
    alert(`Contact seller at: ${listing.contactNumber}`);
  };

  const categories = ["all", "PET", "HDPE", "PVC", "LDPE", "PP"];

  return (
    <div className="card glass-card border-0 shadow-lg rounded-4">
      <div className="card-header bg-transparent border-0 py-4">
        <h4 className="card-title fw-bold text-dark mb-0">
          <i className="bi bi-shop me-2 text-success"></i>
          Waste Marketplace
        </h4>
      </div>
      <div className="card-body p-4">
        {/* Filters */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="form-select rounded-3"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="form-control rounded-3"
              placeholder="Filter by location"
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="form-control rounded-3"
              placeholder="Max price per kg"
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              name="minQuantity"
              value={filters.minQuantity}
              onChange={handleFilterChange}
              className="form-control rounded-3"
              placeholder="Min quantity (kg)"
            />
          </div>
        </div>

        {/* Listings */}
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {filteredListings.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-search display-1 text-muted"></i>
              <p className="text-muted mt-3">No listings found matching your criteria</p>
            </div>
          ) : (
            <div className="row g-3">
              {filteredListings.map(listing => (
                <div key={listing.id} className="col-md-6 col-lg-4">
                  <div className="card border-0 shadow-sm rounded-3 h-100">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h6 className="fw-bold text-primary mb-0">{listing.category}</h6>
                        <span className="badge bg-success">{listing.status}</span>
                      </div>
                      
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Quantity:</span>
                          <strong>{listing.quantity} kg</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Price:</span>
                          <strong className="text-success">₹{listing.pricePerKg}/kg</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Total:</span>
                          <strong className="text-primary">₹{(listing.quantity * listing.pricePerKg).toFixed(2)}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Location:</span>
                          <span>{listing.location}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Posted:</span>
                          <span>{new Date(listing.datePosted).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {listing.description && (
                        <p className="text-muted small mb-3">{listing.description}</p>
                      )}

                      {userType === "buyer" && (
                        <button
                          onClick={() => handleContact(listing)}
                          className="btn btn-primary btn-sm w-100 rounded-3"
                        >
                          <i className="bi bi-telephone me-2"></i>
                          Contact Seller
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}