import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import axios from "axios";

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
    <div className="min-vh-100 auth-background">
      <div className="container-fluid p-0">
        {/* Header with Logo */}
        <div className="row g-0 m-0">
          <div className="col-12">
            <div className="glass-card border-0 rounded-0 shadow-sm">
              <div className="card-body py-3 px-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <Link to="/">
                      <img
                        src={Logo}
                        alt="EcoWorth Logo"
                        height={80}
                        className="me-3"
                      />
                    </Link>
                    <div>
                      <h4 className="fw-bold  mb-0">Your Listings</h4>
                      <p className=" mb-0">
                        Manage your recyclable material listings
                      </p>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    {/* <button 
                      onClick={() => navigate("/seller-dashboard")}
                      className="btn rounded-3"
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                    </button> */}
                    <button
                      onClick={() => {
                        localStorage.removeItem("isAuthenticated");
                        localStorage.removeItem("authToken");
                        localStorage.removeItem("user");
                        navigate("/login");
                      }}
                      className="btn btn-danger rounded-3"
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Display */}
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-12">
              <div className="card glass-card border-0 shadow-lg rounded-4">
                <div className="card-header bg-transparent border-0 py-4">
                  <h4 className="card-title fw-bold text-dark mb-0">
                    Your Listings (
                    {listings.filter((l) => l.category === category).length})
                  </h4>
                </div>
                <div className="card-body p-4">
                  {listings.filter((l) => l.category === category).length ===
                  0 ? (
                    <div className="text-center py-5">
                      <i className="bi bi-inbox display-1 text-muted"></i>
                      <p className="text-muted mt-3 fs-5">
                        No {category} listings yet.
                      </p>
                      <button
                        onClick={() => navigate("/seller-dashboard")}
                        className="btn btn-success btn-lg rounded-3"
                      >
                        <i className="bi bi-plus-circle me-2"></i>Go Back to
                        Create Listing
                      </button>
                    </div>
                  ) : (
                    <div className="row gap-4">
                      {listings.map((listing) => (
                        <div key={listing.id} className="col-lg-4 col-md-4 border ">
                          <div className="card border-0 shadow-sm rounded-3 h-100">
                            <div className="card-body p-4">
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <h5 className="fw-bold text-primary mb-0">
                                  {listing.category}
                                </h5>
                                <span className="badge bg-success fs-6">
                                  {listing.status}
                                </span>
                              </div>
                              <div className="mb-3">
                                <div className="d-flex justify-content-between mb-2">
                                  <span className="text-muted">Quantity:</span>
                                  <strong>{listing.quantity} kg</strong>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                  <span className="text-muted">Price:</span>
                                  <strong className="text-success">
                                    {listing.price}
                                  </strong>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                  <span className="text-muted">
                                    Total Value:
                                  </span>
                                  <strong className="text-primary">
                                    ₹{" "}
                                    {(
                                      parseFloat(listing.quantity) *
                                      parseFloat(
                                        listing.price.replace(/\D/g, "")
                                      )
                                    ).toFixed(2)}
                                  </strong>{" "}
                                </div>
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
                                <div className="mb-3">
                                  Description:
                                  <small className="text-muted">
                                    {listing.description}
                                  </small>
                                </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
