import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { statesWithCities } from "../assets/ConstantData";
import Logo from "../assets/logo.png";
import axios from "axios";
import {
  FaFilter, FaRecycle, FaChartLine, FaBoxOpen, FaMapMarkerAlt, 
  FaBuilding, FaTags, FaCalendarAlt, FaSignOutAlt, FaPlusCircle,
  FaTimes, FaPhoneAlt, FaInfoCircle, FaSpinner, FaLeaf,
  FaDollarSign, FaTruck, FaStar, FaBox
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../assets/scss/Dashboard.scss";
import "../assets/scss/Dashboard.modern.scss";
import "../assets/scss/SellerDashboard.modern.scss";
import * as authUtils from '../utils/auth'; // Import auth utils

export default function Dashboard() {
  const navigate = useNavigate();

  // State management
  const [staticData, setStaticData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    quantity: "",
    pricePerKg: 0,
    description: "",
    state: "",
    city: "",
    contactNumber: "",
  });
  const [weights, setWeights] = useState([]); // State for weights API response
  const [userListings, setUserListings] = useState([]); // State for user's listings

  // Filters state
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [city, setCity] = useState(statesWithCities["Maharashtra"][0] || "");
  const [selectedCategory, setSelectedCategory] = useState("PET");
  const [forecastMonths, setForecastMonths] = useState(3);
  const forecastOptions = [3, 6, 9];

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch weights data
        const weightsResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/weights`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        const weightsData = weightsResponse.data;
        setStaticData(weightsData);

        // Set the first category as the default selected category
        if (weightsData.length > 0) {
          setSelectedCategory(weightsData[0].category);
        }

        // Fetch chart data for the first category
        const chartResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/predict/price`,
          {
            params: {
              city,
              category: weightsData[0]?.category || "PET", // Default to "PET" if no data
              months: forecastMonths,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        setChartData(
          chartResponse.data.map((item) => ({
            month: `${item.month.substring(0, 3)} ${item.year}`,
            price: item.price_per_kg,
            quantity: item.quantity_kg,
            revenue: item.revenue,
          }))
        );

        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [city, forecastMonths]);


  const handleListing = async (e) => {
    e.preventDefault();

    try {
      setLoading(true); // optional, show loader

      // Prepare payload
      const payload = {
        category: formData.category,
        quantity: `${formData.quantity}`, // append kg
        price_per_kg: `${formData.pricePerKg}`, // format price
        state: formData.state || selectedState,
        city: formData.city || city,
        contact_number: formData.contactNumber,
        description: formData.description,
      };

      // Make API POST request
      const response = await axios.post(  
        `${import.meta.env.VITE_BASE_URL}/listings/add`, // Your endpoint
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201  ) {
        alert("Listing created successfully!");

        // Update state if you want to reflect new listing immediately
        setStaticData((prev) => [...prev, response.data]);

        // Close modal
        setShowModal(false);

        // Navigate to seller listing page
        navigate("/sell-waste", {
          state: { category: selectedItem.category },
        });
      }
    } catch (err) {
      console.error("Error creating listing:", err);
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleListClick = (category) => {
    const itemData = staticData.find((item) => item.category === category);
    setSelectedItem({
      category,
      quantity: itemData?.weights || 0,
      pricePerKg: itemData?.pricePerKg,
      location: city || "NaN",
    });
    setFormData({
      category,
      quantity: itemData?.weights || 0,
      pricePerKg: 0,
      description: "",
      location: city || "",
      contactNumber: "",
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newListing = {
      id: Date.now(),
      ...formData,
      datePosted: new Date().toISOString(),
      seller: "Current User",
      status: "available",
    };

    // Save to localStorage
    const savedListings = localStorage.getItem("wasteListings");
    const listings = savedListings ? JSON.parse(savedListings) : [];
    const updatedListings = [...listings, newListing];
    localStorage.setItem("wasteListings", JSON.stringify(updatedListings));

    // ✅ Update state to trigger re-render on Dashboard/Homepage if needed
    setStaticData((prev) => [...prev, newListing]);

    setShowModal(false);
    navigate("/seller-listing", {
      state: { category: selectedItem.category },
    });
  };


  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    setCity(statesWithCities[newState]?.[0] || "");
  };

  // Fetch chart data whenever selectedCategory, city, or forecastMonths change
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

        setChartData(
          chartResponse.data.map((item) => ({
            month: `${item.month.substring(0, 3)} ${item.year}`,
            price: item.price_per_kg,
            quantity: item.quantity_kg,
            revenue: item.revenue,
          }))
        );

        setError(null);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCategory) {
      fetchChartData();
    }
  }, [selectedCategory, city, forecastMonths]);

  // Fetch user's listings and weights data on component mount
  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Fetch user's listings
        const listingsResponse = await axios.get("http://localhost:8000/listings/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        const userListings = listingsResponse.data || [];
        setUserListings(userListings);

        // Fetch weights data
        const weightsResponse = await axios.get("http://localhost:8000/weights", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        const weightsData = weightsResponse.data || [];
        setWeights(weightsData);

        // Compare categories and update weights data
        const updatedWeights = weightsData.map((weight) => {
          const isListed = userListings.some(
            (listing) => listing.category === weight.category
          );
          return { ...weight, isListed }; // Add `isListed` flag to weights
        });

        setWeights(updatedWeights); // Update weights with `isListed` flag
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchListings();
  }, []);

  const WeightsGrid = ({ weights }) => {
    return (
      <div className="weights-grid-modern"></div>
    );
  };

  const handleCreateListing = (category) => {
    if (!authUtils.isAuthenticated()) {
      alert("Please login to create a listing");
      navigate("/login");
      return;
    }

    const user = authUtils.getCurrentUser();
    if (user.role?.toLowerCase() === "seller") {
      navigate(`/seller-listing?category=${category}`); // Pass the category as a query parameter
    } else {
      alert("Only sellers can create listings");
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-modern seller-dashboard-wrapper" >
        {/* Stats Overview Cards */} 
        <section className="stats-overview-section">
          <div className="stats-grid-modern">

            <div className="stat-card-modern" style={{ '--card-color': '#3b82f6' }} onClick={()=>{navigate("/sell-waste")}}>
              {/* <div className="stat-icon-bg">
                <FaDollarSign />
              </div>
              <div className="stat-details">
                <h3>₹{chartData.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</h3>
                <p>Avg Price/kg</p>
              </div> */}
              <div className="stat-details" style={{fontWeight:"600",cursor:"pointer"}}  >
                <p><h4 >See Your Listings</h4></p>
              </div>
            </div>
            <div className="stat-card-modern" style={{ '--card-color': '#10b981' }}>
              <div className="stat-icon-bg">
                <FaBox />
              </div>
              <div className="stat-details">
                <h3>{staticData.length}</h3>
                <p>Material Categories</p>
              </div>
            </div>
            
            
            
            <div className="stat-card-modern" style={{ '--card-color': '#f59e0b' }}>
              <div className="stat-icon-bg">
                <FaTruck />
              </div>
              <div className="stat-details">
                <h3>{forecastMonths}</h3>
                <p>Months Forecast</p>
              </div>
            </div>
            
            <div className="stat-card-modern" style={{ '--card-color': '#8b5cf6' }}>
              <div className="stat-icon-bg">
                <FaStar />
              </div>
              <div className="stat-details">
                <h3>{city}</h3>
                <p>Selected Location</p>
              </div>
            </div>
          </div>
        </section>

        {/* Modern Header */}
        <header className="dashboard-header-modern">
          <div className="header-left">
            <div className="logo-wrapper">
              <img src={Logo} alt="EcoWorth Logo" className="logo-modern" />
            </div>
            <div className="header-info">
              <h1 className="header-title">
                <FaLeaf className="title-icon" />
                Seller Dashboard
              </h1>
              <p className="header-subtitle">Manage your waste listings & analytics</p>
            </div>
          </div>
          <button
            className="logout-btn-modern"
            onClick={() => {
              localStorage.removeItem("isAuthenticated");
              localStorage.removeItem("authToken");
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              window.dispatchEvent(new Event('authChange'));
              navigate("/login");
            }}
          >
            <FaSignOutAlt className="btn-icon" />
            Logout
          </button>
        </header>

      {/* Main Content */}
      <main className="dashboard-content-modern">
        {/* Filters Section */}
        <section className="filters-section-modern">
          <div className="section-header">
            <h2>
              <FaFilter className="section-icon" />
              Filter Options
            </h2>
            <span className="section-badge">Customize your view</span>
          </div>
          <div className="filters-grid">
            <div className="filter-card">
              <label>
                <FaMapMarkerAlt className="label-icon" />
                Select State
              </label>
              <select value={selectedState} onChange={handleStateChange}>
                {Object.keys(statesWithCities).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-card">
              <label>
                <FaBuilding className="label-icon" />
                Select City
              </label>
              <select value={city} onChange={(e) => setCity(e.target.value)}>
                {statesWithCities[selectedState]?.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-card">
              <label>
                <FaTags className="label-icon" />
                Select Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {staticData.map((item) => (
                  <option key={item.category} value={item.category}>
                    {item.category}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-card">
              <label>
                <FaCalendarAlt className="label-icon" />
                Forecast Period
              </label>
              <select
                value={forecastMonths}
                onChange={(e) => setForecastMonths(Number(e.target.value))}
              >
                {forecastOptions.map((m) => (
                  <option key={m} value={m}>
                    {m} months
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Waste Quantities Table */}
        <section className="data-section-modern">
          <div className="section-header">
            <div className="d-flex align-items-center">
              <FaRecycle className="section-icon" />
            <h2 className="m-2 f-bold">
              Waste Inventory
            </h2>
            </div>
            {/* <span className="section-badge">{staticData.length} Categories</span> */}
          </div>
          {loading ? (
            <div className="loading-modern">
              <FaSpinner className="spinner-icon" />
              <p>Loading data...</p>
            </div>
          ) : error ? (
            <div className="error-modern">{error}</div>
          ) : (
            <div className="table-modern-wrapper">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Category ({staticData.length})</th>
                    <th>Quantity (kg)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {weights.map((item, index) => (
                    <tr key={item.category}>
                      <td>
                        <div className="category-cell">
                          <FaRecycle className="category-icon" />
                          <span>{item.category}</span>
                        </div>
                      </td>
                      <td>
                        <span className="quantity-badge">{item.weights} kg</span>
                      </td>
                      <td>
                        <button
                          className="action-btn-modern"
                          disabled={item.isListed}
                          onClick={() => handleListClick(item.category)}
                        >
                          
                          {item.isListed ? "Listed" : <div><FaPlusCircle className="btn-icon" /> Create Listing</div>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Price Forecast Chart */}
        <section className="chart-section-modern">
          <div className="section-header">
            <div className="d-flex align-items-center">
              <FaChartLine className="section-icon mx-2"/>
            <h2>
              Price Forecast - {selectedCategory} in {city}
            </h2>
            </div>
            <span className="section-badge">Next {forecastMonths} months</span>
          </div>
          {loading ? (
            <div className="loading-modern">
              <FaSpinner className="spinner-icon" />
              <p>Analyzing trends...</p>
            </div>
          ) : error ? (
            <div className="error-modern">{error}</div>
          ) : (
            <div className="chart-wrapper-modern">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    label={{
                      value: "Month",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Price (₹/kg)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `₹${value.toFixed(2)}`,
                      "Price per kg",
                    ]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="price"
                    name="Price per kg (₹)"
                    fill="url(#colorGradient)"
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </main>

      {/* Modern Listing Modal */}
      {showModal && (
        <div className="modal-overlay-dashboard">
          <div className="modal-content-dashboard">
            <button className="modal-close-btn" onClick={() => setShowModal(false)}>
              <FaTimes />
            </button>
            
            <div className="modal-header-dashboard">
              <div className="modal-icon-wrapper">
                <FaPlusCircle className="modal-icon" />
              </div>
              <h3>Create New {selectedItem?.category} Listing</h3>
              <p>Fill in the details to list your recyclable material</p>
            </div>

            <form onSubmit={handleSubmit} className="modal-form-dashboard">
              <div className="form-row-dashboard">
                <div className="form-group-dashboard">
                  <label>
                    <FaTags className="label-icon" />
                    Category
                  </label>
                  <div className="readonly-field">
                    <FaRecycle className="field-icon" />
                    <span>{selectedItem?.category}</span>
                  </div>
                </div>

                <div className="form-group-dashboard">
                  <label>
                    <FaBoxOpen className="label-icon" />
                    Quantity
                  </label>
                  <div className="readonly-field">
                    <span className="quantity-value">{selectedItem?.quantity} kg</span>
                  </div>
                </div>
              </div>

              <div className="form-row-dashboard">
                <div className="form-group-dashboard">
                  <label>
                    <FaInfoCircle className="label-icon" />
                    Price per kg (₹)
                  </label>
                  <input
                    type="number"
                    name="pricePerKg"
                    value={formData.pricePerKg}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter price per kg"
                    className="input-modern"
                  />
                </div>

                <div className="form-group-dashboard">
                  <label>
                    <FaPhoneAlt className="label-icon" />
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    maxLength={10}
                    required
                    placeholder="10-digit number"
                    className="input-modern"
                  />
                </div>
              </div>

              <div className="form-row-dashboard">
                <div className="form-group-dashboard">
                  <label>
                    <FaMapMarkerAlt className="label-icon" />
                    State
                  </label>
                  <select
                    name="state"
                    value={formData.state || selectedState}
                    onChange={handleInputChange}
                    className="select-modern"
                  >
                    {Object.keys(statesWithCities).map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group-dashboard">
                  <label>
                    <FaBuilding className="label-icon" />
                    City
                  </label>
                  <select
                    name="city"
                    value={formData.city || city}
                    onChange={handleInputChange}
                    className="select-modern"
                  >
                    {statesWithCities[formData.state || selectedState]?.map((ct) => (
                      <option key={ct} value={ct}>
                        {ct}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group-dashboard full-width">
                <label>
                  <FaInfoCircle className="label-icon" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Add details about material quality, condition, etc."
                  className="textarea-modern"
                />
              </div>

              <div className="modal-actions-dashboard">
                <button
                  type="button"
                  className="btn-cancel-dashboard"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="button" className="btn-submit-dashboard" onClick={handleListing}>
                  <FaPlusCircle className="btn-icon" />
                  Create Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
      <Footer />
    </>
  );
}
