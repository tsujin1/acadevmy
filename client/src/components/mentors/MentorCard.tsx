import { Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'; // Import Shadcn Avatar
import { ProtectedLink } from '@/components/ProtectedLink';
import type { Mentor, ReviewStats } from '@/services/userService';

interface MentorCardProps {
  mentor: Mentor;
  stats: ReviewStats;
}

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

export const MentorCard = ({ mentor, stats }: MentorCardProps) => {
  const fullName = `${mentor.firstName} ${mentor.lastName}`;
  const avatarUrl = mentor.avatar?.url;
  const priceDisplay = mentor.hourlyRate ? `$${mentor.hourlyRate}` : 'N/A';
  const hasRatings = stats.totalReviews > 0;

  // GRAMMAR FIX: Logic for singular/plural
  const reviewLabel = stats.totalReviews === 1 ? 'Review' : 'Reviews';

  return (
    <ProtectedLink to={`/mentor/${mentor._id}`} className="block h-full group">
      <Card className="h-full border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col">

        {/* --- Main Body --- */}
        <div className="p-6 flex flex-col items-center text-center flex-grow">

          {/* Avatar Section (Refactored to use Shadcn) */}
          <div className="relative mb-4 mt-2">
            <div className="p-1 rounded-full border-2 border-slate-100 bg-white group-hover:border-blue-100 transition-colors inline-block">
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28">
                <AvatarImage
                  src={avatarUrl}
                  alt={fullName}
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <AvatarFallback className="bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-3xl">
                  {getInitials(mentor.firstName, mentor.lastName)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Name & Title */}
          <div className="mb-4 w-full">
            <h3 className="font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors truncate px-2">
              {fullName}
            </h3>

            <div className="text-sm font-medium text-slate-500 mt-1 flex items-center justify-center flex-wrap gap-1 px-4">
              {mentor.title || 'Mentor'}

              {mentor.title && mentor.company && (
                <span className="text-slate-300 mx-1 hidden sm:inline">•</span>
              )}

              {mentor.company && (
                <span className="text-blue-600">
                  {mentor.company}
                </span>
              )}
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-6 max-w-[280px]">
            {mentor.bio || "Experienced developer ready to help you level up your coding skills."}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap justify-center gap-2 w-full">
            {mentor.skills?.slice(0, 3).map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="font-normal bg-white text-slate-600 border border-slate-200 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors px-2.5 py-1 text-xs"
              >
                {skill}
              </Badge>
            ))}
            {(mentor.skills?.length || 0) > 3 && (
              <Badge variant="secondary" className="bg-slate-50 text-slate-400 border-slate-100 px-2 py-1 text-xs">
                +{mentor.skills!.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* --- Footer Bar --- */}
        <div className="border-t border-slate-100 bg-slate-50/50 p-3 grid grid-cols-2 divide-x divide-slate-200 group-hover:bg-blue-50/30 transition-colors">

          {/* Rating Section */}
          <div className="flex flex-col items-center justify-center">
            <div className={`flex items-center gap-1.5 font-bold text-sm ${hasRatings ? 'text-slate-900' : 'text-slate-400'}`}>
              {hasRatings ? (
                <>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{stats.averageRating.toFixed(1)}</span>
                </>
              ) : (
                <span>N/A</span>
              )}
            </div>
            {/* UPDATED: Uses singular/plural variable */}
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mt-0.5">
              {hasRatings ? `${stats.totalReviews} ${reviewLabel}` : 'No reviews yet'}
            </span>
          </div>

          {/* Price Section */}
          <div className="flex flex-col items-center justify-center">
            <div className="font-bold text-slate-900 text-sm">
              {priceDisplay}
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mt-0.5">
              Hourly Rate
            </span>
          </div>

        </div>
      </Card>
    </ProtectedLink>
  );
};