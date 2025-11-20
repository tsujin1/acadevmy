import { motion } from 'framer-motion';
import MentorSearch from '@/components/mentors/MentorSearch';

interface MentorHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const MentorHero = ({ searchQuery, onSearchChange }: MentorHeroProps) => {
  return (
    <motion.section 
      className="relative bg-linear-to-br from-gray-950 via-gray-900 to-gray-800 overflow-hidden flex justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-24 text-center">
        <motion.div 
          className="text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.2, duration: 0.8 }}
        >
          <motion.p 
            className="inline-block bg-white/10 text-sm font-medium px-3 py-1 rounded-full mb-5 backdrop-blur-sm border border-white/20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(255,255,255,0.15)"
            }}
          >
            Expert Guidance
          </motion.p>
          
          <motion.h1 
            className="text-5xl md:text-6xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Find Your Perfect{' '}
            <span className="bg-linear-to-r from-gray-300 to-white bg-clip-text text-transparent">
              Mentor
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Connect with experienced professionals across various fields and specialties. 
            Browse profiles, filter by expertise, and start your mentorship journey today.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.01 }}
          >
            <MentorSearch 
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
            />
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white/5 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      />
    </motion.section>
  );
};

export default MentorHero;