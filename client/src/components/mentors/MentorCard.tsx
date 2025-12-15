import type { Mentor } from '@/types/mentor';
import { getInitials, formatPrice } from '@/utils/mentorUtils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';

interface MentorCardProps {
  mentor: Mentor;
  onViewProfile?: (mentor: Mentor) => void;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

const MentorCard = ({ mentor, onViewProfile }: MentorCardProps) => {
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    averageRating: mentor.rating,
    totalReviews: mentor.reviewCount
  });

  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        const response = await axiosInstance.get(`/reviews/mentor/${mentor.id}`);
        const stats = response.data.stats;
        setReviewStats({
          averageRating: stats.averageRating || 0,
          totalReviews: stats.totalReviews || 0
        });
      } catch {
        // Use existing mentor data on error
      }
    };

    fetchReviewStats();
  }, [mentor.id]);

  const handleViewProfile = () => onViewProfile?.(mentor);

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-start space-x-4">
        <div className="relative shrink-0">
          {mentor.image ? (
            <motion.img
              src={mentor.image}
              alt={mentor.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}

          <div 
            className={`w-16 h-16 rounded-full bg-linear-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white text-xl font-bold ${
              mentor.image ? 'hidden' : 'flex'
            }`}
          >
            {getInitials(mentor.name)}
          </div>

        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{mentor.name || 'Mentor'}</h3>
              <p className="text-sm text-gray-600">{mentor.title || 'Professional'}</p>
            </div>
            <motion.span 
              className="bg-gray-900 text-white px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ml-2 shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              {formatPrice(mentor.hourlyRate)}
            </motion.span>
          </div>

          {(mentor.company || mentor.experience) && (
            <div className="flex items-center text-xs text-gray-500 mb-3">
              {mentor.company && <span>{mentor.company}</span>}
              {mentor.company && mentor.experience && <span className="mx-2">•</span>}
              {mentor.experience && <span>{mentor.experience} years experience</span>}
            </div>
          )}

          <div className="flex items-center space-x-1 mb-3">
            <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-semibold text-gray-900">{reviewStats.averageRating.toFixed(1)}</span>
            <span className="text-gray-500 text-sm">({reviewStats.totalReviews})</span>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {mentor.bio || 'No bio available yet.'}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {mentor.skills && mentor.skills.length > 0 ? (
              <>
                {mentor.skills.slice(0, 3).map((skill, index) => (
                  <motion.span
                    key={skill}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {skill}
                  </motion.span>
                ))}
                {mentor.skills.length > 3 && (
                  <span className="px-3 py-1.5 bg-gray-50 text-gray-500 text-xs font-medium rounded-md">
                    +{mentor.skills.length - 3} more
                  </span>
                )}
              </>
            ) : (
              <span className="px-3 py-1.5 bg-gray-50 text-gray-400 text-xs font-medium rounded-md italic">
                Skills coming soon
              </span>
            )}
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to={`/mentor/${mentor.id}`}
              onClick={handleViewProfile}
              className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 font-semibold text-sm text-center block focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              View Profile
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MentorCard;