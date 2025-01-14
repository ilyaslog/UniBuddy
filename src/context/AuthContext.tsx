import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  username: string | null;
  sessionId: string | null;
  specialty: string | null;
  setUsername: (username: string) => void;
  setSessionId: (sessionId: string) => void;
  setSpecialty: (specialty: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [specialty, setSpecialty] = useState<string | null>(null);

  const logout = () => {
    setUsername(null);
    setSessionId(null);
    setSpecialty(null);
  };

  return (
    <AuthContext.Provider value={{
      username,
      sessionId,
      specialty,
      setUsername,
      setSessionId,
      setSpecialty,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};