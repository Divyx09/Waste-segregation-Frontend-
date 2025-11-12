import React from 'react';
import { Navigate } from 'react-router-dom';
import { authUtils } from '../utils/auth';

/**
 * ProtectedRoute Component
 * Handles authentication and role-based authorization
 * 
 * Props:
 * - children: Component to render if authorized
 * - allowedRoles: Array of roles allowed to access this route (e.g., ['admin', 'seller'])
 * - redirectTo: Custom redirect path (optional)
 */
export default function ProtectedRoute({ children, allowedRoles = [], redirectTo = '/login' }) {
  // Check if user is authenticated
  if (!authUtils.isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  // If specific roles are required, check user's role
  if (allowedRoles.length > 0) {
    const user = authUtils.getCurrentUser();
    const userRole = user?.role?.toLowerCase();

    // Check if user's role is in the allowed roles
    const isAuthorized = allowedRoles.some(
      role => role.toLowerCase() === userRole
    );

    if (!isAuthorized) {
      // Redirect to appropriate dashboard based on role
      const roleRedirects = {
        admin: '/admin',
        seller: '/seller-dashboard',
        buyer: '/buyer-dashboard'
      };

      const redirectPath = roleRedirects[userRole] || '/home';
      return <Navigate to={redirectPath} replace />;
    }
  }

  // User is authenticated and authorized
  return children;
}
