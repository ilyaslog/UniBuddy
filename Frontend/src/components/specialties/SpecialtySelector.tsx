import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Code, Stethoscope, Scale, Calculator } from 'lucide-react';

const specialties = [
  { id: 'medicine', name: 'Medicine', icon: Stethoscope },
  { id: 'law', name: 'Law', icon: Scale },
  { id: 'programming', name: 'Programming', icon: Code },
  { id: 'mathematics', name: 'Mathematics', icon: Calculator },
  { id: 'literature', name: 'Literature', icon: BookOpen },
];

export function SpecialtySelector() {
  const navigate = useNavigate();

  const handleSpecialtySelect = (specialtyId: string) => {
    // Handle specialty selection logic here
    navigate('/chat');
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold text-center mb-8">Choose Your Specialty</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specialties.map((specialty) => {
          const Icon = specialty.icon;
          return (
            <button
              key={specialty.id}
              onClick={() => handleSpecialtySelect(specialty.id)}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center space-y-4"
            >
              <Icon className="w-12 h-12 text-blue-600" />
              <span className="text-lg font-medium">{specialty.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}