
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../components/ui/use-toast';
import { UserCircle, Mail, Phone, Heart, FileText, Calendar } from 'lucide-react';

const PatientProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dob: user?.dob || '',
    gender: user?.gender || '',
    allergies: user?.allergies || '',
    medicalHistory: user?.medicalHistory || '',
    image: user?.image || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(profileData);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="medical">Medical History</TabsTrigger>
          <TabsTrigger value="appointments">My Appointments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3 flex flex-col items-center">
                <div className="w-40 h-40 rounded-full bg-gray-200 overflow-hidden mb-4">
                  {profileData.image ? (
                    <img 
                      src={profileData.image} 
                      alt={profileData.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                      <UserCircle size={80} />
                    </div>
                  )}
                </div>
                {!isEditing && (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="mt-4"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
              
              <div className="md:w-2/3">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name"
                          name="name"
                          value={profileData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input 
                          id="dob"
                          name="dob"
                          type="date"
                          value={profileData.dob}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <select
                          id="gender"
                          name="gender"
                          value={profileData.gender}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="image">Profile Image URL</Label>
                        <Input 
                          id="image"
                          name="image"
                          value={profileData.image}
                          onChange={handleChange}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-6">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                        <p className="flex items-center gap-2 text-gray-900 mt-1">
                          <UserCircle className="h-5 w-5 text-blue-500" />
                          {profileData.name || 'Not provided'}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p className="flex items-center gap-2 text-gray-900 mt-1">
                          <Mail className="h-5 w-5 text-blue-500" />
                          {profileData.email || 'Not provided'}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                        <p className="flex items-center gap-2 text-gray-900 mt-1">
                          <Phone className="h-5 w-5 text-blue-500" />
                          {profileData.phone || 'Not provided'}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                        <p className="flex items-center gap-2 text-gray-900 mt-1">
                          <Calendar className="h-5 w-5 text-blue-500" />
                          {profileData.dob || 'Not provided'}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                        <p className="flex items-center gap-2 text-gray-900 mt-1">
                          <UserCircle className="h-5 w-5 text-blue-500" />
                          {profileData.gender || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="medical">
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Heart className="mr-2 h-5 w-5 text-red-500" />
                Medical Information
              </h2>
              
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Input 
                      id="allergies"
                      name="allergies"
                      value={profileData.allergies}
                      onChange={handleChange}
                      placeholder="List any allergies you have"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory">Medical History</Label>
                    <textarea
                      id="medicalHistory"
                      name="medicalHistory"
                      value={profileData.medicalHistory}
                      onChange={handleChange}
                      placeholder="Brief description of your medical history"
                      className="w-full min-h-[100px] p-2 border rounded-md"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Allergies</h3>
                    <p className="text-gray-900 mt-1">
                      {profileData.allergies || 'No allergies recorded'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Medical History</h3>
                    <p className="text-gray-900 mt-1">
                      {profileData.medicalHistory || 'No medical history recorded'}
                    </p>
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Medical Information
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="appointments">
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-500" />
                My Appointments
              </h2>
              
              <p className="text-gray-600 italic">
                View your appointment history in the Appointments section.
              </p>
              
              <div className="mt-4">
                <Button 
                  onClick={() => window.location.href = '/appointments'}
                >
                  Go to Appointments
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientProfile;
