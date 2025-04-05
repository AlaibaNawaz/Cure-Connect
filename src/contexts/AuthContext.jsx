
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../components/ui/use-toast';

// Create auth context
const AuthContext = createContext();

// Mock users for demo purposes
const mockUsers = {
  patients: [
    { id: 'p1', email: 'patient@example.com', password: 'patient123', name: 'John Doe', type: 'patient' },
    { id: 'p2', email: 'patient2@example.com', password: 'patient123', name: 'Jane Smith', type: 'patient' }
  ],
  doctors: [
    { 
      id: 'd1', 
      email: 'doctor@example.com', 
      password: 'doctor123', 
      name: 'Dr. Sarah Johnson', 
      type: 'doctor',
      specialization: 'Cardiologist',
      location: 'New York',
      rating: 4.9,
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      available: true
    },
    { 
      id: 'd2', 
      email: 'doctor2@example.com', 
      password: 'doctor123', 
      name: 'Dr. Michael Chen', 
      type: 'doctor',
      specialization: 'Dermatologist',
      location: 'Los Angeles',
      rating: 4.8,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      available: true
    }
  ],
  admins: [
    { id: 'a1', email: 'admin@example.com', password: 'admin123', name: 'Admin User', type: 'admin' }
  ]
};

// Mock appointments
const mockAppointments = [
  {
    id: 'app1',
    doctorId: 'd1',
    patientId: 'p1',
    patientName: 'John Doe',
    date: '2023-07-15',
    time: '10:00 AM',
    status: 'confirmed',
    symptoms: 'Chest pain and shortness of breath',
    notes: '',
    completed: false
  },
  {
    id: 'app2',
    doctorId: 'd1',
    patientId: 'p2',
    patientName: 'Jane Smith',
    date: '2023-07-16',
    time: '11:30 AM',
    status: 'pending',
    symptoms: 'Regular checkup',
    notes: '',
    completed: false
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState(mockAppointments);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState(mockUsers.doctors);
  const [patients, setPatients] = useState(mockUsers.patients);
  
  const navigate = useNavigate();

  // Check for a saved user in localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('mediConnectUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('mediConnectUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('mediConnectUser');
    }
  }, [user]);

  const login = (email, password, userType) => {
    let userArray;
    
    switch(userType) {
      case 'patient':
        userArray = mockUsers.patients;
        break;
      case 'doctor':
        userArray = mockUsers.doctors;
        break;
      case 'admin':
        userArray = mockUsers.admins;
        break;
      default:
        userArray = [];
    }
    
    const foundUser = userArray.find(
      u => u.email === email && u.password === password
    );
    
    if (foundUser) {
      const userWithoutPassword = { ...foundUser };
      delete userWithoutPassword.password;
      
      setUser(userWithoutPassword);
      
      // Redirect based on user type
      switch(userType) {
        case 'patient':
          navigate('/patient-dashboard');
          break;
        case 'doctor':
          navigate('/doctor-dashboard');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        default:
          navigate('/');
      }
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      
      return true;
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    navigate('/');  // Changed from '/login' to '/' to redirect to home page
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  const register = (userData, userType) => {
    // Check if email already exists
    const allUsers = [...mockUsers.patients, ...mockUsers.doctors, ...mockUsers.admins];
    const emailExists = allUsers.some(u => u.email === userData.email);
    
    if (emailExists) {
      toast({
        title: "Registration Failed",
        description: "Email already in use",
        variant: "destructive",
      });
      return false;
    }
    
    const newUser = {
      ...userData,
      id: `${userType[0]}${Date.now()}`, // Generate a simple ID
      type: userType
    };
    
    // Add the new user to the appropriate array
    if (userType === 'patient') {
      setPatients(prev => [...prev, newUser]);
    } else if (userType === 'doctor') {
      setDoctors(prev => [...prev, newUser]);
    }
    
    toast({
      title: "Registration Successful",
      description: "Your account has been created successfully",
    });
    
    // Login the user after registration
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    setUser(userWithoutPassword);
    
    // Redirect based on user type
    if (userType === 'patient') {
      navigate('/patient-dashboard');
    } else if (userType === 'doctor') {
      navigate('/doctor-dashboard');
    }
    
    return true;
  };

  // Function to add new appointment
  const addAppointment = (appointmentData) => {
    const newAppointment = {
      id: `app${Date.now()}`,
      ...appointmentData,
      status: 'pending',
      completed: false
    };
    
    setAppointments(prev => [...prev, newAppointment]);
    
    toast({
      title: "Appointment Booked",
      description: "Your appointment has been scheduled successfully",
    });
    
    return newAppointment;
  };

  // Function to update appointment status
  const updateAppointmentStatus = (appointmentId, newStatus) => {
    setAppointments(prev => 
      prev.map(app => 
        app.id === appointmentId ? { ...app, status: newStatus } : app
      )
    );
    
    toast({
      title: "Appointment Updated",
      description: `Appointment status changed to ${newStatus}`,
    });
  };

  // Function to mark appointment as completed
  const completeAppointment = (appointmentId) => {
    setAppointments(prev => 
      prev.map(app => 
        app.id === appointmentId ? { ...app, completed: true } : app
      )
    );
    
    toast({
      title: "Appointment Completed",
      description: "The appointment has been marked as completed",
    });
  };
  
  // Get user's appointments (for doctors or patients)
  const getUserAppointments = () => {
    if (!user) return [];
    
    return appointments.filter(app => {
      if (user.type === 'doctor') {
        return app.doctorId === user.id;
      } else if (user.type === 'patient') {
        return app.patientId === user.id;
      } else if (user.type === 'admin') {
        return true; // Admins can see all appointments
      }
      return false;
    });
  };

  // Update user profile
  const updateUserProfile = (userData) => {
    if (!user) return false;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    
    // Also update in the appropriate array
    if (user.type === 'patient') {
      setPatients(prev => 
        prev.map(p => p.id === user.id ? { ...p, ...userData } : p)
      );
    } else if (user.type === 'doctor') {
      setDoctors(prev => 
        prev.map(d => d.id === user.id ? { ...d, ...userData } : d)
      );
    }
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
    
    return true;
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    doctors,
    patients,
    appointments,
    addAppointment,
    updateAppointmentStatus,
    completeAppointment,
    getUserAppointments,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
