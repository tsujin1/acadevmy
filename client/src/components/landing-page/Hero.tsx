import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthButtons from '@/components/ui/AuthButtons/AuthButtons';
import { AuthContext } from '@/contexts/AuthContext';

const Hero = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const isAuthenticated = !!authContext?.user;

  return (
    <section className="relative bg-linear-to-br from-gray-950 via-gray-900 to-gray-800 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 md:pt-24">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 items-end gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.2, duration: 0.8 }}
        >
          <div className="text-white pb-16 md:pb-34">
            <motion.p
              className="inline-block bg-white/10 text-sm font-medium px-3 py-1 rounded-full mb-5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Simplifying Mentorship
            </motion.p>

            <motion.h1
              className="text-5xl md:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Your Everyday <span className="text-gray-300">Mentorship</span> Companion
            </motion.h1>

            <motion.p
              className="text-lg text-gray-300 mb-8 max-w-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Connect with experienced mentors who can guide your growth, career, and skills in one simple platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {!isAuthenticated ? (
                <AuthButtons variant="hero" />
              ) : (
                <div className="flex gap-4">
                  <motion.button
                    onClick={() => navigate('/mentors')}
                    className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Browse Mentors
                  </motion.button>
                  <motion.button
                    onClick={() => navigate('/profile')}
                    className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    My Profile
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>

          <motion.div
            className="flex justify-center md:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.img
              src="/hero-bg.png"
              alt="Mentorship preview"
              className="w-full max-w-[400px] md:max-w-[500px] h-auto object-cover object-bottom grayscale-75 hover:grayscale-0 transition-all duration-300"
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;