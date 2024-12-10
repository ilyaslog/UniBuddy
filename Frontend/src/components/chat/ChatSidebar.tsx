import React from 'react';
import { MessageSquare, Clock, Bookmark, HelpCircle } from 'lucide-react';

export function ChatSidebar() {
  return (
    <div className="w-64 bg-gray-50 border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Chat History</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {['Recent Chats', 'Saved Messages', 'Help & Support'].map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              {index === 0 && <MessageSquare className="w-5 h-5 text-gray-600" />}
              {index === 1 && <Bookmark className="w-5 h-5 text-gray-600" />}
              {index === 2 && <HelpCircle className="w-5 h-5 text-gray-600" />}
              <span className="text-sm">{item}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}