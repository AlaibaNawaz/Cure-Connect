
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, userType }) => {
  const { user, loading } = useAuth();
  
  // Show loading indicator
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }
  
  // Check if user is logged in
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // If userType is specified, check if the user has the correct type
  if (userType && user.type !== userType) {
    // Redirect to the appropriate dashboard
    if (user.type === 'patient') {
      return <Navigate to="/patient-dashboard" />;
    } else if (user.type === 'doctor') {
      return <Navigate to="/doctor-dashboard" />;
    } else if (user.type === 'admin') {
      return <Navigate to="/admin-dashboard" />;
    }
  }
  
  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;
