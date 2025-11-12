// Login.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaLeaf, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/auth.css';
import '../assets/scss/Auth.modern.scss';
import EcoLogo from "../assets/eco-worth.png";
import { authUtils } from '../utils/auth';
import axios from 'axios';
import qs from "qs";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const savedEmail = localStorage.getItem('savedEmail');
  //   const savedPassword = localStorage.getItem('savedPassword');
  //   if (savedEmail && savedPassword) {
  //     setEmail(savedEmail);
  //     setPassword(savedPassword);
  //   }
  // }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const rememberMe = document.getElementById('rememberMe').checked;

      // Get default credentials and registered users
      const defaultCredentials = authUtils.getDefaultCredentials();
      const registeredUsers = authUtils.getRegisteredUsers();
      const allUsers = [...defaultCredentials, ...registeredUsers];

      // Find user with matching credentials
      // const user = allUsers.find(u => u.email === email && u.password === password);

      // console.log(email,password)
      if (email && password) {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/auth/login`,
          qs.stringify({
            username: email,
            password: password
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )

        // console.log(response.ok())
        const result = response.data
        console.log(result)

        // Save user data
        const userData = {
          email: email,
          role: result.role,
          name: result.name || email.split('@')[0],
        };

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authToken', result.access_token);
        localStorage.setItem('user', JSON.stringify(userData));

        // Handle remember me
        if (rememberMe) {
          localStorage.setItem('savedEmail', email);
          localStorage.setItem("token", result.access_token);
          localStorage.setItem("role", result.role);
        } else {
          localStorage.removeItem('savedEmail');
          localStorage.removeItem('savedPassword');
        }

        // Dispatch auth change event
        window.dispatchEvent(new Event('authChange'));

        // Redirect to appropriate dashboard
        if (result.role === 'buyer') {
          navigate('/home');
        } else {
          navigate('/seller-dashboard');
        }
      } else {
        alert('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container-modern">
      <div className="auth-grid">
        {/* Left - Login Form */}
        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <div className="auth-icon-wrapper">
                <FaLeaf className="auth-icon" />
              </div>
              <h2 className="auth-title">Welcome Back!</h2>
              <p className="auth-subtitle">Sign in to continue to EcoWorth</p>
            </div>

            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group-modern">
                <label className="form-label-modern">
                  <FaEnvelope className="label-icon" />
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-input-modern"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group-modern">
                <label className="form-label-modern">
                  <FaLock className="label-icon" />
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input-modern"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>

              <div className="auth-options">
                <div className="form-check-modern">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    defaultChecked={!!localStorage.getItem('savedEmail')}
                    disabled={isLoading}
                  />
                  <label htmlFor="rememberMe">Remember me</label>
                </div>
                <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
              </div>

              <button
                className="btn-auth-primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    Log in
                    <FaArrowRight className="btn-icon" />
                  </>
                )}
              </button>

              <div className="auth-footer">
                <p>
                  Don't have an account?{' '}
                  <Link to="/signup" className="auth-link-primary">Sign up now</Link>
                </p>
              </div>
            </form>

            <div className="auth-features">
              <div className="feature-item">
                <FaCheckCircle className="feature-icon" />
                <span>Secure Login</span>
              </div>
              <div className="feature-item">
                <FaCheckCircle className="feature-icon" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Brand Section */}
        <div className="auth-brand-section">
          <div className="brand-overlay"></div>
          <div className="floating-shapes">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className={`floating-shape shape-${i}`}></div>
            ))}
          </div>
          <div className="brand-content">
            <img src={EcoLogo} alt="EcoWorth Logo" className="brand-logo" />
            <h1 className="brand-title">EcoWorth</h1>
            <p className="brand-description">
              Transform waste into value with our AI-powered marketplace
            </p>
            <div className="brand-stats">
              <div className="stat-item">
                <h3>10K+</h3>
                <p>Active Users</p>
              </div>
              <div className="stat-item">
                <h3>500+</h3>
                <p>Partners</p>
              </div>
              <div className="stat-item">
                <h3>98%</h3>
                <p>Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
