import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCookie } from '../helpers/cookies';

export const ProtectedRoute: React.FC = () => {
  const token = getCookie('token');

  // If no token exists, redirect to login page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If token exists, render matching child routes (dashboard layouts and child pages)
  return <Outlet />;
};
