import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { statesWithCities } from "../assets/ConstantData";
import Logo from "../assets/logo.png";
import axios from "axios";
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
import "../assets/scss/Dashboard.scss"; // Import the SCSS file

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
        setStaticData(weightsResponse.data);

        // Fetch chart data
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
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [city, selectedCategory, forecastMonths]);


  const handleListing = async (e) => {
    e.preventDefault();

    try {
      setLoading(true); // optional, show loader

      // Prepare payload
      const payload = {
        category: formData.category,
        quantity: `${formData.quantity}kg`, // append kg
        price: `₹${formData.pricePerKg}/kg`, // format price
        state: formData.state || selectedState,
        city: formData.city || city,
        contactNo: formData.contactNumber,
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

      if (response.status === 200 || response.status === 201) {
        alert("Listing created successfully!");

        // Update state if you want to reflect new listing immediately
        setStaticData((prev) => [...prev, response.data]);

        // Close modal
        setShowModal(false);

        // Navigate to seller listing page
        navigate("/seller-listing", {
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

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <img src={Logo} alt="EcoWorth Logo" className="logo" />
          <h1>Waste Dashboard</h1>
        </div>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            navigate("/login");
          }}
        >
          <i className="bi bi-box-arrow-right"></i> Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Filters Section */}
        <section className="filters-section">
          <h2>
            <i className="bi bi-funnel"></i> Filter Options
          </h2>
          <div className="filter-grid">
            {/* State Filter */}
            <div className="filter-group">
              <label>
                <i className="bi bi-geo-alt"></i> Select State
              </label>
              <select value={selectedState} onChange={handleStateChange}>
                {Object.keys(statesWithCities).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div className="filter-group">
              <label>
                <i className="bi bi-building"></i> Select City
              </label>
              <select value={city} onChange={(e) => setCity(e.target.value)}>
                {statesWithCities[selectedState]?.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <label>
                <i className="bi bi-tags"></i> Select Category
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

            {/* Forecast Months */}
            <div className="filter-group">
              <label>
                <i className="bi bi-calendar-range"></i> Forecast Months
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
        <section className="data-section">
          <h2>
            <i className="bi bi-recycle"></i> Waste Quantities
          </h2>
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Quantity (kg)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {staticData.map((item, index) => (
                    <tr
                      key={item.category}
                      className={index % 2 === 0 ? "even" : "odd"}
                    >
                      <td>{item.category}</td>
                      <td>{item.weights}</td>
                      <td>
                        <button
                          className="list-btn"
                          onClick={() => handleListClick(item.category)}
                        >
                          List
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
        <section className="chart-section">
          <h2>
            <i className="bi bi-graph-up-arrow"></i> Price Forecast for{" "}
            {selectedCategory} in {city}
          </h2>
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
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
                    fill="#4CAF50"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </main>

      {/* Listing Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                <i className="bi bi-file-plus"></i> Create New{" "}
                {selectedItem?.category} Listing
              </h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Category</label>
                    <div className="readonly-field">
                      <i className="bi bi-tag"></i>
                      <span>{selectedItem?.category}</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Quantity (kg)</label>
                    <div className="readonly-field">
                      <i className="bi bi-box"></i>
                      <span>{selectedItem?.quantity} kg</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Price per kg (₹)</label>
                    <input
                      type="number"
                      name="pricePerKg"
                      value={formData.pricePerKg}
                      onChange={handleInputChange}
                      maxLength={10}
                      required
                      placeholder="Enter contact number"
                    />
                  </div>

                  <div className="form-group">
                    <label>Contact Number</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      maxLength={10}
                      required
                      placeholder="Enter contact number"
                    />
                  </div>

                  <div className="filter-grid">
                    <div className="filter-group">
                      <label>
                        <i className="bi bi-geo-alt"></i> Select State
                      </label>
                      <select
                        name="state" // Add name attribute
                        value={formData.state || selectedState} // Use formData.state with fallback
                        onChange={handleInputChange}
                      >
                        {Object.keys(statesWithCities).map((state) => (
                          <option key={state} value={state}>
                            {" "}
                            {/* Use state as value */}
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="filter-group">
                      <label>
                        <i className="bi bi-building"></i> Select City
                      </label>
                      <select
                        name="city" // Add name attribute
                        value={formData.city || city} // Use formData.city with fallback
                        onChange={handleInputChange}
                      >
                        {statesWithCities[formData.state || selectedState]?.map(
                          (ct) => (
                            <option key={ct} value={ct}>
                              {" "}
                              {/* Use ct as value */}
                              {ct}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Additional details..."
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="button" className="submit-btn" onClick={handleListing}>
                    <i className="bi bi-plus-circle"></i> Create Listing
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
