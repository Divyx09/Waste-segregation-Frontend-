import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import EcoLogo from "../assets/eco-worth.png";
import axios from 'axios';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
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
        role: 'buyer'
      };

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/register`, signupData);

      console.log("Signup response:", response.data);

      if (response.data && (response.data.success === true || response.status === 200)) {
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
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left - Signup Form */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <div className="text-center mb-4">
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#2ecc71',
                  borderRadius: '50%',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  color: 'white'
                }}
              >
                👤+
              </div>
              <h3 className="mt-3 fw-bold">Create Account</h3>
              <p className="text-muted">Join our eco-friendly community today</p>
            </div>

            <form onSubmit={handleSignup}>

              {/* Email */}
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  style={{ borderRadius: '8px' }}
                />
              </div>

              {/* Password */}
              <div className="mb-1">
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  style={{ borderRadius: '8px' }}
                />
              </div>
              <small className="text-muted d-block mb-3">Min 6 characters</small>

              {/* Confirm Password */}
              <div className="mb-3">
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  style={{ borderRadius: '8px' }}
                />
              </div>

              {/* Terms */}
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="agree"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <label className="form-check-label" htmlFor="agree">
                  I agree to the <Link to="#" className="text-primary text-decoration-none">Terms</Link>
                </label>
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                className="btn w-100 mb-3"
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(90deg, #00c853, #00e676)',
                  color: 'white',
                  borderRadius: '8px',
                  fontWeight: 'bold'
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creating Account...
                  </>
                ) : (
                  <>👤+ Create Account</>
                )}
              </button>

              {/* Divider */}
              <div className="d-flex align-items-center mb-3">
                <hr className="flex-grow-1" />
                <span className="mx-2 text-muted">OR</span>
                <hr className="flex-grow-1" />
              </div>

              <p className="text-muted text-center">
                Already have an account?{' '}
                <Link to="/login" className="text-primary text-decoration-none">Sign in</Link>
              </p>
            </form>
          </div>
        </div>

        {/* Right - Blue section with Logo & Circles */}
        <div
          className="col-md-6 d-none d-md-flex justify-content-center align-items-center position-relative"
          style={{
            backgroundColor: '#0D1B3E',
            overflow: 'hidden'
          }}
        >
          <img src={EcoLogo} alt="EcoLogo" height={350} />
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
