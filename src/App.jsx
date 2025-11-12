import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import LicensePage from "./pages/LicensePage";
import AdminDashboard from "./pages/AdminDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import SellerListingPage from "./pages/SellerListingPage";
import SellWastePage from "./pages/SellWastePage";
import BuyMaterialsPage from "./pages/BuyMaterialsPage";
import AboutPage from "./pages/AboutPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Root route - Always Home Page */}
          <Route path="/" element={<HomePage />} />
          
          {/* Public Routes */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/sell-waste" element={<SellWastePage />} />
          <Route path="/buy-materials" element={<BuyMaterialsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Admin Routes - Only accessible by admin */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Seller Routes - Only accessible by sellers */}
          <Route 
            path="/seller-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/seller-listing" 
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerListingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/license" 
            element={
              <ProtectedRoute allowedRoles={['buyer', 'seller']}>
                <LicensePage />
              </ProtectedRoute>
            } 
          />
          
          {/* Buyer Routes - Only accessible by buyers */}
          <Route 
            path="/buyer-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
