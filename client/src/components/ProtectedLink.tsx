import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginAlertDialog } from '@/components/LoginAlertDialog';

interface ProtectedLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const ProtectedLink = ({ to, children, className, onClick }: ProtectedLinkProps) => {
  const { isAuthenticated } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setIsDialogOpen(true);
      // Still call onClick to allow parent handlers (like closing mobile menu)
      if (onClick) {
        onClick();
      }
      return;
    }

    if (onClick) {
      onClick();
    }
  };

  return (
    <>
      <Link to={to} className={className} onClick={handleClick}>
        {children}
      </Link>
      <LoginAlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
};

