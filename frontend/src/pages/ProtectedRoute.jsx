// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../store/user';
import { useEffect, useState } from 'react';

// Basic Protected Route - requires any authenticated user
export const ProtectedRoute = ({ redirectPath = '/login' }) => {
  const { loggedInUser, loadUserFromToken } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if we have a token but no user (e.g. after page refresh)
    if (!loggedInUser && localStorage.getItem('token')) {
      loadUserFromToken();
    }
    setIsLoading(false);
  }, [loggedInUser, loadUserFromToken]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If not logged in, redirect to login page
  if (!loggedInUser) {
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated, render the child routes
  return <Outlet />;
};

// Role-based Protected Route - requires user with specific role(s)
export const RoleProtectedRoute = ({ 
  allowedRoles, // Array of roles that can access this route
  redirectPath = '/restricted' 
}) => {
  const { loggedInUser, loadUserFromToken } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loggedInUser && localStorage.getItem('token')) {
      loadUserFromToken();
    }
    setIsLoading(false);
  }, [loggedInUser, loadUserFromToken]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If not logged in, redirect to login
  if (!loggedInUser) {
    return <Navigate to="/users/login" replace />;
  }

  // Check if user role is allowed
  const hasAllowedRole = allowedRoles.includes(loggedInUser.role);
  
  if (!hasAllowedRole) {
    // User doesn't have required role
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and has allowed role
  return <Outlet />;
};