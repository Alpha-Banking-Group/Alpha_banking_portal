import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    // If no token exists, force redirect to Login
    if (!token) {
        return <Navigate to="/login" />;
    }

    // If token exists, show the page (Dashboard, Customers, etc.)
    return children;
};

export default PrivateRoute;