import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { GraduationCap } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoginForm } from '@/components/auth/LoginForm';
import avatarImage from '@/assets/justin-avatar.png';

export const Login = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const leftSideVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const rightSideVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        delay: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  const avatarVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
        delay: 0.3,
      },
    },
  };

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2 overflow-hidden bg-white">
      {/* --- LEFT SIDE (White Theme) --- */}
      <motion.div
        className="hidden lg:flex flex-col bg-slate-50 border-r border-slate-200 p-10 xl:p-12 h-full"
        variants={leftSideVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 1. Header: Logo */}
        <motion.div
          className="flex items-center text-lg font-bold tracking-tight text-slate-900 shrink-0"
          variants={itemVariants}
        >
          <motion.div
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white mr-2 shadow-sm"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.4,
            }}
          >
            <GraduationCap className="h-5 w-5" />
          </motion.div>
          Acadevmy
        </motion.div>

        {/* 2. Main: Avatar & Quote */}
        {/* CHANGED: Increased from mt-24 to mt-48 to lower it significantly without centering it */}
        <motion.div
          className="mt-48 flex flex-col items-start max-w-lg space-y-8"
          variants={itemVariants}
        >
          <motion.div variants={avatarVariants}>
            <Avatar className="h-28 w-28 border-4 border-white shadow-xl ring-1 ring-slate-100">
              <AvatarImage
                src={avatarImage}
                alt="Justin Dimaandal"
                className="h-full w-full object-cover"
              />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-2xl">JD</AvatarFallback>
            </Avatar>
          </motion.div>

          <motion.blockquote
            className="space-y-2 text-left"
            variants={itemVariants}
          >
            <p className="text-2xl font-medium leading-relaxed text-slate-900">
              &ldquo;Mentorship is the cheat code to a successful engineering career.
              We built this platform to help you skip the mistakes and build real software faster.&rdquo;
            </p>
          </motion.blockquote>
        </motion.div>

        {/* 3. Footer: Name & Title (Pinned to Bottom) */}
        <motion.div
          className="mt-auto flex flex-col items-start shrink-0"
          variants={itemVariants}
        >
          <div className="font-bold text-slate-900 text-lg">Justin Dimaandal</div>
          <div className="text-sm font-medium text-slate-500">Founder & Developer of Acadevmy</div>
        </motion.div>
      </motion.div>

      {/* --- RIGHT SIDE (Form) --- */}
      <motion.div
        variants={rightSideVariants}
        initial="hidden"
        animate="visible"
      >
        <LoginForm />
      </motion.div>
    </div>
  );
};