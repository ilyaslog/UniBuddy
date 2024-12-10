import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export function LoginForm() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    navigate('/specialty');
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col items-center mb-6">
        <Logo size="lg" className="mb-6" />
        <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
        <p className="text-gray-600 text-center mt-2">Sign in to continue your learning journey</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          id="email"
          label="Email"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          required
          fullWidth
        />
        <Input
          type="password"
          id="password"
          label="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
          fullWidth
        />
        <Button type="submit" fullWidth>
          Sign In
        </Button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}
