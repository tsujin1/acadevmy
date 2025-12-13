import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginAlertDialog } from '@/components/LoginAlertDialog';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setIsDialogOpen(true);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Navigate to="/" replace />
        <LoginAlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </>
    );
  }

  return <>{children}</>;
};

