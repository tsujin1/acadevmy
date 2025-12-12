import { Link } from 'react-router-dom';
import { Star, Building2, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

  const hourlyRate = mentor.hourlyRate
    ? `$${mentor.hourlyRate}/hr`
    : 'N/A';

  return (
    <Link to={`/mentor/${mentor._id}`} className="block h-full group">
      <Card className="h-full border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 rounded-2xl overflow-hidden relative">
        {/* RESPONSIVE FIX: p-4 on mobile, p-6 on tablet/desktop */}
        <CardContent className="p-4 sm:p-6 flex flex-col h-full">

          {/* --- Header: Avatar & Info --- */}
          <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="relative shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  /* RESPONSIVE FIX: w-12 h-12 on mobile */
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border border-slate-100 shadow-sm group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              {/* Fallback Avatar */}
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base sm:text-lg border border-blue-100 ${avatarUrl ? 'hidden' : 'flex'
                  }`}
              >
                {getInitials(mentor.firstName, mentor.lastName)}
              </div>
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              {/* RESPONSIVE FIX: Text base on mobile */}
              <h3 className="font-bold text-base sm:text-lg text-slate-900 truncate leading-tight group-hover:text-blue-600 transition-colors">
                {fullName}
              </h3>

              <div className="flex flex-col gap-0.5 sm:gap-1 mt-1">
                {mentor.title && (
                  <div className="flex items-center text-xs font-medium text-slate-500">
                    <Briefcase className="w-3 h-3 mr-1.5 text-slate-400 shrink-0" />
                    <span className="truncate">{mentor.title}</span>
                  </div>
                )}
                {mentor.company && (
                  <div className="flex items-center text-xs font-medium text-slate-500">
                    <Building2 className="w-3 h-3 mr-1.5 text-slate-400 shrink-0" />
                    <span className="truncate">{mentor.company}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- Bio --- */}
          <div className="mb-4 sm:mb-5 flex-grow">
            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {mentor.bio || "Experienced developer ready to help you level up your coding skills."}
            </p>
          </div>

          {/* --- Skills Badges --- */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
            {mentor.skills?.slice(0, 3).map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                /* RESPONSIVE FIX: Smaller text and padding on mobile */
                className="font-semibold bg-slate-50 text-slate-600 border-slate-100 rounded-lg hover:bg-white hover:border-blue-200 hover:text-blue-600 transition-colors px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs"
              >
                {skill}
              </Badge>
            ))}
            {(mentor.skills?.length || 0) > 3 && (
              <Badge variant="secondary" className="bg-slate-50 text-slate-400 border-slate-100 rounded-lg px-2 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs">
                +{mentor.skills!.length - 3}
              </Badge>
            )}
          </div>

          {/* --- Footer: Stats & Price --- */}
          <div className="mt-auto pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between">
            {/* Rating Pill */}
            <Badge
              variant="secondary"
              className="flex items-center gap-1.5 bg-amber-50 text-slate-900 border-amber-100/50 hover:bg-amber-100 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 font-bold"
            >
              <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs sm:text-sm">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'New'}
              </span>
              <span className="text-slate-500 font-medium ml-0.5 text-[10px] sm:text-xs">
                ({stats.totalReviews})
              </span>
            </Badge>

            {/* Price Pill */}
            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 font-bold text-xs sm:text-sm"
            >
              {hourlyRate}
            </Badge>
          </div>

        </CardContent>
      </Card>
    </Link>
  );
};