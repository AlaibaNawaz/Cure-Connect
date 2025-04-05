import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import PatientDashboard from './pages/PatientDashboard.jsx';
import DoctorDashboard from './pages/DoctorDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import PatientSignup from './pages/PatientSignup.jsx';
import DoctorSignup from './pages/DoctorSignup.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DoctorProfile from './pages/DoctorProfile.jsx';
import DoctorList from './pages/DoctorList.jsx';
import AppointmentBooking from './pages/AppointmentBooking.jsx';
import PatientProfile from './pages/PatientProfile.jsx';
import AppointmentManagement from './pages/AppointmentManagement.jsx';
import PrescriptionManagement from './pages/PrescriptionManagement.jsx';
import NotFound from './pages/NotFound.jsx';
import Navbar from './components/Navbar.jsx';
import ConditionalHomeRoute from './components/ConditionalHomeRoute.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<ConditionalHomeRoute />} />
              
              <Route path="/login" element={<Login />} />
              <Route path="/patient-signup" element={<PatientSignup />} />
              <Route path="/doctor-signup" element={<DoctorSignup />} />
              <Route path="/doctor-list" element={<DoctorList />} />
              <Route path="/doctor/:doctorId" element={<DoctorProfile />} />
              
              <Route 
                path="/patient-dashboard" 
                element={
                  <ProtectedRoute userType="patient">
                    <PatientDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/doctor-dashboard" 
                element={
                  <ProtectedRoute userType="doctor">
                    <DoctorDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin-dashboard" 
                element={
                  <ProtectedRoute userType="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/patient-profile" 
                element={
                  <ProtectedRoute userType="patient">
                    <PatientProfile />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/book-appointment/:doctorId" 
                element={
                  <ProtectedRoute userType="patient">
                    <AppointmentBooking />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/appointments" 
                element={
                  <ProtectedRoute>
                    <AppointmentManagement />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/prescriptions" 
                element={
                  <ProtectedRoute>
                    <PrescriptionManagement />
                  </ProtectedRoute>
                } 
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
