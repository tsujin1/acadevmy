import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, GraduationCap, Mail, CheckCircle, ArrowLeft } from 'lucide-react';

// Define the error shape
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setIsSuccess(true);
    } catch (err) {
      // Cast the error to our interface
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Failed to send reset email. Please try again.');
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
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.3,
      },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as const,
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
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
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <motion.div
        className="w-full max-w-[400px] space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo Header */}
        <motion.div
          className="flex flex-col items-center text-center space-y-2"
          variants={itemVariants}
        >
          <motion.div
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg mb-2"
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
          <span className="text-xl font-bold tracking-tight text-slate-900">Acadevmy</span>
        </motion.div>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            // Success State
            <motion.div
              key="success"
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center"
              variants={successVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 12,
                  delay: 0.2,
                }}
              >
                <CheckCircle className="h-7 w-7 text-green-600" />
              </motion.div>
              <h1 className="text-xl font-bold text-slate-900 mb-2">Check your email</h1>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                We've sent a password reset link to<br />
                <span className="font-semibold text-slate-900">{email}</span>
              </p>

              <div className="space-y-4">
                <Button asChild variant="outline" className="w-full border-slate-200 h-11">
                  <Link to="/login">
                    Back to Sign In
                  </Link>
                </Button>
                <p className="text-xs text-slate-400">
                  Did not receive the email? Check your spam folder or try again.
                </p>
              </div>
            </motion.div>
          ) : (
            // Form State
            <motion.div
              key="form"
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div className="text-center mb-8" variants={itemVariants}>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Forgot password?
                </h1>
                <p className="text-sm text-slate-500 mt-2">
                  No worries, we'll send you reset instructions.
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md text-center"
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      autoCapitalize="none"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="pl-10 h-11 bg-slate-50/50 focus:bg-white transition-colors"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 h-11 font-medium shadow-sm">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending link...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </motion.div>
              </form>

              <motion.div className="mt-6 text-center" variants={itemVariants}>
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign In
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};