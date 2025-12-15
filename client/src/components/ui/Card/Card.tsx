import type { Mentor } from '@/types/mentor';
import { getInitials, formatPrice } from '@/utils/mentorUtils';

interface CardProps {
  mentor: Mentor;
  onClick?: (mentor: Mentor) => void;
}

const SKILLS_CONTAINER_HEIGHT = 'min-h-[30px]';
const BIO_HEIGHT = 'min-h-[40px]';

const Card = ({ mentor, onClick }: CardProps) => {
  const displayRating = mentor.rating ? mentor.rating.toFixed(1) : '0.0';
  const displayReviewCount = mentor.reviewCount || 0;

  return (
    <div
      className="group cursor-pointer h-full"
      onClick={() => onClick?.(mentor)}
    >
      <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between">
        <div>
          <div className="relative mb-4">
            {mentor.image ? (
              <img
                src={mentor.image}
                alt={mentor.name}
                className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-gray-200"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.className = fallback.className.replace('hidden', 'flex');
                  }
                }}
              />
            ) : null}

            <div
              className={`w-20 h-20 rounded-full mx-auto bg-linear-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-2xl font-bold ${
                mentor.image ? 'hidden' : 'flex'
              }`}
            >
              {getInitials(mentor.name)}
            </div>

            {mentor.hourlyRate && (
              <div className="absolute -top-2 -right-2 bg-gray-900 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                {formatPrice(mentor.hourlyRate)}
              </div>
            )}
          </div>

          <h3 className="font-semibold text-gray-900 text-center mb-1">{mentor.name || 'Mentor'}</h3>
          <p className="text-sm text-gray-600 text-center mb-2">{mentor.title || 'Professional'}</p>

          <div className="flex items-center justify-center mb-3 space-x-1">
            <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-gray-900">{displayRating}</span>
            <span className="text-sm text-gray-500">({displayReviewCount})</span>
          </div>

          <div className={`flex flex-wrap justify-center gap-2 mb-3 ${SKILLS_CONTAINER_HEIGHT}`}>
            {mentor.skills && mentor.skills.length > 0 ? (
              <>
                {mentor.skills.slice(0, 2).map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">{skill}</span>
                ))}
                {mentor.skills.length > 2 && (
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-md">
                    +{mentor.skills.length - 2}
                  </span>
                )}
              </>
            ) : (
              <span className="px-3 py-1.5 bg-gray-50 text-gray-400 text-xs font-medium rounded-md italic">
                Skills coming soon
              </span>
            )}
          </div>
        </div>

        <p className={`text-sm text-gray-600 text-center leading-relaxed line-clamp-2 ${BIO_HEIGHT}`}>
          {mentor.bio || 'No bio available yet.'}
        </p>
      </div>
    </div>
  );
};

export default Card;