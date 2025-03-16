import React, {JSX} from 'react';
import { Navigate } from 'react-router-dom';
import {useAuth} from "./AuthContext";

interface ProtectedRouteProps {
    children: JSX.Element;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const auth = useAuth();
    if (!auth.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
}