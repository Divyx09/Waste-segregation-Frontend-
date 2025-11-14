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
  const [licenseStatus, setLicenseStatus] = useState(null); // null, 'pending', 'active', 'expired', 'rejected'
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [transactionId, setTransactionId] = useState('');
  const [subscriptionHistory, setSubscriptionHistory] = useState([]);

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
    fetchSubscriptionHistory();
  }, [navigate]);

  const fetchLicenseStatus = async () => {
    try {
      const token = authUtils.getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/subscriptions/status`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data && response.data.status) {
        setLicenseStatus(response.data.status);
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      if (error.response?.status === 404) {
        // No subscription found
        setLicenseStatus(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubscriptionHistory = async () => {
    try {
      const token = authUtils.getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/subscriptions/history`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data && Array.isArray(response.data)) {
        setSubscriptionHistory(response.data);
      }
    } catch (error) {
      console.error('Error fetching subscription history:', error);
    }
  };

  const handleRequestLicense = async () => {
    // Validate inputs
    if (!transactionId.trim()) {
      alert('Please enter your transaction ID');
      return;
    }

    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    try {
      setIsLoading(true);

      const token = authUtils.getToken();
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/subscriptions/purchase`,
        {
          plan_type: selectedPlan,
          payment_method: paymentMethod,
          transaction_id: transactionId
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        setLicenseStatus('pending');
        setTransactionId('');
        alert('Subscription request submitted successfully! Admin will verify your payment and approve your request.');
        
        // Refresh status and history
        await fetchLicenseStatus();
        await fetchSubscriptionHistory();
      }
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to submit subscription request. Please try again.';
      alert(errorMessage);
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
      id: 'monthly',
      name: 'Monthly Plan',
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
                <h3>Subscription Request Pending</h3>
                <p>Your subscription request is under review. Admin will verify payment and approve it shortly.</p>
              </>
            )}
            {licenseStatus === 'active' && (
              <>
                <FaCheckCircle className="status-icon" />
                <h3>Subscription Active!</h3>
                <p>Your subscription has been approved. Download the desktop application below.</p>
                <button className="download-btn" onClick={handleDownloadApp}>
                  <FaDownload /> Download Desktop App
                </button>
              </>
            )}
            {licenseStatus === 'rejected' && (
              <>
                <FaTimesCircle className="status-icon" />
                <h3>Subscription Request Rejected</h3>
                <p>Your subscription request was not approved. Please contact support for more information.</p>
              </>
            )}
            {licenseStatus === 'expired' && (
              <>
                <FaClock className="status-icon" />
                <h3>Subscription Expired</h3>
                <p>Your subscription has expired. Please renew to continue using the desktop application.</p>
              </>
            )}
          </div>
        )}

        {/* Plans Section - Show only if no license or rejected or expired */}
        {(!licenseStatus || licenseStatus === 'rejected' || licenseStatus === 'expired') && (
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

            <div className="payment-section">
              <h2>Payment Information</h2>
              <p className="payment-note">Complete your payment and submit the transaction details below</p>
              
              <div className="payment-form">
                <div className="form-group">
                  <label htmlFor="paymentMethod">Payment Method</label>
                  <select
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-control"
                  >
                    <option value="upi">UPI</option>
                    <option value="netbanking">Net Banking</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="wallet">Wallet</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="transactionId">Transaction ID *</label>
                  <input
                    type="text"
                    id="transactionId"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter your transaction ID"
                    className="form-control"
                    required
                  />
                  <small className="form-hint">
                    Complete your payment and enter the transaction ID received
                  </small>
                </div>

                <div className="payment-instructions">
                  <h4>Payment Instructions:</h4>
                  <ol>
                    <li>Complete payment using your preferred method</li>
                    <li>Note down your transaction ID</li>
                    <li>Enter the transaction ID above</li>
                    <li>Submit for admin verification</li>
                  </ol>
                </div>

                <button
                  className="request-btn"
                  onClick={handleRequestLicense}
                  disabled={isLoading || !transactionId.trim()}
                >
                  {isLoading ? 'Processing...' : 'Submit Subscription Request'}
                </button>
                <p className="request-note">
                  After submitting, admin will verify your payment and approve your subscription within 24-48 hours
                </p>
              </div>
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
