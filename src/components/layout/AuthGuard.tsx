import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ora-bg-primary">
        <Card className="p-8 bg-ora-surface-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ora-primary mx-auto"></div>
          <p className="text-ora-text-medium text-center mt-4">Loading...</p>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};