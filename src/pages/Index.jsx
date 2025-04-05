
import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">MediConnect Express</h1>
        <p className="text-xl text-gray-600 mb-8">Connecting Patients with Healthcare Providers</p>
        <div className="space-y-4">
          <div>
            <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition duration-300">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
