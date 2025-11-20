import { useState, useEffect } from 'react';
import { FaStar, FaCalendar, FaUser, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axiosInstance from '@/services/axiosInstance';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';

interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar?: string;
  mentorName: string;
  mentorAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  mentorId?: string;
  userId?: string;
}

interface ApiReview {
  _id: string;
  userId?: string | {
    _id?: string;
    firstName?: string;
    lastName?: string;
    avatar?: {
      url: string;
    };
  };
  mentorId?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    avatar?: {
      url: string;
    };
    title?: string;
    company?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: {
    url: string;
  };
}

interface ReviewsGivenTabProps {
  userId: string;
}

const ReviewsGivenTab = ({ userId }: ReviewsGivenTabProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();
  const [, setUserDataMap] = useState<Record<string, UserData>>({});

  const isOwnProfile = currentUser?._id === userId;

  const fetchUserData = async (userId: string): Promise<UserData | null> => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      return response.data;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await axiosInstance.get(`/reviews/user/${userId}`);
        
        if (response.data.reviews && Array.isArray(response.data.reviews)) {
          const reviewsData = response.data.reviews;
          const userDataMap: Record<string, UserData> = {};
          
          const userIdsToFetch = new Set<string>();
          reviewsData.forEach((review: ApiReview) => {
            if (typeof review.userId === 'string') {
              userIdsToFetch.add(review.userId);
            } else if (review.userId?._id) {
              userDataMap[review.userId._id] = {
                _id: review.userId._id,
                firstName: review.userId.firstName || '',
                lastName: review.userId.lastName || '',
                avatar: review.userId.avatar
              };
            }
          });

          const userFetchPromises = Array.from(userIdsToFetch).map(userId => 
            fetchUserData(userId)
          );
          const userResults = await Promise.all(userFetchPromises);
          
          userResults.forEach((userData, index) => {
            if (userData) {
              const userId = Array.from(userIdsToFetch)[index];
              userDataMap[userId] = userData;
            }
          });

          setUserDataMap(userDataMap);

          const apiReviews = reviewsData.map((review: ApiReview) => {
            let reviewerFirstName = '';
            let reviewerLastName = '';
            let reviewerId = '';
            
            if (typeof review.userId === 'string') {
              reviewerId = review.userId;
              const userData = userDataMap[review.userId];
              if (userData) {
                reviewerFirstName = userData.firstName;
                reviewerLastName = userData.lastName;
              }
            } else if (review.userId) {
              reviewerId = review.userId._id || '';
              reviewerFirstName = review.userId.firstName || '';
              reviewerLastName = review.userId.lastName || '';
            }
            
            let reviewerName;
            if (isOwnProfile && reviewerId === currentUser?._id) {
              reviewerName = 'You';
            } else {
              reviewerName = `${reviewerFirstName} ${reviewerLastName}`.trim();
              if (!reviewerName) {
                reviewerName = 'User';
              }
            }
            
            const mentorFirstName = review.mentorId?.firstName || '';
            const mentorLastName = review.mentorId?.lastName || '';
            const mentorName = `${mentorFirstName} ${mentorLastName}`.trim() || 'Mentor';
            
            return {
              id: review._id,
              reviewerName,
              reviewerAvatar: (isOwnProfile && reviewerId === currentUser?._id) 
                ? currentUser?.avatar?.url 
                : (typeof review.userId === 'string' 
                    ? userDataMap[review.userId]?.avatar?.url 
                    : review.userId?.avatar?.url),
              mentorName,
              mentorAvatar: review.mentorId?.avatar?.url,
              mentorId: review.mentorId?._id,
              rating: review.rating,
              date: review.createdAt,
              comment: review.comment,
              userId: reviewerId,
            };
          });
          setReviews(apiReviews);
        } else {
          setReviews([]);
        }
        
      } catch {
        setError('Failed to load reviews');
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId, currentUser, isOwnProfile]);

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/reviews/${reviewId}`);
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      toast.success('Review deleted successfully!');
    } catch {
      toast.error('Failed to delete review. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const renderStars = (rating: number, size: number = 16) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={size}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center">Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center text-red-600">
          <h3 className="font-semibold text-lg mb-2">Error loading reviews</h3>
          <p className="text-sm sm:text-base">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {isOwnProfile ? 'Reviews You\'ve Given' : 'Reviews Given'}
        </h2>
        <div className="text-sm text-gray-600">
          {reviews.length} review{reviews.length !== 1 ? 's' : ''} given
        </div>
      </div>

      <div className="max-w-4xl space-y-4">
        {reviews.length === 0 ? (
          <div className="p-8 sm:p-12 text-center bg-gray-50 rounded-lg border border-gray-200">
            <FaStar size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">
              {isOwnProfile ? 'You haven\'t given any reviews yet' : 'No reviews given yet'}
            </h3>
            <p className="text-gray-600 text-sm">
              {isOwnProfile 
                ? 'Reviews you give to other mentors will appear here.' 
                : 'This user hasn\'t given any reviews yet.'
              }
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div 
              key={review.id}
              className="p-4 sm:p-5 bg-white rounded-lg border border-gray-200 relative"
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center text-white shrink-0">
                  {review.reviewerAvatar ? (
                    <img 
                      src={review.reviewerAvatar} 
                      alt={review.reviewerName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-linear-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                      {review.reviewerName.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">
                          {review.reviewerName}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-xs sm:text-sm text-gray-600">reviewed</span>
                        
                        {review.mentorId ? (
                          <Link 
                            to={`/mentor/${review.mentorId}`}
                            className="font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 text-sm sm:text-base"
                          >
                            <span className="truncate max-w-[150px] sm:max-w-none">{review.mentorName}</span>
                            <FaUser className="h-3 w-3 shrink-0" />
                          </Link>
                        ) : (
                          <span className="font-semibold text-gray-900 text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">{review.mentorName}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating, 12)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto">
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs whitespace-nowrap">
                        <FaCalendar size={10} className="shrink-0" />
                        <span className="hidden sm:inline">{formatDate(review.date)}</span>
                        <span className="sm:hidden">{new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      
                      {isOwnProfile && review.userId === currentUser?._id && (
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="px-2 sm:px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                        >
                          <FaTrash size={10} />
                          <span className="hidden xs:inline">Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed pl-0 sm:pl-16 text-sm sm:text-base">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>

      {isOwnProfile && (
        <div className="mt-6 sm:mt-8 max-w-4xl p-4 sm:p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2">About Reviews</h3>
          <p className="text-gray-600 leading-relaxed text-sm">
            These are reviews you have given to other mentors. Your feedback helps maintain a quality mentoring community.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewsGivenTab;