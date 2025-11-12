import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRecycle, FaShoppingCart, FaInfoCircle, FaRocket, FaBars, FaTimes, FaLeaf, FaUser, FaSignOutAlt, FaUserShield, FaUserTie, FaUserCircle, FaDesktop } from "react-icons/fa";
import { authUtils } from "../utils/auth";
import "../assets/scss/style.scss";
import "../assets/scss/Navbar.modern.scss";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status on component mount and when localStorage changes
    const checkAuth = () => {
      const authStatus = authUtils.isAuthenticated();
      const user = authUtils.getCurrentUser();
      setIsAuthenticated(authStatus);
      setCurrentUser(user);
    };

    checkAuth();

    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    
    // Custom event for same-tab login/logout
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    authUtils.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setShowUserDropdown(false);
    setMobileMenuOpen(false);
    
    // Dispatch custom event for auth change
    window.dispatchEvent(new Event('authChange'));
    
    navigate('/login');
  };

  const getRoleIcon = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin':
        return FaUserShield;
      case 'seller':
        return FaUserTie;
      case 'buyer':
        return FaUserCircle;
      default:
        return FaUser;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin':
        return 'role-badge-admin';
      case 'seller':
        return 'role-badge-seller';
      case 'buyer':
        return 'role-badge-buyer';
      default:
        return 'role-badge-default';
    }
  };

  const navLinks = [
    { to: "/", label: "Home", icon: FaLeaf },
    { to: "/sell-waste", label: "Sell Waste", icon: FaRecycle },
    { to: "/buy-materials", label: "Buy Materials", icon: FaShoppingCart },
    { to: "/about", label: "About", icon: FaInfoCircle },
  ];

  return (
    <header className="navbar-modern">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon-wrapper">
            <FaLeaf className="logo-icon" />
          </div>
          <div className="logo-text">
            <h1>EcoWorth</h1>
            <span className="logo-tagline">Sustainable Future</span>
          </div>
        </Link>

        <nav className={`navbar-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-links">
            {navLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <li key={index}>
                  <Link 
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="nav-link"
                  >
                    <IconComponent className="nav-icon" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Authentication Section */}
          {isAuthenticated && currentUser ? (
            <div className="user-section">
              <button 
                className="user-profile-btn"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <div className="user-avatar">
                  {React.createElement(getRoleIcon(currentUser.role))}
                </div>
                <div className="user-info">
                  <span className="user-name">{currentUser.name || currentUser.email}</span>
                  <span className={`user-role ${getRoleBadgeClass(currentUser.role)}`}>
                    {currentUser.role || 'User'}
                  </span>
                </div>
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {React.createElement(getRoleIcon(currentUser.role))}
                    </div>
                    <div className="dropdown-info">
                      <h4>{currentUser.name || 'User'}</h4>
                      <p>{currentUser.email}</p>
                      <span className={`dropdown-role ${getRoleBadgeClass(currentUser.role)}`}>
                        {currentUser.role || 'User'}
                      </span>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => {
                    const dashboardRoute = currentUser.role?.toLowerCase() === 'seller' 
                      ? '/seller-dashboard' 
                      : currentUser.role?.toLowerCase() === 'admin'
                      ? '/admin'
                      : currentUser.role?.toLowerCase() === 'buyer'
                      ? '/buyer-dashboard'
                      : '/dashboard';
                    navigate(dashboardRoute);
                    setShowUserDropdown(false);
                    setMobileMenuOpen(false);
                  }}>
                    <FaUser className="dropdown-icon" />
                    Dashboard
                  </button>
                  {/* Desktop App link removed - sellers already have license, buyers use ContactAdminModal */}
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <FaSignOutAlt className="dropdown-icon" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button 
                className="navbar-login-btn"
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}
              >
                <FaUser className="btn-icon" />
                Login
              </button>
              <button 
                className="navbar-cta-btn"
                onClick={() => {
                  navigate('/signup');
                  setMobileMenuOpen(false);
                }}
              >
                <FaRocket className="btn-icon" />
                Get Started
                <div className="btn-shimmer"></div>
              </button>
            </div>
          )}
        </nav>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
