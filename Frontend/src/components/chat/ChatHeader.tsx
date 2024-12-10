import React from 'react';
import { Settings, User } from 'lucide-react';

export function ChatHeader() {
  return (
    <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="font-semibold">AI Assistant</h2>
          <span className="text-sm text-green-500">Online</span>
        </div>
      </div>
      <button className="p-2 hover:bg-gray-100 rounded-full">
        <Settings className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}