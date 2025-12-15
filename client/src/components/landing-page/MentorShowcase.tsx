import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../services/axiosInstance'; 
import { userService } from '@/services/userService';
import AuthButtons from '@/components/ui/AuthButtons/AuthButtons';
import Card from '@/components/ui/Card/Card';
import { mapUserToMentor } from '@/utils/mentorUtils';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

type ServiceUser = import('@/services/authService').User;
type Mentor = import('@/types/mentor').Mentor;

type LiveMentor = Mentor & {
  liveRating: number;
  liveReviewCount: number;
};

const fetchMentorReviewStats = async (mentorId: string) => {
  try {
    const response = await axiosInstance.get(`/reviews/mentor/${mentorId}`);
    const stats = response.data.stats;
    return {
      averageRating: stats.averageRating || 0,
      totalReviews: stats.totalReviews || 0,
    };
  } catch {
    return { averageRating: 0, totalReviews: 0 };
  }
};

const MentorShowcase = () => {
  const [mentors, setMentors] = useState<LiveMentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAuthenticated = !!user;

  useEffect(() => {
    const fetchAndFilterMentors = async () => {
      try {
        setLoading(true);
        // Only fetch a limited number of mentors for landing page (performance optimization)
        const response = await userService.getMentors(20, 1); // Limit to 20 mentors, page 1
        // Handle both old format (array) and new format (object with mentors array)
        const usersData = Array.isArray(response) ? response : (response as any).mentors || [];
        const initialMentors: Mentor[] = usersData.map((user: ServiceUser) => mapUserToMentor(user));
        
        // Only fetch review stats for the mentors we'll actually display
        const reviewStatsPromises = initialMentors.slice(0, 20).map(mentor => fetchMentorReviewStats(mentor.id));
        const allStats = await Promise.all(reviewStatsPromises);
        
        const liveMentors: LiveMentor[] = initialMentors
          .slice(0, 20) // Limit to first 20 for review stats
          .map((mentor, index) => ({
            ...mentor,
            liveRating: allStats[index]?.averageRating || 0,
            liveReviewCount: allStats[index]?.totalReviews || 0,
          }))
          .filter(mentor => mentor.liveRating >= 4.0);

        const shuffledMentors = liveMentors.sort(() => 0.5 - Math.random());
        setMentors(shuffledMentors.slice(0, 8));
      } catch {
        setError('Failed to load mentors with current ratings');
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterMentors();
  }, []);

  const handleViewProfile = (e: React.MouseEvent, mentorId: string) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login', { state: { from: `/mentor/${mentorId}` } });
    }
  };

  if (loading) {
    return (
      <section className="relative bg-white py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-4" />
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4" />
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative bg-white py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 inline-block">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.p 
            className="inline-block bg-gray-100 text-gray-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Expert Guidance
          </motion.p>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Meet Our Mentors
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Learn from professionals who have already walked the path.
          </motion.p>
        </motion.div>

        <AnimatePresence>
          {mentors.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 items-start"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.1 }}
            >
              {mentors.map((mentor) => (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Link
                    to={`/mentor/${mentor.id}`}
                    onClick={(e) => handleViewProfile(e, mentor.id)}
                    className="block h-full focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl"
                  >
                    <Card 
                      mentor={{
                        ...mentor,
                        rating: mentor.liveRating,
                        reviewCount: mentor.liveReviewCount,
                      } as Mentor}
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gray-500 text-lg">No highly-rated mentors available at the moment.</p>
              <p className="text-gray-400 text-sm mt-2">Be the first to join as a mentor!</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AuthButtons className="justify-center" variant="mentor" />
        </motion.div>
      </div>
    </section>
  );
};

export default MentorShowcase;