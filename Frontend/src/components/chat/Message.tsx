import React from 'react';
import { User } from 'lucide-react';

interface MessageProps {
  content: string;
  isUser: boolean;
  timestamp: string;
}

export function Message({ content, isUser, timestamp }: MessageProps) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[80%]`}>
        <div className="flex-shrink-0 mx-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-500" />
          </div>
        </div>
        <div
          className={`px-4 py-2 rounded-lg ${
            isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
          }`}
        >
          <p className="text-sm">{content}</p>
          <span className="text-xs opacity-75 mt-1 block">{timestamp}</span>
        </div>
      </div>
    </div>
  );
}