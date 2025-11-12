import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaLeaf, FaArrowRight, FaCheckCircle, FaUserPlus, FaUser, FaPhone } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/auth.css';
import '../assets/scss/Auth.modern.scss';
import EcoLogo from "../assets/eco-worth.png";
import axios from 'axios';

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agree: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.agree) {
        alert("You must agree to the Terms");
        setIsLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        setIsLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        alert("Password must be at least 6 characters long");
        setIsLoading(false);
        return;
      }

      const signupData = {
        email: formData.email,
        password: formData.password,
        role: 'buyer',
        name: formData.name || formData.email.split('@')[0],
        phone: formData.phone || ''
      };

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/register`, signupData);

      console.log("Signup response:", response.data);

      if (response.data && (response.data.success === true || response.status === 200)) {
        // Save user data after successful signup
        const userData = {
          email: response.data.email || formData.email,
          role: response.data.role || 'buyer',
          name: response.data.name || formData.name || formData.email.split('@')[0],
        };

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authToken', response.data.access_token || 'temp-token');
        localStorage.setItem('user', JSON.stringify(userData));

        // Dispatch auth change event
        window.dispatchEvent(new Event('authChange'));

        if (response.data.role === 'buyer') {
          navigate('/home');
        } else {
          navigate('/seller-dashboard');
        }
      } else {
        alert(response.data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error('Signup error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container-modern">
      <div className="auth-grid">
        {/* Left - Signup Form */}
        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <div className="auth-icon-wrapper signup">
                <FaUserPlus className="auth-icon" />
              </div>
              <h2 className="auth-title">Create Account</h2>
              <p className="auth-subtitle">Join our eco-friendly community today</p>
            </div>

            <form onSubmit={handleSignup} className="auth-form">
              {/* Name */}
              <div className="form-group-modern">
                <label className="form-label-modern">
                  <FaUser className="label-icon" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-input-modern"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <small className="form-hint">Optional - helps personalize your experience</small>
              </div>

              {/* Email */}
              <div className="form-group-modern">
                <label className="form-label-modern">
                  <FaEnvelope className="label-icon" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-input-modern"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Phone */}
              <div className="form-group-modern">
                <label className="form-label-modern">
                  <FaPhone className="label-icon" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input-modern"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                  pattern="[0-9]{10}"
                  title="Please enter 10 digit phone number"
                />
                <small className="form-hint">Optional - 10 digits for better contact</small>
              </div>

              {/* Password */}
              <div className="form-group-modern">
                <label className="form-label-modern">
                  <FaLock className="label-icon" />
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-input-modern"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <small className="form-hint">Minimum 6 characters</small>
              </div>

              {/* Confirm Password */}
              <div className="form-group-modern">
                <label className="form-label-modern">
                  <FaLock className="label-icon" />
                  Confirm Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="form-input-modern"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="form-check-modern">
                <input
                  type="checkbox"
                  id="agree"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <label htmlFor="agree">
                  I agree to the <Link to="#" className="auth-link-primary">Terms & Conditions</Link>
                </label>
              </div>

              <button
                type="submit"
                className="btn-auth-primary signup"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <FaArrowRight className="btn-icon" />
                  </>
                )}
              </button>

              <div className="auth-footer">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="auth-link-primary">Sign in</Link>
                </p>
              </div>
            </form>

            <div className="auth-features">
              <div className="feature-item">
                <FaCheckCircle className="feature-icon" />
                <span>Free Account</span>
              </div>
              <div className="feature-item">
                <FaCheckCircle className="feature-icon" />
                <span>Instant Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Brand Section */}
        <div className="auth-brand-section signup-brand">
          <div className="brand-overlay"></div>
          <div className="floating-shapes">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className={`floating-shape shape-${i}`}></div>
            ))}
          </div>
          <div className="brand-content">
            <img src={EcoLogo} alt="EcoWorth Logo" className="brand-logo" />
            <h1 className="brand-title">Join EcoWorth</h1>
            <p className="brand-description">
              Be part of the circular economy revolution and make sustainability profitable
            </p>
            <div className="brand-benefits">
              <div className="benefit-item">
                <FaCheckCircle className="benefit-icon" />
                <span>AI-Powered Pricing</span>
              </div>
              <div className="benefit-item">
                <FaCheckCircle className="benefit-icon" />
                <span>Verified Network</span>
              </div>
              <div className="benefit-item">
                <FaCheckCircle className="benefit-icon" />
                <span>Secure Transactions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
