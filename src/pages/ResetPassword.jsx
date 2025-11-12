import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaCheckCircle, FaKey, FaShieldAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/auth.css';
import '../assets/scss/Auth.modern.scss';
import EcoLogo from "../assets/eco-worth.png";
import axios from 'axios';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    code: location.state?.resetCode || '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate passwords
      if (formData.newPassword !== formData.confirmPassword) {
        alert("Passwords do not match");
        setIsLoading(false);
        return;
      }

      if (formData.newPassword.length < 6) {
        alert("Password must be at least 6 characters long");
        setIsLoading(false);
        return;
      }

      const resetData = {
        email: formData.email,
        new_password: formData.newPassword,
        code: formData.code
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/reset-password`,
        resetData
      );

      console.log("Reset password response:", response.data);

      if (response.data) {
        setIsSuccess(true);
        alert("Password reset successful! Please login with your new password.");
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        alert("Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error('Reset password error:', error);
      if (error.response && error.response.data && error.response.data.detail) {
        alert(error.response.data.detail);
      } else {
        alert('Failed to reset password. Please check the code and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container-modern">
      <div className="auth-grid">
        {/* Left - Reset Password Form */}
        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            {/* Back Button */}
            <Link to="/login" className="back-link">
              <FaArrowLeft /> Back to Login
            </Link>

            <div className="auth-header">
              <div className="auth-icon-wrapper reset">
                <FaShieldAlt className="auth-icon" />
              </div>
              <h2 className="auth-title">Reset Password</h2>
              <p className="auth-subtitle">
                {isSuccess 
                  ? "Password updated successfully!"
                  : "Enter the verification code and your new password"
                }
              </p>
            </div>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="auth-form">
                {/* Email (readonly) */}
                <div className="form-group-modern">
                  <label className="form-label-modern">
                    <FaKey className="label-icon" />
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
                    disabled={isLoading || !!location.state?.email}
                  />
                </div>

                {/* Verification Code */}
                <div className="form-group-modern">
                  <label className="form-label-modern">
                    <FaKey className="label-icon" />
                    Verification Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    className="form-input-modern code-input"
                    placeholder="Enter 6-digit code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    maxLength="6"
                  />
                  <small className="form-hint">
                    Check your email for the verification code
                  </small>
                </div>

                {/* New Password */}
                <div className="form-group-modern">
                  <label className="form-label-modern">
                    <FaLock className="label-icon" />
                    New Password
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      className="form-input-modern"
                      placeholder="Create a strong password"
                      value={formData.newPassword}
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

                {/* Confirm New Password */}
                <div className="form-group-modern">
                  <label className="form-label-modern">
                    <FaLock className="label-icon" />
                    Confirm New Password
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      className="form-input-modern"
                      placeholder="Confirm your new password"
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

                <button
                  type="submit"
                  className="btn-auth-primary reset"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <FaShieldAlt className="btn-icon" />
                    </>
                  )}
                </button>

                <div className="auth-footer">
                  <p>
                    Didn't receive code?{' '}
                    <Link to="/forgot-password" className="auth-link-primary">Resend Code</Link>
                  </p>
                </div>
              </form>
            ) : (
              <div className="success-message">
                <FaCheckCircle className="success-icon" />
                <h3>Password Reset Complete!</h3>
                <p>Your password has been successfully updated.</p>
                <small>Redirecting to login page...</small>
              </div>
            )}

            <div className="auth-features">
              <div className="feature-item">
                <FaCheckCircle className="feature-icon" />
                <span>Encrypted</span>
              </div>
              <div className="feature-item">
                <FaCheckCircle className="feature-icon" />
                <span>Secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Brand Section */}
        <div className="auth-brand-section reset-brand">
          <div className="brand-overlay"></div>
          <div className="floating-shapes">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className={`floating-shape shape-${i}`}></div>
            ))}
          </div>
          <div className="brand-content">
            <img src={EcoLogo} alt="EcoWorth Logo" className="brand-logo" />
            <h1 className="brand-title">Secure Reset</h1>
            <p className="brand-description">
              Your security is our priority. Create a strong password to protect your account.
            </p>
            <div className="brand-benefits">
              <div className="benefit-item">
                <FaCheckCircle className="benefit-icon" />
                <span>Email Verified</span>
              </div>
              <div className="benefit-item">
                <FaCheckCircle className="benefit-icon" />
                <span>Code Validated</span>
              </div>
              <div className="benefit-item">
                <FaCheckCircle className="benefit-icon" />
                <span>Password Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
