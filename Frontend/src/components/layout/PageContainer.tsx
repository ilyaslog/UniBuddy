import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="container mx-auto py-8 px-4">
        {children}
      </div>
    </div>
  );
}