
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../components/ui/use-toast';
import { FileText, Plus, Download, Trash2 } from 'lucide-react';

const PrescriptionManagement = () => {
  const { user, getUserAppointments } = useAuth();
  const { toast } = useToast();
  const appointments = getUserAppointments().filter(app => app.completed);
  
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newPrescription, setNewPrescription] = useState({
    title: '',
    medication: '',
    dosage: '',
    instructions: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  // Mock function to load prescriptions
  useEffect(() => {
    // This would typically be an API call in a real application
    const mockPrescriptions = [
      {
        id: 'p1',
        appointmentId: 'app1',
        title: 'Heart Medication',
        medication: 'Lisinopril',
        dosage: '10mg',
        instructions: 'Take once daily with food',
        date: '2023-07-15',
        doctorId: 'd1',
        patientId: 'p1'
      }
    ];
    
    setPrescriptions(mockPrescriptions);
    
    // Check if there's an appointment ID in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const appointmentId = urlParams.get('appointment');
    if (appointmentId) {
      const appointment = appointments.find(app => app.id === appointmentId);
      if (appointment) {
        setSelectedAppointment(appointment);
      }
    }
  }, [appointments]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrescription(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedAppointment) {
      toast({
        title: "Error",
        description: "Please select an appointment",
        variant: "destructive"
      });
      return;
    }
    
    // Create a new prescription
    const prescription = {
      id: `p${Date.now()}`,
      appointmentId: selectedAppointment.id,
      ...newPrescription,
      doctorId: user.id,
      patientId: selectedAppointment.patientId
    };
    
    setPrescriptions(prev => [...prev, prescription]);
    
    toast({
      title: "Prescription Added",
      description: "Prescription has been added successfully"
    });
    
    // Reset form
    setNewPrescription({
      title: '',
      medication: '',
      dosage: '',
      instructions: '',
      date: new Date().toISOString().split('T')[0]
    });
  };
  
  const handleDelete = (prescriptionId) => {
    setPrescriptions(prev => prev.filter(p => p.id !== prescriptionId));
    
    toast({
      title: "Prescription Deleted",
      description: "Prescription has been deleted"
    });
  };
  
  // Filter prescriptions based on user type
  const filteredPrescriptions = prescriptions.filter(p => {
    if (user.type === 'doctor') {
      return p.doctorId === user.id;
    } else if (user.type === 'patient') {
      return p.patientId === user.id;
    }
    return true; // Admin can see all
  });
  
  // Get prescriptions for the selected appointment
  const appointmentPrescriptions = selectedAppointment
    ? filteredPrescriptions.filter(p => p.appointmentId === selectedAppointment.id)
    : [];
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">
        {user.type === 'doctor' ? 'Manage Prescriptions' : 'My Prescriptions'}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Appointments</h2>
            
            {appointments.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                <FileText className="h-12 w-12 mx-auto mb-2" />
                <p>No completed appointments found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map(appointment => (
                  <div 
                    key={appointment.id}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedAppointment?.id === appointment.id 
                        ? 'bg-blue-50 border-blue-300' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <div className="font-medium">{appointment.date}</div>
                    <div className="text-sm text-gray-600">
                      {user.type === 'doctor' 
                        ? `Patient: ${appointment.patientName}` 
                        : `Dr. ${appointment.doctorName || 'Doctor'}`
                      }
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {selectedAppointment 
                  ? `Prescriptions for ${selectedAppointment.date}` 
                  : 'Select an appointment to view prescriptions'
                }
              </h2>
              
              {user.type === 'doctor' && selectedAppointment && (
                <Button onClick={() => document.getElementById('new-prescription-form').scrollIntoView()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Prescription
                </Button>
              )}
            </div>
            
            {!selectedAppointment ? (
              <div className="text-center text-gray-500 py-12">
                <FileText className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg">Please select an appointment to view its prescriptions</p>
              </div>
            ) : appointmentPrescriptions.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <FileText className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg">No prescriptions found for this appointment</p>
              </div>
            ) : (
              <div className="space-y-6">
                {appointmentPrescriptions.map(prescription => (
                  <div key={prescription.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">{prescription.title}</h3>
                        <p className="text-sm text-gray-500">Date: {prescription.date}</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        
                        {user.type === 'doctor' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-500 hover:bg-red-50"
                            onClick={() => handleDelete(prescription.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Medication</h4>
                        <p>{prescription.medication}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Dosage</h4>
                        <p>{prescription.dosage}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500">Instructions</h4>
                      <p>{prescription.instructions}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {user.type === 'doctor' && selectedAppointment && (
              <div id="new-prescription-form" className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">Add New Prescription</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Prescription Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={newPrescription.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={newPrescription.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="medication">Medication</Label>
                      <Input
                        id="medication"
                        name="medication"
                        value={newPrescription.medication}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dosage">Dosage</Label>
                      <Input
                        id="dosage"
                        name="dosage"
                        value={newPrescription.dosage}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="instructions">Instructions</Label>
                    <textarea
                      id="instructions"
                      name="instructions"
                      value={newPrescription.instructions}
                      onChange={handleInputChange}
                      required
                      className="w-full min-h-[100px] p-2 border rounded-md"
                      placeholder="Enter detailed instructions for the patient"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">
                      Add Prescription
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionManagement;
