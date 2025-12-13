import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export const LoginBanner = () => {
  const { isAuthenticated } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isAuthenticated || isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="sticky top-16 z-40 w-full bg-blue-600 text-white shadow-md overflow-hidden"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3 gap-4">

              {/* Left Side: Icon + Text */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-1.5 bg-white/10 rounded-lg shrink-0">
                  <Sparkles className="h-4 w-4 text-blue-100" />
                </div>
                <p className="text-sm font-medium text-blue-50 truncate sm:whitespace-normal">
                  <span className="font-bold text-white">Unlock full access.</span>
                  <span className="hidden sm:inline"> Sign in to connect with mentors and track your progress.</span>
                  <span className="sm:hidden"> Sign in to connect with mentors.</span>
                </p>
              </div>

              {/* Right Side: Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <Button
                  asChild
                  size="sm"
                  variant="secondary"
                  className="h-8 px-4 text-xs font-semibold bg-white text-blue-600 hover:bg-blue-50 border-0"
                >
                  <Link to="/login" className="flex items-center gap-1.5">
                    Log In <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>

                <button
                  onClick={() => setIsDismissed(true)}
                  className="p-1 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};