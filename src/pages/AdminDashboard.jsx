import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaUserShield, FaCheckCircle, FaClock, FaTimesCircle, FaChartLine, FaBoxes, FaShoppingBag, FaDesktop, FaEye, FaCheck, FaTimes, FaBan, FaTrash, FaEdit, FaFlag, FaDownload } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { authUtils } from '../utils/auth';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../assets/scss/AdminDashboard.scss';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalBuyers: 0,
    totalListings: 0,
    pendingLicenses: 0,
    approvedLicenses: 0
  });
  const [licenseRequests, setLicenseRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [analytics, setAnalytics] = useState({
    userGrowth: [],
    categoryDistribution: [],
    revenueData: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and is admin
    if (!authUtils.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const currentUser = authUtils.getCurrentUser();
    setUser(currentUser);

    if (currentUser.role?.toLowerCase() !== 'admin') {
      alert('Access Denied: Admin privileges required');
      navigate('/home');
      return;
    }

    fetchAdminData();
  }, [navigate]);

  const fetchAdminData = async () => {
    try {
      const token = authUtils.getToken();
      
      // Fetch platform statistics
      const statsRes = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/statistics`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (statsRes.data && statsRes.data.statistics) {
        const stats = statsRes.data.statistics;
        setStats({
          totalUsers: stats.users?.total || 0,
          totalSellers: stats.users?.sellers || 0,
          totalBuyers: stats.users?.buyers || 0,
          totalListings: stats.listings?.total || 0,
          pendingLicenses: stats.subscriptions?.pending || 0,
          approvedLicenses: stats.subscriptions?.active || 0
        });
      }

      // Fetch license requests
      fetchLicenseRequests();
      
      // Fetch users
      fetchUsers();

      // Fetch listings
      fetchListings();

      // Fetch analytics
      fetchAnalytics();
    } catch (error) {
      console.error('Error fetching admin data:', error);
      // Set default values on error
      setStats({
        totalUsers: 0,
        totalSellers: 0,
        totalBuyers: 0,
        totalListings: 0,
        pendingLicenses: 0,
        approvedLicenses: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLicenseRequests = async (status = 'pending', page = 1, limit = 20) => {
    try {
      const token = authUtils.getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/subscriptions`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { status, page, limit }
        }
      );
      
      if (response.data && response.data.subscriptions && Array.isArray(response.data.subscriptions)) {
        setLicenseRequests(response.data.subscriptions);
      } else if (response.data && Array.isArray(response.data)) {
        setLicenseRequests(response.data);
      } else {
        setLicenseRequests([]);
      }
    } catch (error) {
      console.error('Error fetching subscription requests:', error);
      setLicenseRequests([]);
    }
  };

  const fetchUsers = async (role = null, page = 1, limit = 20) => {
    try {
      const token = authUtils.getToken();
      const params = { page, limit };
      if (role) params.role = role;
      
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params
        }
      );
      
      if (response.data && Array.isArray(response.data)) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const fetchListings = async (category = null, page = 1, limit = 20) => {
    try {
      const token = authUtils.getToken();
      const params = { page, limit };
      if (category) params.category = category;
      
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/listings`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params
        }
      );
      
      const data = Array.isArray(response.data) ? response.data : response.data?.listings || [];
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setListings([]);
    }
  };

  const fetchAnalytics = () => {
    // Demo analytics data
    const userGrowth = [
      { month: 'Jun', users: 450 },
      { month: 'Jul', users: 620 },
      { month: 'Aug', users: 780 },
      { month: 'Sep', users: 920 },
      { month: 'Oct', users: 1050 },
      { month: 'Nov', users: 1250 }
    ];

    const categoryDistribution = [
      { name: 'Plastic', value: 35 },
      { name: 'Metal', value: 25 },
      { name: 'Paper', value: 20 },
      { name: 'Glass', value: 10 },
      { name: 'Electronic', value: 7 },
      { name: 'Other', value: 3 }
    ];

    const revenueData = [
      { month: 'Jun', revenue: 45000 },
      { month: 'Jul', revenue: 62000 },
      { month: 'Aug', revenue: 78000 },
      { month: 'Sep', revenue: 92000 },
      { month: 'Oct', revenue: 105000 },
      { month: 'Nov', revenue: 125000 }
    ];

    setAnalytics({ userGrowth, categoryDistribution, revenueData });
  };

  const handleApproveLicense = async (subscriptionId, adminNotes = 'Payment verified and approved') => {
    try {
      const token = authUtils.getToken();
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin/subscriptions/${subscriptionId}/approve`,
        {
          status: 'active',
          admin_notes: adminNotes
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update local state
      setLicenseRequests(prev => prev.filter(req => req.id !== subscriptionId));
      setStats(prev => ({
        ...prev,
        pendingLicenses: prev.pendingLicenses - 1,
        approvedLicenses: prev.approvedLicenses + 1
      }));

      alert('Subscription approved successfully!');
      
      // Refresh data
      fetchLicenseRequests();
      fetchAdminData();
    } catch (error) {
      console.error('Error approving subscription:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to approve subscription';
      alert(errorMessage);
    }
  };

  const handleRejectLicense = async (subscriptionId, adminNotes = 'Subscription request rejected') => {
    if (!confirm('Are you sure you want to reject this subscription request?')) return;
    
    try {
      const token = authUtils.getToken();
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin/subscriptions/${subscriptionId}/approve`,
        {
          status: 'rejected',
          admin_notes: adminNotes
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      setLicenseRequests(prev => prev.filter(req => req.id !== subscriptionId));
      setStats(prev => ({
        ...prev,
        pendingLicenses: prev.pendingLicenses - 1
      }));

      alert('Subscription rejected');
      
      // Refresh data
      fetchLicenseRequests();
    } catch (error) {
      console.error('Error rejecting subscription:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to reject subscription';
      alert(errorMessage);
    }
  };

  const handleSuspendUser = async (userId, adminNotes = 'Account suspended by admin') => {
    if (!confirm('Are you sure you want to suspend this user?')) return;
    
    try {
      const token = authUtils.getToken();
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin/users/${userId}/status`,
        {
          is_active: false,
          admin_notes: adminNotes
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, is_active: false, status: 'suspended' } : u
      ));
      alert('User suspended successfully');
      
      // Refresh users
      fetchUsers();
    } catch (error) {
      console.error('Error suspending user:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to suspend user';
      alert(errorMessage);
    }
  };

  const handleActivateUser = async (userId, adminNotes = 'Account activated by admin') => {
    try {
      const token = authUtils.getToken();
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin/users/${userId}/status`,
        {
          is_active: true,
          admin_notes: adminNotes
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, is_active: true, status: 'active' } : u
      ));
      alert('User activated successfully');
      
      // Refresh users
      fetchUsers();
    } catch (error) {
      console.error('Error activating user:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to activate user';
      alert(errorMessage);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      // TODO: Replace with actual API call
      setUsers(prev => prev.filter(u => u.id !== userId));
      setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;
    
    try {
      const token = authUtils.getToken();
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admin/listings/${listingId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setListings(prev => prev.filter(l => l.id !== listingId));
      setStats(prev => ({ ...prev, totalListings: prev.totalListings - 1 }));
      alert('Listing deleted successfully');
      
      // Refresh listings
      fetchListings();
      fetchAdminData();
    } catch (error) {
      console.error('Error deleting listing:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to delete listing';
      alert(errorMessage);
    }
  };

  const handleToggleListingStatus = async (listingId, isActive) => {
    try {
      const token = authUtils.getToken();
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin/listings/${listingId}/status`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { is_active: !isActive }
        }
      );

      setListings(prev => prev.map(l => 
        l.id === listingId ? { ...l, is_active: !isActive } : l
      ));
      alert(`Listing ${!isActive ? 'activated' : 'deactivated'} successfully`);
      
      // Refresh listings
      fetchListings();
    } catch (error) {
      console.error('Error updating listing status:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to update listing status';
      alert(errorMessage);
    }
  };

  const handleExportData = (type) => {
    // TODO: Implement actual export functionality
    alert(`Exporting ${type} data... (Feature coming soon)`);
  };

  const COLORS = ['#43e97b', '#667eea', '#f093fb', '#4facfe', '#fa709a', '#30cfd0'];

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Navbar />
      
      <div className="admin-container">
        <div className="admin-header">
          <div className="header-content">
            <FaUserShield className="header-icon" />
            <div className="header-text">
              <h1>Admin Dashboard</h1>
              <p>Manage platform users, licenses, and analytics</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card users">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>

          <div className="stat-card sellers">
            <div className="stat-icon">
              <FaUserShield />
            </div>
            <div className="stat-info">
              <h3>{stats.totalSellers}</h3>
              <p>Sellers</p>
            </div>
          </div>

          <div className="stat-card buyers">
            <div className="stat-icon">
              <FaShoppingBag />
            </div>
            <div className="stat-info">
              <h3>{stats.totalBuyers}</h3>
              <p>Buyers</p>
            </div>
          </div>

          <div className="stat-card listings">
            <div className="stat-icon">
              <FaBoxes />
            </div>
            <div className="stat-info">
              <h3>{stats.totalListings}</h3>
              <p>Total Listings</p>
            </div>
          </div>

          <div className="stat-card pending">
            <div className="stat-icon">
              <FaClock />
            </div>
            <div className="stat-info">
              <h3>{stats.pendingLicenses}</h3>
              <p>Pending Licenses</p>
            </div>
          </div>

          <div className="stat-card approved">
            <div className="stat-icon">
              <FaCheckCircle />
            </div>
            <div className="stat-info">
              <h3>{stats.approvedLicenses}</h3>
              <p>Approved Licenses</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FaChartLine /> Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <FaChartLine /> Analytics
          </button>
          <button
            className={`tab-btn ${activeTab === 'licenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('licenses')}
          >
            <FaDesktop /> License Requests ({stats.pendingLicenses})
          </button>
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers /> User Management
          </button>
          <button
            className={`tab-btn ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            <FaBoxes /> Listing Moderation
          </button>
        </div>

        {/* Content */}
        <div className="admin-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <h2>Platform Overview</h2>
              <p>Welcome to the admin dashboard. Monitor platform activity and manage user requests.</p>
              
              <div className="quick-stats">
                <div className="quick-stat-item">
                  <h4>User Growth</h4>
                  <p className="stat-value">+15%</p>
                  <p className="stat-label">This Month</p>
                </div>
                <div className="quick-stat-item">
                  <h4>Active Listings</h4>
                  <p className="stat-value">{stats.totalListings}</p>
                  <p className="stat-label">Currently Active</p>
                </div>
                <div className="quick-stat-item">
                  <h4>Pending Actions</h4>
                  <p className="stat-value">{stats.pendingLicenses}</p>
                  <p className="stat-label">Needs Review</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="analytics-section">
              <div className="section-header">
                <h2>Platform Analytics</h2>
                <button className="export-btn" onClick={() => handleExportData('analytics')}>
                  <FaDownload /> Export Report
                </button>
              </div>

              <div className="charts-grid">
                {/* User Growth Chart */}
                <div className="chart-card">
                  <h3>User Growth</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.userGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="users" stroke="#667eea" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Revenue Chart */}
                <div className="chart-card">
                  <h3>Platform Revenue</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="#43e97b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Category Distribution */}
                <div className="chart-card full-width">
                  <h3>Waste Category Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.categoryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analytics.categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'licenses' && (
            <div className="licenses-section">
              <h2>License Requests</h2>
              
              {licenseRequests.length === 0 ? (
                <div className="empty-state">
                  <FaCheckCircle className="empty-icon" />
                  <h3>No Pending Requests</h3>
                  <p>All license requests have been processed</p>
                </div>
              ) : (
                <div className="requests-table">
                  <table>
                    <thead>
                      <tr>
                        <th>User Email</th>
                        <th>Plan</th>
                        <th>Transaction ID</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {licenseRequests.map(request => (
                        <tr key={request.id}>
                          <td>{request.user_email || request.email || 'N/A'}</td>
                          <td>
                            <span className={`plan-badge ${request.plan_type || request.plan}`}>
                              {(request.plan_type || request.plan || 'basic').toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <code className="transaction-id">{request.transaction_id || 'N/A'}</code>
                          </td>
                          <td>{new Date(request.purchased_at || request.date).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-badge ${request.status || 'pending'}`}>
                              {request.status === 'pending' ? <><FaClock /> Pending</> : request.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="approve-btn"
                                onClick={() => handleApproveLicense(request.id)}
                                title="Approve"
                              >
                                <FaCheck /> Approve
                              </button>
                              <button
                                className="reject-btn"
                                onClick={() => handleRejectLicense(request.id)}
                                title="Reject"
                              >
                                <FaTimes /> Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-section">
              <div className="section-header">
                <h2>User Management</h2>
                <button className="export-btn" onClick={() => handleExportData('users')}>
                  <FaDownload /> Export Users
                </button>
              </div>
              
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Join Date</th>
                      <th>Activity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${user.status}`}>
                            {user.status === 'active' ? <FaCheckCircle /> : <FaBan />}
                            {user.status}
                          </span>
                        </td>
                        <td>{user.joinDate}</td>
                        <td>
                          {user.role === 'seller' ? `${user.listings || 0} listings` : `${user.purchases || 0} purchases`}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="view-btn" title="View Details">
                              <FaEye />
                            </button>
                            {user.status === 'active' ? (
                              <button 
                                className="suspend-btn" 
                                onClick={() => handleSuspendUser(user.id)}
                                title="Suspend User"
                              >
                                <FaBan />
                              </button>
                            ) : (
                              <button 
                                className="activate-btn" 
                                onClick={() => handleActivateUser(user.id)}
                                title="Activate User"
                              >
                                <FaCheckCircle />
                              </button>
                            )}
                            <button 
                              className="delete-btn" 
                              onClick={() => handleDeleteUser(user.id)}
                              title="Delete User"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="listings-section">
              <div className="section-header">
                <h2>Listing Moderation</h2>
                <button className="export-btn" onClick={() => handleExportData('listings')}>
                  <FaDownload /> Export Listings
                </button>
              </div>
              
              {listings.length === 0 ? (
                <div className="empty-state">
                  <FaBoxes className="empty-icon" />
                  <h3>No Listings Found</h3>
                  <p>No listings to moderate at this time</p>
                </div>
              ) : (
                <div className="listings-grid-admin">
                  {listings.map(listing => (
                    <div key={listing.id} className="admin-listing-card">
                      <div className="listing-image-admin">
                        {listing.image_url ? (
                          <img src={listing.image_url} alt={listing.title} />
                        ) : (
                          <div className="placeholder-image">
                            <FaBoxes />
                          </div>
                        )}
                      </div>
                      
                      <div className="listing-details-admin">
                        <div className="listing-header-admin">
                          <h3>{listing.title}</h3>
                          <span className={`category-badge ${listing.category}`}>
                            {listing.category || 'Other'}
                          </span>
                        </div>
                        
                        <p className="listing-desc">{listing.description}</p>
                        
                        <div className="listing-meta">
                          <div className="meta-item">
                            <strong>Seller:</strong> {listing.seller_name || 'Unknown'}
                          </div>
                          <div className="meta-item">
                            <strong>Quantity:</strong> {listing.quantity || 0} {listing.unit || 'kg'}
                          </div>
                          <div className="meta-item">
                            <strong>Price:</strong> ₹{listing.price || 0}
                          </div>
                          {listing.location && (
                            <div className="meta-item">
                              <strong>Location:</strong> {listing.location}
                            </div>
                          )}
                        </div>
                        
                        <div className="admin-actions">
                          <button className="view-detail-btn" title="View Full Details">
                            <FaEye /> View
                          </button>
                          <button className="flag-btn" title="Flag for Review">
                            <FaFlag /> Flag
                          </button>
                          <button 
                            className="delete-listing-btn" 
                            onClick={() => handleDeleteListing(listing.id)}
                            title="Delete Listing"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
