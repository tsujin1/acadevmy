import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, GraduationCap } from 'lucide-react';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    // FIX APPLIED HERE:
    // 1. Removed 'justify-start' and 'sm:justify-center' from parent.
    // 2. Added 'my-auto' to the inner container.
    // This effectively centers the form vertically if there is space, 
    // but lets it scroll naturally if the screen is small (like when keyboard is open).
    <div className="flex min-h-screen w-full flex-col bg-white px-4 py-10 sm:px-8 sm:py-12">
      <motion.div
        className="mx-auto my-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div className="flex flex-col space-y-2 text-center" variants={itemVariants}>
          {/* Mobile Logo */}
          <motion.div
            className="lg:hidden flex justify-center mb-4"
            variants={itemVariants}
          >
            <motion.div
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
            >
              <GraduationCap className="h-6 w-6" />
            </motion.div>
          </motion.div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500">
            Enter your credentials to access your account
          </p>
        </motion.div>

        <motion.div className="grid gap-6" variants={itemVariants}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                className="p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md"
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {error}
              </motion.div>
            )}

            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-11 bg-white"
              />
            </motion.div>

            <motion.div className="space-y-2" variants={itemVariants}>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-blue-600 hover:text-blue-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-11 bg-white"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 font-medium shadow-sm transition-all">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </motion.div>
          </form>

          <motion.div className="relative my-2" variants={itemVariants}>
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-500 font-medium">
                Or continue with
              </span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              onClick={() => navigate('/')}
              className="w-full h-11 border-slate-200 hover:bg-slate-50 hover:text-slate-900 font-medium"
            >
              Continue as Guest
            </Button>
          </motion.div>
        </motion.div>

        <motion.p
          className="px-8 text-center text-sm text-slate-500"
          variants={itemVariants}
        >
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-500 hover:underline underline-offset-4"
          >
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};