import React from 'react';
import { Logo } from './Logo';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <div className="transform-gpu animate-bounce mb-8">
        <Logo size="lg" />
      </div>
      <div className="relative w-48">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-loading-bar transform-gpu" />
        </div>
      </div>
      <p className="mt-4 text-gray-600 animate-pulse">Loading your learning experience...</p>
    </div>
  );
}