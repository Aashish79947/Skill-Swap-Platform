import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthError = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Failed</h1>
        <p className="text-gray-600 mb-8">
          There was an error signing you in with Google. Please try again.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default AuthError;