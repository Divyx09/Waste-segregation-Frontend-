import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDownload, FaCheckCircle, FaClock, FaTimesCircle, FaShieldAlt, FaDesktop, FaRocket, FaStar, FaCrown } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { authUtils } from '../utils/auth';
import axios from 'axios';
import '../assets/scss/LicensePage.scss';

export default function LicensePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [licenseStatus, setLicenseStatus] = useState(null); // null, 'pending', 'approved', 'rejected'
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('basic');

  useEffect(() => {
    // Check if user is logged in
    if (!authUtils.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const currentUser = authUtils.getCurrentUser();
    setUser(currentUser);

    // Check if user is already a seller - they shouldn't be here
    if (currentUser.role?.toLowerCase() === 'seller') {
      alert('You already have a seller license! Redirecting to your dashboard.');
      navigate('/seller-dashboard');
      return;
    }

    // TODO: Fetch license status from backend
    fetchLicenseStatus();
  }, [navigate]);

  const fetchLicenseStatus = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/license/status`, {
      //   headers: { Authorization: `Bearer ${authUtils.getToken()}` }
      // });
      // setLicenseStatus(response.data.status);
      
      // Demo: Check localStorage for demo purposes
      const demoStatus = localStorage.getItem('licenseStatus');
      setLicenseStatus(demoStatus);
    } catch (error) {
      console.error('Error fetching license status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestLicense = async () => {
    try {
      setIsLoading(true);

      // TODO: Replace with actual API call
      // const response = await axios.post(
      //   `${import.meta.env.VITE_BASE_URL}/license/request`,
      //   { plan: selectedPlan },
      //   { headers: { Authorization: `Bearer ${authUtils.getToken()}` } }
      // );

      // Demo: Store in localStorage
      localStorage.setItem('licenseStatus', 'pending');
      localStorage.setItem('licensePlan', selectedPlan);
      setLicenseStatus('pending');

      alert('License request submitted successfully! Admin will review your request.');
    } catch (error) {
      console.error('Error requesting license:', error);
      alert('Failed to submit license request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadApp = () => {
    // TODO: Replace with actual download link
    alert('Desktop application download will start soon!');
    // window.location.href = '/downloads/EcoWorth-Desktop-Setup.exe';
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '₹999',
      period: '/month',
      features: [
        'Desktop App Access',
        'AI Waste Scanning',
        'Up to 100 scans/month',
        'Basic Analytics',
        'Email Support'
      ],
      icon: FaDesktop,
      color: '#3b82f6'
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '₹2,499',
      period: '/month',
      features: [
        'Everything in Basic',
        'Unlimited Scans',
        'Advanced Analytics',
        'Price Predictions',
        'Priority Support',
        'API Access'
      ],
      icon: FaRocket,
      color: '#8b5cf6',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '₹4,999',
      period: '/month',
      features: [
        'Everything in Pro',
        'Multi-User Access',
        'Custom Integrations',
        'Dedicated Account Manager',
        '24/7 Phone Support',
        'Custom Reports'
      ],
      icon: FaCrown,
      color: '#f59e0b'
    }
  ];

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading license information...</p>
      </div>
    );
  }

  return (
    <div className="license-page">
      <Navbar />
      
      <div className="license-container">
        <div className="license-header">
          <FaShieldAlt className="header-icon" />
          <h1>Become a Seller - Get Your License</h1>
          <p>Choose a plan and get access to our powerful waste scanning desktop application to start selling</p>
        </div>

        {/* License Status Section */}
        {licenseStatus && (
          <div className={`license-status-card ${licenseStatus}`}>
            {licenseStatus === 'pending' && (
              <>
                <FaClock className="status-icon" />
                <h3>License Request Pending</h3>
                <p>Your license request is under review. Admin will approve it shortly.</p>
              </>
            )}
            {licenseStatus === 'approved' && (
              <>
                <FaCheckCircle className="status-icon" />
                <h3>License Approved!</h3>
                <p>Your license has been approved. Download the desktop application below.</p>
                <button className="download-btn" onClick={handleDownloadApp}>
                  <FaDownload /> Download Desktop App
                </button>
              </>
            )}
            {licenseStatus === 'rejected' && (
              <>
                <FaTimesCircle className="status-icon" />
                <h3>License Request Rejected</h3>
                <p>Your license request was not approved. Please contact support for more information.</p>
              </>
            )}
          </div>
        )}

        {/* Plans Section - Show only if no license or rejected */}
        {(!licenseStatus || licenseStatus === 'rejected') && (
          <>
            <div className="plans-section">
              <h2>Choose Your Plan</h2>
              <p>Select the plan that best fits your business needs</p>

              <div className="plans-grid">
                {plans.map((plan) => {
                  const Icon = plan.icon;
                  return (
                    <div
                      key={plan.id}
                      className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {plan.popular && (
                        <div className="popular-badge">
                          <FaStar /> Most Popular
                        </div>
                      )}
                      
                      <div className="plan-icon" style={{ backgroundColor: plan.color }}>
                        <Icon />
                      </div>
                      
                      <h3>{plan.name}</h3>
                      
                      <div className="plan-price">
                        <span className="price">{plan.price}</span>
                        <span className="period">{plan.period}</span>
                      </div>

                      <ul className="plan-features">
                        {plan.features.map((feature, index) => (
                          <li key={index}>
                            <FaCheckCircle className="check-icon" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="plan-radio">
                        <input
                          type="radio"
                          name="plan"
                          checked={selectedPlan === plan.id}
                          onChange={() => setSelectedPlan(plan.id)}
                        />
                        <label>Select Plan</label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="request-section">
              <button
                className="request-btn"
                onClick={handleRequestLicense}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Request License'}
              </button>
              <p className="request-note">
                After submitting, admin will review your request within 24-48 hours
              </p>
            </div>
          </>
        )}

        {/* Features Section */}
        <div className="features-section">
          <h2>Desktop Application Features</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🔍</div>
              <h4>AI-Powered Scanning</h4>
              <p>Automatically categorize waste materials using advanced AI technology</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h4>Real-Time Sync</h4>
              <p>Instant synchronization with your online seller dashboard</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <h4>Analytics Dashboard</h4>
              <p>Track your waste inventory and sales performance</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💰</div>
              <h4>Price Predictions</h4>
              <p>Get AI-powered price recommendations for your materials</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
