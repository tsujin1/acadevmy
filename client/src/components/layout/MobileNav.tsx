import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedLink } from '@/components/ProtectedLink';

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/mentors', label: 'All Mentors' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact Us' },
    ...(isAuthenticated ? [{ path: '/dashboard', label: 'Dashboard' }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-xl animate-in slide-in-from-top-5 duration-200 z-50">
          <nav className="flex flex-col p-4 space-y-2">
            {navItems.map((item) => {
              // Only protect /mentors route, make /about and /contact accessible
              const isProtected = item.path === '/mentors';
              const Component = isProtected && !isAuthenticated ? ProtectedLink : Link;
              
              return (
                <Component
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-all ${isActive(item.path)
                    ? 'bg-blue-50 text-blue-600 font-semibold' /* Light blue background for active state */
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  {item.label}
                </Component>
              );
            })}

            {/* Mobile Auth Button */}
            <div className="pt-4 mt-2 border-t border-slate-100">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-slate-600 mb-2">
                    Welcome, {user?.firstName}
                  </div>
                  <Button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  asChild
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                >
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};
