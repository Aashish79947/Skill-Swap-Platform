import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // Store token and redirect to dashboard
      localStorage.setItem('token', token);

      // Fetch user data
      fetch('http://localhost:8000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(userData => {
          login(token, userData);
          navigate('/dashboard');
        })
        .catch(err => {
          console.error('Error fetching user data:', err);
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing Google Sign-In...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;