import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '@/services/userService';
import type { User } from '@/services/authService';
import type { Mentor } from '@/types/mentor';
import axiosInstance from '@/services/axiosInstance';
import { getInitials } from '@/utils/mentorUtils';
import { FaStar } from 'react-icons/fa';

interface RelatedMentorsProps {
  currentMentorId: string;
}

interface MentorWithStats extends Mentor {
  rating: number;
  reviewCount: number;
}

const userToMentorAdapter = (user: User): Mentor => {
  let hourlyRateString = '0';
  if (user.hourlyRate !== undefined && user.hourlyRate !== null) {
    const rate = user.hourlyRate;
    hourlyRateString = typeof rate === 'number' ? String(rate) : rate;
  }

  return {
    id: user._id,
    name: `${user.firstName} ${user.lastName}`,
    title: user.title || 'Mentor',
    company: user.company || 'Not specified',
    experience: user.experience || '0 years',
    location: user.location || 'Not specified',
    hourlyRate: hourlyRateString,
    rating: 0,
    reviewCount: 0,
    skills: user.skills || [],
    bio: user.bio || 'No bio available',
    about: user.about || 'No about information available',
    isAvailable: true,
    email: user.email,
    linkedin: user.linkedin || '',
    website: user.website || '',
    reviews: [],
    github: user.github || '',
    twitter: user.twitter || '',
    avatar: user.avatar?.url || ''
  };
};

const RelatedMentors = ({ currentMentorId }: RelatedMentorsProps) => {
  const [relatedMentors, setRelatedMentors] = useState<MentorWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelatedMentors = async () => {
      try {
        setLoading(true);
        const users = await userService.getRelatedMentors(currentMentorId, 6);

        const mentorsWithStats = await Promise.all(
          users.map(async (user) => {
            const baseMentor = userToMentorAdapter(user);
            try {
              const response = await axiosInstance.get(`/reviews/mentor/${user._id}`);
              const stats = response.data.stats;
              return {
                ...baseMentor,
                rating: stats?.averageRating || 0,
                reviewCount: stats?.totalReviews || 0
              };
            } catch {
              return baseMentor;
            }
          })
        );

        setRelatedMentors(mentorsWithStats);
      } catch (error) {
        console.error('Error fetching related mentors:', error);
        setRelatedMentors([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentMentorId) {
      fetchRelatedMentors();
    }
  }, [currentMentorId]);

  const handleViewProfile = (mentorId: string) => {
    navigate(`/mentor/${mentorId}`);
  };

  if (loading) {
    return (
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Related Mentors</h3>
        <div className="text-sm text-slate-600">Loading...</div>
      </div>
    );
  }

  if (relatedMentors.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Related Mentors</h3>
      <div className="space-y-3">
        {relatedMentors.map((mentor) => (
          <button
            key={mentor.id}
            onClick={() => handleViewProfile(mentor.id)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left group"
          >
            <div className="relative shrink-0">
              {mentor.avatar ? (
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className={`w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white text-sm font-semibold ${
                  mentor.avatar ? 'hidden' : 'flex'
                }`}
              >
                {getInitials(mentor.name)}
              </div>
            </div>
            
            <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-slate-900 truncate group-hover:text-slate-700">
                  {mentor.name}
                </h4>
                <p className="text-xs text-slate-600 truncate mt-0.5">
                  {mentor.title}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <FaStar className="text-yellow-400" size={10} />
                <span className="text-xs font-semibold text-slate-900">
                  {mentor.rating.toFixed(1)}
                </span>
                {mentor.reviewCount > 0 && (
                  <span className="text-xs text-slate-500">
                    ({mentor.reviewCount})
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RelatedMentors;

