import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PageContainer } from './components/layout/PageContainer';
import { LoadingScreen } from './components/common/LoadingScreen';
import { useMinimumLoadingTime } from './hooks/useMinimumLoadingTime';

// Lazy load components
const LoginForm = lazy(() => import('./components/auth/LoginForm').then(module => ({ default: module.LoginForm })));
const SignupForm = lazy(() => import('./components/auth/SignupForm').then(module => ({ default: module.SignupForm })));
const SpecialtySelector = lazy(() => import('./components/specialties/SpecialtySelector').then(module => ({ default: module.SpecialtySelector })));
const ChatInterface = lazy(() => import('./components/chat/ChatInterface').then(module => ({ default: module.ChatInterface })));

function AppContent() {
  const isLoading = useMinimumLoadingTime(2000); // 2 seconds minimum loading time

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <PageContainer>
      <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/specialty" element={<SpecialtySelector />} />
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </PageContainer>
  );
}

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <AppContent />
      </Suspense>
    </Router>
  );
}

export default App;