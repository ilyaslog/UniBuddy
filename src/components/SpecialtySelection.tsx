import React from 'react';
import { Bot, Code, Shield, Cloud, Database, Smartphone } from 'lucide-react';

interface SpecialtySelectionProps {
  onSelect: (specialty: string) => void;
}

export default function SpecialtySelection({ onSelect }: SpecialtySelectionProps) {
  const specialties = [
    {
      id: 'ai',
      icon: <Bot className="w-12 h-12 text-blue-600" />,
      title: 'AI & Machine Learning',
      description: 'Artificial Intelligence, Machine Learning, and Deep Learning'
    },
    {
      id: 'software',
      icon: <Code className="w-12 h-12 text-blue-600" />,
      title: 'Software Engineering',
      description: 'Software Development, Design Patterns, and Best Practices'
    },
    {
      id: 'cybersecurity',
      icon: <Shield className="w-12 h-12 text-blue-600" />,
      title: 'Cybersecurity',
      description: 'Network Security, Cryptography, and Ethical Hacking'
    },
    {
      id: 'cloud',
      icon: <Cloud className="w-12 h-12 text-blue-600" />,
      title: 'Cloud Computing',
      description: 'Cloud Architecture, DevOps, and Distributed Systems'
    },
    {
      id: 'bigdata',
      icon: <Database className="w-12 h-12 text-blue-600" />,
      title: 'Big Data',
      description: 'Data Analytics, Data Engineering, and Data Science'
    },
    {
      id: 'mobile',
      icon: <Smartphone className="w-12 h-12 text-blue-600" />,
      title: 'Mobile Development',
      description: 'iOS, Android, and Cross-platform Development'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-center mb-2 text-blue-600">Choose Your Path</h2>
        <p className="text-center text-gray-600 mb-8">
          Select your computer science specialty to begin your learning journey
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((specialty) => (
            <button
              key={specialty.id}
              onClick={() => onSelect(specialty.id)}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="mb-4">{specialty.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{specialty.title}</h3>
              <p className="text-sm text-gray-600">{specialty.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}