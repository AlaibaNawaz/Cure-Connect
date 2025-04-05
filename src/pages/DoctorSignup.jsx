
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Calendar, Briefcase, MapPin, Clock, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/ui/use-toast';

function DoctorSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    location: '',
    bio: '',
    experience: '',
    education: '',
    fees: '',
    availableDays: [],
    availableTimeSlots: [],
    profileImage: null
  });
  
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        profileImage: e.target.files[0]
      });
    }
  };
  
  const handleCheckboxChange = (e, array) => {
    const { name, value, checked } = e.target;
    
    if (checked) {
      setFormData({
        ...formData,
        [name]: [...formData[name], value]
      });
    } else {
      setFormData({
        ...formData,
        [name]: formData[name].filter(item => item !== value)
      });
    }
  };
  
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.specialization) newErrors.specialization = 'Specialization is required';
    if (!formData.location) newErrors.location = 'Location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep3 = () => {
    const newErrors = {};
    
    if (formData.availableDays.length === 0) {
      newErrors.availableDays = 'Please select at least one available day';
    }
    
    if (formData.availableTimeSlots.length === 0) {
      newErrors.availableTimeSlots = 'Please select at least one available time slot';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep3()) return;
    
    setIsSubmitting(true);
    
    try {
      // Convert profile image to URL (in a real app, you'd upload to a server)
      let imageUrl = null;
      if (formData.profileImage) {
        imageUrl = URL.createObjectURL(formData.profileImage);
      }
      
      // Register the doctor
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        specialization: formData.specialization,
        location: formData.location,
        bio: formData.bio,
        experience: formData.experience,
        education: formData.education,
        fees: formData.fees,
        availableDays: formData.availableDays,
        availableTimeSlots: formData.availableTimeSlots,
        image: imageUrl || "https://randomuser.me/api/portraits/men/32.jpg", // Default image if none provided
        rating: 0,
        reviews: [],
        available: true
      }, 'doctor');
      
      if (success) {
        toast({
          title: "Registration Successful",
          description: "Your doctor account has been created. You can now access your dashboard.",
        });
        navigate('/doctor-dashboard');
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Doctor Registration</h2>
            <p className="mt-2 text-gray-600">Join our healthcare platform as a healthcare provider</p>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className={`flex-1 text-center py-2 ${step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                1. Account Details
              </div>
              <div className={`flex-1 text-center py-2 ${step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                2. Professional Details
              </div>
              <div className={`flex-1 text-center py-2 ${step >= 3 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                3. Availability & Submit
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(step / 3) * 100}%` }}></div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Dr. John Doe"
                    />
                  </div>
                  {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specialization</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.specialization ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="">Select Specialization</option>
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Pediatrician">Pediatrician</option>
                      <option value="Orthopedist">Orthopedist</option>
                      <option value="Gynecologist">Gynecologist</option>
                      <option value="Psychiatrist">Psychiatrist</option>
                      <option value="Urologist">Urologist</option>
                      <option value="Ophthalmologist">Ophthalmologist</option>
                      <option value="General Physician">General Physician</option>
                    </select>
                  </div>
                  {errors.specialization && <p className="mt-2 text-sm text-red-600">{errors.specialization}</p>}
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="">Select Location</option>
                      <option value="New York">New York</option>
                      <option value="Los Angeles">Los Angeles</option>
                      <option value="Chicago">Chicago</option>
                      <option value="Houston">Houston</option>
                      <option value="Miami">Miami</option>
                      <option value="Boston">Boston</option>
                      <option value="San Francisco">San Francisco</option>
                      <option value="Seattle">Seattle</option>
                      <option value="Denver">Denver</option>
                      <option value="Atlanta">Atlanta</option>
                    </select>
                  </div>
                  {errors.location && <p className="mt-2 text-sm text-red-600">{errors.location}</p>}
                </div>
                
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Years of Experience</label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. 10"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="education" className="block text-sm font-medium text-gray-700">Education & Qualifications</label>
                  <div className="mt-1">
                    <textarea
                      id="education"
                      name="education"
                      rows="3"
                      value={formData.education}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="MD from Harvard Medical School, Board Certified in Cardiology"
                    ></textarea>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Professional Bio</label>
                  <div className="mt-1">
                    <textarea
                      id="bio"
                      name="bio"
                      rows="4"
                      value={formData.bio}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tell patients about your professional experience and approach to healthcare..."
                    ></textarea>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="fees" className="block text-sm font-medium text-gray-700">Consultation Fees ($)</label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="fees"
                      name="fees"
                      value={formData.fees}
                      onChange={handleChange}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. 100"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile Picture (Optional)</label>
                  <div className="mt-1 flex items-center">
                    <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                      {formData.profileImage ? (
                        <img
                          src={URL.createObjectURL(formData.profileImage)}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )}
                    </span>
                    <label htmlFor="profile-image" className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                      <Upload className="h-4 w-4 inline-block mr-1" />
                      Upload
                    </label>
                    <input
                      id="profile-image"
                      name="profileImage"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {days.map(day => (
                      <div key={day} className="flex items-center">
                        <input
                          id={`day-${day}`}
                          name="availableDays"
                          type="checkbox"
                          value={day}
                          checked={formData.availableDays.includes(day)}
                          onChange={(e) => handleCheckboxChange(e, 'availableDays')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`day-${day}`} className="ml-2 block text-sm text-gray-700">
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.availableDays && <p className="mt-2 text-sm text-red-600">{errors.availableDays}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {timeSlots.map(time => (
                      <div key={time} className="flex items-center">
                        <input
                          id={`time-${time}`}
                          name="availableTimeSlots"
                          type="checkbox"
                          value={time}
                          checked={formData.availableTimeSlots.includes(time)}
                          onChange={(e) => handleCheckboxChange(e, 'availableTimeSlots')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`time-${time}`} className="ml-2 block text-sm text-gray-700">
                          {time}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.availableTimeSlots && <p className="mt-2 text-sm text-red-600">{errors.availableTimeSlots}</p>}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Review Your Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><span className="font-medium">Name:</span> {formData.name}</p>
                      <p><span className="font-medium">Email:</span> {formData.email}</p>
                      <p><span className="font-medium">Specialization:</span> {formData.specialization}</p>
                      <p><span className="font-medium">Location:</span> {formData.location}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Experience:</span> {formData.experience} years</p>
                      <p><span className="font-medium">Consultation Fee:</span> ${formData.fees}</p>
                      <p><span className="font-medium">Available Days:</span> {formData.availableDays.join(', ')}</p>
                      <p><span className="font-medium">Available Times:</span> {formData.availableTimeSlots.join(', ')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        By clicking "Complete Registration", you agree to our Terms of Service and Privacy Policy. You'll be able to receive appointment requests and manage patients.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`ml-auto bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                </button>
              )}
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorSignup;
