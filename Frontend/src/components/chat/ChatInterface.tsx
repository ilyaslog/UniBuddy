import React, { useState } from 'react';
import { Send, Plus, Paperclip, Mic } from 'lucide-react';
import { Message } from './Message';
import { ChatHeader } from './ChatHeader';
import { ChatSidebar } from './ChatSidebar';

interface ChatMessage {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: string;
}

export function ChatInterface() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      content: "Hello! How can I assist you today?",
      isUser: false,
      timestamp: "10:00 AM"
    },
    {
      id: 2,
      content: "I have a question about my studies.",
      isUser: true,
      timestamp: "10:01 AM"
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: messages.length + 1,
        content: message,
        isUser: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <ChatSidebar />
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <Message
              key={msg.id}
              content={msg.content}
              isUser={msg.isUser}
              timestamp={msg.timestamp}
            />
          ))}
        </div>
        <div className="border-t p-4 bg-white">
          <form onSubmit={handleSubmit} className="flex items-center space-x-4">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              className="flex-1 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              type="submit"
              className="p-3 text-white bg-blue-600 rounded-full hover:bg-blue-700"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}