// Authentication utility functions for local storage based auth

export const authUtils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem('isAuthenticated') === 'true' && 
           localStorage.getItem('authToken') !== null;
  },

  // Get current user data
  getCurrentUser: () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  },

  // Get all registered users (for admin purposes)
  getRegisteredUsers: () => {
    try {
      const users = localStorage.getItem('registeredUsers');
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error parsing registered users:', error);
      return [];
    }
  },

  // Check if email is already registered
  isEmailRegistered: (email) => {
    const users = authUtils.getRegisteredUsers();
    return users.some(user => user.email === email);
  },

  // Get default demo credentials
  getDefaultCredentials: () => {
    return [
      { email: 'admin@waste.com', password: 'admin123', firstName: 'Admin', lastName: 'User', role: 'admin' },
      { email: 'user@waste.com', password: 'user123', firstName: 'Demo', lastName: 'User', role: 'user' },
      { email: 'demo@waste.com', password: 'demo123', firstName: 'Demo', lastName: 'Account', role: 'user' }
    ];
  }
};

export default authUtils;
