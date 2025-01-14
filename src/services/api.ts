import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';
const OPENAI_API_KEY = 'openaikey'
// Configure axios defaults for OpenAI
axios.defaults.headers.common['Authorization'] = `Bearer ${OPENAI_API_KEY}`;

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface Quiz {
  questions: {
    question: string;
    options: string[];
    correct: string;
  }[];
}

const api = {
  setUsername: async (username: string) => {
    const response = await axios.post(`${API_URL}/set_username`, { username });
    return response.data;
  },

  startSession: async (username: string, specialty: string) => {
    const response = await axios.post(`${API_URL}/start_session`, { username, specialty });
    return response.data;
  },

  listSessions: async (username: string) => {
    const response = await axios.post(`${API_URL}/list_sessions`, { username });
    return response.data;
  },

  sendMessage: async (username: string, sessionId: string, message: string, file?: File) => {
    let fileBase64 = null;
    if (file) {
      const reader = new FileReader();
      fileBase64 = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result?.toString().split(',')[1] || '');
        reader.readAsDataURL(file);
      });
    }

    const response = await axios.post(`${API_URL}/chat`, {
      username,
      session_id: sessionId,
      message,
      file: fileBase64,
    });
    return response.data;
  },

  generateQuiz: async (sessionId: string, username: string) => {
    const response = await axios.post(`${API_URL}/generate_quiz`, { session_id: sessionId, username });
    return response.data;
  },

  summarizeConversation: async (sessionId: string, username: string) => {
    const response = await axios.post(`${API_URL}/summarize_conversation`, { session_id: sessionId, username });
    return response.data;
  },
};

export default api;