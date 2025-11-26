import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PiGraduationCapBold, PiListBold, PiXBold } from 'react-icons/pi';
import AuthButtons from '@/components/ui/AuthButtons/AuthButtons';
import  UserMenu  from '@/components/ui/UserMenu/UserMenu';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  name: string;
  path: string;
}

const navItems: NavItem[] = [
  { name: 'Home', path: '/' },
  { name: 'All Mentors', path: '/mentors' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="flex items-center space-x-2">
            <PiGraduationCapBold className="h-6 w-6 text-black" />
            <span className="text-2xl font-bold text-black">acadevmy</span>
          </Link>
        </motion.div>

        <nav className="hidden md:flex space-x-6">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `transition-colors ${
                    isActive ? 'text-black font-medium' : 'text-gray-600 hover:text-black'
                  }`
                }
              >
                {item.name}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <UserMenu />
            </motion.div>
          ) : (
            <div className="hidden md:block">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <AuthButtons />
              </motion.div>
            </div>
          )}
          
          <motion.button
            className="md:hidden text-black"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <PiXBold className="h-6 w-6" /> : <PiListBold className="h-6 w-6" />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-white shadow-md px-4 flex flex-col space-y-4 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? 'text-black font-medium' : 'text-gray-600'
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </NavLink>
              </motion.div>
            ))}
            {user ? (
              <motion.div 
                className="pt-2 border-t border-gray-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.1, duration: 0.3 }}
              >
                <p className="text-sm text-gray-600 mb-2">Logged in as {user.firstName}</p>
                <Link to="/profile" className="block py-2 text-gray-600">Profile</Link>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.1, duration: 0.3 }}
              >
                <AuthButtons vertical className="space-y-2 py-2" />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;