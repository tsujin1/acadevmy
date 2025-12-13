import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { GraduationCap } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SignUpForm } from '@/components/auth/SignUpForm';
import avatarImage from '@/assets/steven-avatar.png';

export const Register = () => {
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
        ease: [0.22, 1, 0.36, 1] as const,
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
        ease: [0.22, 1, 0.36, 1] as const,
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
        ease: [0.22, 1, 0.36, 1] as const,
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
    <div className="w-full min-h-screen lg:h-screen lg:grid lg:grid-cols-2 lg:overflow-hidden bg-white">
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
        <motion.div
          className="mt-48 flex flex-col items-start max-w-lg space-y-8"
          variants={itemVariants}
        >
          <motion.div variants={avatarVariants}>
            <Avatar className="h-28 w-28 border-4 border-white shadow-xl ring-1 ring-slate-100">
              <AvatarImage
                src={avatarImage}
                alt="Steven Spielberg"
                className="h-full w-full object-cover"
              />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-2xl">SS</AvatarFallback>
            </Avatar>
          </motion.div>

          <motion.blockquote
            className="space-y-2 text-left"
            variants={itemVariants}
          >
            <p className="text-2xl font-medium leading-relaxed text-slate-900">
              &ldquo;The delicate balance of mentoring someone is not creating them in your own image, but giving them the opportunity to create themselves.&rdquo;
            </p>
          </motion.blockquote>
        </motion.div>

        {/* 3. Footer: Name & Title  */}
        <motion.div
          className="mt-auto flex flex-col items-start shrink-0"
          variants={itemVariants}
        >
          <div className="font-bold text-slate-900 text-lg">Steven Spielberg</div>
          <div className="text-sm font-medium text-slate-500">American filmmaker</div>
        </motion.div>
      </motion.div>

      {/* --- RIGHT SIDE (Form) --- */}
      {/* FIX 3: Wrapped SignUpForm in a div that handles scrolling on desktop.
                 'lg:overflow-y-auto' allows the form to scroll while the left side stays still. */}
      <motion.div
        className="w-full h-full lg:overflow-y-auto bg-white"
        variants={rightSideVariants}
        initial="hidden"
        animate="visible"
      >
        <SignUpForm />
      </motion.div>
    </div>
  );
};
