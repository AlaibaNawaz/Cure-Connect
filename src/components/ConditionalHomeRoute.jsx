
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Home from '../pages/Home';

const ConditionalHomeRoute = () => {
  const { user } = useAuth();
  
  if (user) {
    // Redirect to appropriate dashboard based on user type
    if (user.type === 'patient') {
      return <Navigate to="/patient-dashboard" replace />;
    } else if (user.type === 'doctor') {
      return <Navigate to="/doctor-dashboard" replace />;
    } else if (user.type === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    }
  }
  
  // If not logged in, show the landing page
  return <Home />;
};

export default ConditionalHomeRoute;
