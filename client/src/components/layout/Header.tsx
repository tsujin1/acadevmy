import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MobileNav } from './MobileNav';
import { GraduationCap } from 'lucide-react';

export const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/mentors', label: 'All Mentors' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact Us' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex w-full h-16 items-center justify-between px-4">

        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group transition-opacity hover:opacity-90">
          {/* Logo Icon Container */}
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          {/* Text Logo */}
          <span className="hidden md:inline text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            acadevmy
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${isActive(item.path)
                ? 'text-blue-600 font-semibold'
                : 'text-slate-600'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Desktop Login Button */}
          <div className="hidden md:block">
            <Button
              asChild
              className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all hover:shadow-md"
            >
              <Link to="/login">Login</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
};