// Login.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import EcoLogo from "../assets/eco-worth.png";
import { authUtils } from '../utils/auth';
import axios from 'axios';
import qs from "qs";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

        // Handle remember me
        if (rememberMe) {
          localStorage.setItem('savedEmail', email);
          localStorage.setItem("token", result.access_token)
          localStorage.setItem("role", result.role)
        } else {
          localStorage.removeItem('savedEmail');
          localStorage.removeItem('savedPassword');
        }

        // Redirect to seller dashboard
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
    <div className="container-fluid vh-100">
      <div className="row h-100">

        {/* Left - Login Form */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div style={{ width: '100%', maxWidth: '360px' }}>
            <div className="text-center mb-4">
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#E0ECFF',
                  borderRadius: '50%',
                  margin: '0 auto'
                }}
              ></div>
              <h3 className="mt-4 fw-bold">Welcome back!</h3>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="mb-3 position-relative">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer'
                  }}
                >
                  👁
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                    defaultChecked={!!localStorage.getItem('savedEmail')}
                    disabled={isLoading}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
                <Link to="#" className="text-primary text-decoration-none">Forgot password</Link>
              </div>

              <button
                className="btn btn-primary w-100 mb-3"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Logging in...
                  </>
                ) : (
                  'Log in'
                )}
              </button>

              <p className="text-muted">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary text-decoration-none">Sign up now</Link>
              </p>
            </form>
          </div>
        </div>

        {/* Right - Blue section with 7 well-spaced Circles */}
        <div
          className="col-md-6 d-none d-md-flex justify-content-center align-items-center position-relative"
          style={{
            backgroundColor: '#0D1B3E',
            overflow: 'hidden'
          }}
        >
          <img src={EcoLogo} alt='EcoLogo' height={350} />
          {[
            { color: '#1E2A5A', top: '10%', left: '15%', size: 100 },
            { color: '#233B75', top: '25%', left: '60%', size: 80 },
            { color: '#1A285A', top: '50%', left: '20%', size: 120 },
            { color: '#2A4C9C', top: '70%', left: '50%', size: 90 },
            { color: '#3366CC', top: '15%', left: '80%', size: 70 },
            { color: '#4B79A1', top: '80%', left: '15%', size: 110 },
            { color: '#2980B9', top: '60%', left: '75%', size: 100 }
          ].map((circle, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: circle.top,
                left: circle.left,
                width: `${circle.size}px`,
                height: `${circle.size}px`,
                backgroundColor: circle.color,
                borderRadius: '50%',
                opacity: 0.9
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
