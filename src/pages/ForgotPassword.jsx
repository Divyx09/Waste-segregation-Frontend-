import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaPaperPlane, FaKey } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/auth.css';
import '../assets/scss/Auth.modern.scss';
import EcoLogo from "../assets/eco-worth.png";
import axios from 'axios';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/forgot-password`,
        { email }
      );

      console.log("Forgot password response:", response.data);

      if (response.data) {
        setResetCode(response.data.reset_code || '123456');
        setIsCodeSent(true);
        alert(`Password reset code sent! (Demo code: ${response.data.reset_code || '123456'})`);
        
        // Navigate to reset password page with email
        setTimeout(() => {
          navigate('/reset-password', { state: { email, resetCode: response.data.reset_code } });
        }, 2000);
      } else {
        alert("Failed to send reset code. Please try again.");
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      if (error.response && error.response.data && error.response.data.detail) {
        alert(error.response.data.detail);
      } else {
        alert('Failed to send reset code. Please check your email and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container-modern">
      <div className="auth-grid">
        {/* Left - Forgot Password Form */}
        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            {/* Back Button */}
            <Link to="/login" className="back-link">
              <FaArrowLeft /> Back to Login
            </Link>

            <div className="auth-header">
              <div className="auth-icon-wrapper forgot">
                <FaKey className="auth-icon" />
              </div>
              <h2 className="auth-title">Forgot Password?</h2>
              <p className="auth-subtitle">
                {isCodeSent 
                  ? "Code sent! Redirecting to reset password..."
                  : "No worries, we'll send you reset instructions"
                }
              </p>
            </div>

            {!isCodeSent ? (
              <form onSubmit={handleSubmit} className="auth-form">
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
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <small className="form-hint">
                    We'll send you a verification code to reset your password
                  </small>
                </div>

                <button
                  type="submit"
                  className="btn-auth-primary forgot"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Sending Code...
                    </>
                  ) : (
                    <>
                      Send Reset Code
                      <FaPaperPlane className="btn-icon" />
                    </>
                  )}
                </button>

                <div className="auth-footer">
                  <p>
                    Remember your password?{' '}
                    <Link to="/login" className="auth-link-primary">Sign in</Link>
                  </p>
                </div>
              </form>
            ) : (
              <div className="success-message">
                <FaCheckCircle className="success-icon" />
                <h3>Code Sent Successfully!</h3>
                <p>Check your email for the verification code.</p>
                <p className="demo-code">Demo Code: <strong>{resetCode}</strong></p>
                <small>Redirecting to reset password page...</small>
              </div>
            )}

            <div className="auth-features">
              <div className="feature-item">
                <FaCheckCircle className="feature-icon" />
                <span>Secure Process</span>
              </div>
              <div className="feature-item">
                <FaCheckCircle className="feature-icon" />
                <span>Quick Recovery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Brand Section */}
        <div className="auth-brand-section forgot-brand">
          <div className="brand-overlay"></div>
          <div className="floating-shapes">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className={`floating-shape shape-${i}`}></div>
            ))}
          </div>
          <div className="brand-content">
            <img src={EcoLogo} alt="EcoWorth Logo" className="brand-logo" />
            <h1 className="brand-title">Account Recovery</h1>
            <p className="brand-description">
              We've got your back. Regain access to your account in just a few simple steps.
            </p>
            <div className="brand-benefits">
              <div className="benefit-item">
                <FaCheckCircle className="benefit-icon" />
                <span>Email Verification</span>
              </div>
              <div className="benefit-item">
                <FaCheckCircle className="benefit-icon" />
                <span>Secure Reset</span>
              </div>
              <div className="benefit-item">
                <FaCheckCircle className="benefit-icon" />
                <span>Instant Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
