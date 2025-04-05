
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft,
  Save,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/ui/use-toast';

function DoctorProfile() {
  const navigate = useNavigate();
  const params = useParams();
  const { user, updateUserProfile, doctors } = useAuth();
  
  // Determine if viewing own profile or another doctor's profile
  const isOwnProfile = !params.doctorId;
  const profileUser = isOwnProfile ? user : doctors?.find(d => d.id === params.doctorId);
  
  const [formData, setFormData] = useState({
    name: profileUser?.name || '',
    email: profileUser?.email || '',
    phone: profileUser?.phone || '',
    specialization: profileUser?.specialization || '',
    bio: profileUser?.bio || '',
    experience: profileUser?.experience || '',
    education: profileUser?.education || '',
    location: profileUser?.location || ''
  });

  // Update formData if profileUser changes
  useEffect(() => {
    if (profileUser) {
      setFormData({
        name: profileUser.name || '',
        email: profileUser.email || '',
        phone: profileUser.phone || '',
        specialization: profileUser.specialization || '',
        bio: profileUser.bio || '',
        experience: profileUser.experience || '',
        education: profileUser.education || '',
        location: profileUser.location || ''
      });
    }
  }, [profileUser]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update user profile
    updateUserProfile(formData);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
      status: "success"
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back</span>
          </button>
        </div>
      </div>
      
      {/* Profile Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-800">Doctor Profile</h1>
              <p className="text-gray-600">
                {isOwnProfile 
                  ? "Update your personal and professional information" 
                  : "View doctor's information"}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="w-full md:w-1/3 flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    {profileUser?.image ? (
                      <img 
                        src={profileUser.image} 
                        alt={profileUser.name} 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-blue-600">
                        {formData.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  {isOwnProfile && (
                    <button type="button" className="text-sm text-blue-600 hover:underline">
                      Change Profile Picture
                    </button>
                  )}
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly={!isOwnProfile}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly={!isOwnProfile}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                        Specialization
                      </label>
                      <input
                        type="text"
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly={!isOwnProfile}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mt-6">
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write a short professional description about yourself"
                    readOnly={!isOwnProfile}
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                      Education & Qualifications
                    </label>
                    <textarea
                      id="education"
                      name="education"
                      rows="3"
                      value={formData.education}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="List your degrees, certifications and qualifications"
                      readOnly={!isOwnProfile}
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    <input
                      type="text"
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Years of experience"
                      readOnly={!isOwnProfile}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Practice Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City, State"
                    readOnly={!isOwnProfile}
                  />
                </div>
              </div>
              
              {isOwnProfile && (
                <div className="mt-8">
                  <button 
                    type="submit"
                    className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
