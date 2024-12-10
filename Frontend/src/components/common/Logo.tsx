import React from 'react';
import { GraduationCap } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <GraduationCap className={`text-blue-600 ${iconSizes[size]}`} />
      <span className={`font-bold ${sizes[size]} text-gray-900`}>
        Uni<span className="text-blue-600">Buddy</span>
      </span>
    </div>
  );
}