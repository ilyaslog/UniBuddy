import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export function SignupForm() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    navigate('/login');
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col items-center mb-6">
        <Logo size="lg" className="mb-6" />
        <h2 className="text-2xl font-bold text-center">Create Account</h2>
        <p className="text-gray-600 text-center mt-2">Join UniBuddy and start learning today</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          id="name"
          label="Full Name"
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          required
          fullWidth
        />
        <Input
          type="email"
          id="email"
          label="Email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          required
          fullWidth
        />
        <Input
          type="password"
          id="password"
          label="Password"
          value={userData.password}
          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          required
          fullWidth
        />
        <Input
          type="password"
          id="confirmPassword"
          label="Confirm Password"
          value={userData.confirmPassword}
          onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
          required
          fullWidth
        />
        <Button type="submit" fullWidth>
          Sign Up
        </Button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}