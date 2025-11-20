import { useState, useEffect, useRef } from 'react';
import { FaStar, FaCalendar, FaPlus, FaUser } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../../services/axiosInstance';
import AddReview from './AddReview';
import { useAuth } from '@/hooks/useAuth';

interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  reviewerId?: string;
}

interface ApiReview {
  _id: string;
  userId?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    avatar?: {
      url: string;
    };
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsTabProps {
  mentorId?: string;
}

const ReviewsTab = ({ mentorId }: ReviewsTabProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAddReview, setShowAddReview] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightId = searchParams.get('highlightReview');
  const scrolledRef = useRef(false);
  
  const { user: currentUser } = useAuth(); 

  const canAddReview = currentUser && 
                       currentUser._id !== mentorId && 
                       currentUser.role === 'student';

  useEffect(() => {
    const fetchReviews = async () => {
      if (!mentorId) return;
      
      try {
        setLoading(true);
       const response = await axiosInstance.get(`/reviews/mentor/${mentorId}`);
        
        const apiReviews = response.data.reviews.map((review: ApiReview) => ({
          id: review._id,
          reviewerName: review.userId?.firstName 
            ? `${review.userId.firstName} ${review.userId.lastName}`
            : 'Anonymous',
          reviewerAvatar: review.userId?.avatar?.url,
          reviewerId: review.userId?._id,
          rating: review.rating,
          date: review.createdAt,
          comment: review.comment,
        }));
        
        setReviews(apiReviews);
      } catch { /* empty */ } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [mentorId]);

  useEffect(() => {
    if (!loading && reviews.length > 0 && highlightId) {
      const element = document.getElementById(`review-${highlightId}`);
      
      if (element && !scrolledRef.current) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          scrolledRef.current = true;
        }, 100);

        const timer = setTimeout(() => {
          setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.delete('highlight');
            return newParams;
          }, { replace: true });
        }, 2000);

        return () => clearTimeout(timer);
      }
    }
  }, [loading, reviews, highlightId, setSearchParams]);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(r => r.rating === stars).length / reviews.length) * 100 
      : 0
  }));

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

  const handleReviewAdded = (newReview: {
    _id: string;
    userId?: {
      _id?: string;
      firstName?: string;
      lastName?: string;
      avatar?: string;
    };
    rating: number;
    comment: string;
    createdAt?: string;
  }) => {
    const review: Review = {
      id: newReview._id,
      reviewerName: newReview.userId?.firstName 
        ? `${newReview.userId.firstName} ${newReview.userId.lastName}`
        : 'You',
      reviewerAvatar: newReview.userId?.avatar,
      reviewerId: newReview.userId?._id,
      rating: newReview.rating,
      date: newReview.createdAt || new Date().toISOString(),
      comment: newReview.comment,
    };
    
    setReviews(prev => [review, ...prev]);
    setShowAddReview(false);
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Reviews & Ratings</h2>
        
        {canAddReview && (
          <button
            onClick={() => setShowAddReview(!showAddReview)}
            className="px-4 py-2.5 sm:py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 active:bg-gray-700 transition-colors flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto"
          >
            <FaPlus size={14} />
            Add Review
          </button>
        )}
      </div>

      {showAddReview && canAddReview && mentorId && (
        <div className="max-w-4xl mb-6 sm:mb-8">
          <AddReview 
            mentorId={mentorId} 
            onReviewAdded={handleReviewAdded}
          />
        </div>
      )}

      <div className="max-w-4xl mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">{averageRating}</div>
            <div className="mb-3">{renderStars(Math.round(parseFloat(averageRating)), 20)}</div>
            <div className="text-gray-600 text-sm sm:text-base">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 w-12 sm:w-16">
                  <span className="text-sm font-medium text-gray-900">{stars}</span>
                  <FaStar size={12} className="text-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-6 sm:w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl space-y-3 sm:space-y-4">
        {reviews.length === 0 ? (
          <div className="p-8 sm:p-12 text-center bg-gray-50 rounded-lg border border-gray-200">
            <FaStar size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">No reviews yet</h3>
            <p className="text-gray-600 text-sm">Reviews will appear here once you start receiving them.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div 
              key={review.id}
              id={`review-${review.id}`}
              className={`p-4 sm:p-5 rounded-lg border transition-all duration-1000 ease-in-out ${
                review.id === highlightId 
                  ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500 translate-x-2'
                  : 'bg-white border-gray-200'
              }`}
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
                      {review.reviewerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-2">
                    <div className="flex-1 min-w-0">
                      {review.reviewerId ? (
                        <Link 
                          to={`/student/${review.reviewerId}`}
                          className="font-semibold text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2 group text-sm sm:text-base"
                        >
                          <span className="truncate max-w-[200px] sm:max-w-none">{review.reviewerName}</span>
                          <FaUser className="h-3 w-3 text-gray-400 group-hover:text-blue-600 transition-colors shrink-0" />
                        </Link>
                      ) : (
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">{review.reviewerName}</h4>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating, 12)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs whitespace-nowrap self-start sm:self-auto">
                      <FaCalendar size={10} className="shrink-0" />
                      <span className="hidden sm:inline">{formatDate(review.date)}</span>
                      <span className="sm:hidden">{new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
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

      <div className="mt-6 sm:mt-8 max-w-4xl p-4 sm:p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2">About Reviews</h3>
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
          Reviews are provided by people who have worked with this user. All reviews are verified and monitored to ensure authenticity and professionalism.
        </p>
      </div>
    </div>
  );
};

export default ReviewsTab;