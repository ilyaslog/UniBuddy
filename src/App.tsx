import React, { useState } from 'react';
import { MessageCircle, Upload, LogOut, Plus, List, Send } from 'lucide-react';
import SpecialtySelection from './components/SpecialtySelection';
import Quiz from './components/Quiz';
import Summary from './components/Summary';

type View = 'login' | 'sessions' | 'specialty' | 'chat';
type Tab = 'chat' | 'quiz' | 'summary';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface Session {
  session_id: string;
  timestamp: string;
  filier: string;  // Updated to use 'filier'
}

function App() {
  const [username, setUsername] = useState<string>('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [view, setView] = useState<View>('login');
  const [specialty, setSpecialty] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Function to set the username
  const handleSetUsername = async () => {
    if (!username.trim()) {
      alert('Please enter a username.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/set_username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        setView('sessions');
      } else {
        const result = await response.json();
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Connection error. Please try again.');
    }
  };

  // Function to select a specialty and start a session
  const handleSpecialtySelect = async (selectedSpecialty: string) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/start_session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, specialty: selectedSpecialty }),
      });

      const result = await response.json();
      if (response.ok && result.session_id) {
        setSessionId(result.session_id);
        setSpecialty(selectedSpecialty);
        setView('chat');
        setMessages([{
          role: 'system',
          content: `Specialty selected: ${selectedSpecialty}. How can I help you?`
        }]);
      } else {
        alert('Error: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      alert('An error occurred while starting the session.');
    }
  };

  // Function to handle file upload
  const handleFileUpload = async () => {
    if (fileInputRef.current?.files?.length) {
      const file = fileInputRef.current.files[0];
      const base64 = await new Promise<string | null>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result?.toString().split(',')[1] || null);
        reader.readAsDataURL(file);
      });
      setFileBase64(base64);
      setFileName(file.name);
    }
  };

  // Function to send a message in the chat
  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !fileBase64) return;

    const currentMessage = inputMessage;
    setInputMessage('');
    setFileBase64(null);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    // Optimistically add user message
    setMessages(prev => [...prev, { role: 'user', content: currentMessage }]);

    try {
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          session_id: sessionId,
          message: currentMessage,
          file: fileBase64,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessages(result.conversation);
      } else {
        alert('Error: ' + result.error);
        // Revert optimistic update on error
        setMessages(prev => prev.slice(0, -1));
      }
    } catch (error) {
      alert('Connection error. Please try again.');
      // Revert optimistic update on error
      setMessages(prev => prev.slice(0, -1));
    }
  };

  // Function to log out and reset everything
  const handleLogout = () => {
    setUsername('');
  setSessionId(null);
  setMessages([]);
  setInputMessage('');
  setSpecialty(null);
  setView('login');
  setActiveTab('chat');
  setSessions([]);
  setFileBase64(null);
  setFileName(null);
  };

  // Function to load sessions
  const handleLoadSessions = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/list_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();
      if (response.ok && result.sessions) {
        setSessions(result.sessions);  // Update sessions state
      } else {
        alert('Error: ' + (result.error || 'Unable to load sessions.'));
      }
    } catch (error) {
      alert('An error occurred while fetching sessions.');
    }
  };

  // Function to load a session and its discussion
  const handleLoadSession = async (sessionId: string) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, session_id: sessionId, message: '' }),
      });

      const result = await response.json();
      if (response.ok) {
        setSessionId(sessionId);
        setMessages(result.conversation);
        setSpecialty(result.specialty);
        setView('chat');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('An error occurred while loading the session.');
    }
  };

  // Render the login view
  const renderLoginView = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">UniBuddy</h1>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSetUsername()}
          />
          <button
            onClick={handleSetUsername}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Learning
          </button>
        </div>
      </div>
    </div>
  );

  // Render the sessions view
  const renderSessionsView = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Study Sessions</h2>
        <div className="space-y-4">
          <button
            onClick={() => setView('specialty')}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} /> New Session
          </button>
          <button
            onClick={handleLoadSessions}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <List size={20} /> Load Sessions
          </button>
          {sessions.length > 0 && (
            <div className="mt-6">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Previous Sessions</h3>
            <ul className="space-y-4">
              {sessions.map((session) => (
                <li
                  key={session.session_id}
                  className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 ease-in-out transform hover:scale-105"
                >
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">
                      {new Date(session.timestamp).toLocaleString()}
                    </span>
                    <span className="text-lg font-semibold text-gray-800">
                      Specialty: <span className="text-blue-600">{session.filier}</span>
                    </span>
                  </div>
                  <button
                    onClick={() => handleLoadSession(session.session_id)}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-300"
                  >
                    Load
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
    </div>
  );

  // Render the chat view
  const renderChatView = () => (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex items-center justify-between p-4 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <MessageCircle className="text-blue-600" />
          <h1 className="text-xl font-semibold">UniBuddy - {specialty?.toUpperCase()}</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>

      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 p-4 text-center ${activeTab === 'chat' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 p-4 text-center ${activeTab === 'quiz' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
            >
              Quiz
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex-1 p-4 text-center ${activeTab === 'summary' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
            >
              Summary
            </button>
          </div>

          <div className="p-4">
            {activeTab === 'chat' && (
              <>
                <div className="h-[calc(100vh-300px)] overflow-y-auto space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : message.role === 'assistant'
                            ? 'bg-white shadow-md'
                            : 'bg-gray-200 text-center w-full'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={fileName ? `File: ${fileName}` : "Type your message..."}
                    className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 text-gray-600 hover:text-gray-700 transition-colors"
                  >
                    <Upload size={24} />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send size={24} />
                  </button>
                </div>
              </>
            )}
            {activeTab === 'quiz' && sessionId && username && (
              <Quiz sessionId={sessionId} username={username} />
            )}
            {activeTab === 'summary' && sessionId && username && (
              <Summary sessionId={sessionId} username={username} />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  switch (view) {
    case 'login':
      return renderLoginView();
    case 'sessions':
      return renderSessionsView();
    case 'specialty':
      return <SpecialtySelection onSelect={handleSpecialtySelect} />;
    case 'chat':
      return renderChatView();
    default:
      return renderLoginView();
  }
}

export default App;