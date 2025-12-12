import { Link } from 'react-router-dom';
import { GraduationCap, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* --- Main 3-Column Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 mb-12">

          {/* Column 1: Brand Context (Left) */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                acadevmy
              </span>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              Escape tutorial hell. We connect aspiring developers with senior engineers for 1-on-1 mentorship, code reviews, and career guidance.
            </p>
          </div>

          {/* Column 2: Quick Links (Middle) */}
          {/* Added md:justify-self-center to center this block */}
          <div className="md:justify-self-center">
            <h3 className="font-bold text-slate-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/mentors" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                  Find a Mentor
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                  Log In
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact (Right) */}
          {/* Added md:justify-self-end to right-align this block */}
          <div className="md:justify-self-end">
            <h3 className="font-bold text-slate-900 mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600">
                  hello@acadevmy.com
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600">
                  San Francisco, CA<br />
                  Remote First Company
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* --- Bottom Bar --- */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {currentYear} Acadevmy. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};