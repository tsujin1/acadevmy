import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton'; // Import Shadcn Skeleton
import { ArrowRight, Users } from 'lucide-react';
import { MentorCard } from '@/components/mentors/MentorCard';
import { userService, type Mentor, type ReviewStats } from '@/services/userService';
import { ProtectedLink } from '@/components/ProtectedLink';

// Refactored to use Shadcn Skeleton
const SkeletonCard = () => (
  <div className="h-full border border-slate-100 bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden">
    {/* Body */}
    <div className="p-6 flex flex-col items-center text-center flex-grow">
      <Skeleton className="w-24 h-24 rounded-full mb-4" /> {/* Avatar */}

      <div className="space-y-2 mb-6 w-full flex flex-col items-center">
        <Skeleton className="h-6 w-1/2" /> {/* Name */}
        <Skeleton className="h-4 w-1/3" /> {/* Title */}
      </div>

      <div className="space-y-2 mb-6 w-full">
        <Skeleton className="h-3 w-full" /> {/* Bio Line 1 */}
        <Skeleton className="h-3 w-5/6 mx-auto" /> {/* Bio Line 2 */}
      </div>

      <div className="flex justify-center gap-2 w-full mt-auto">
        <Skeleton className="h-6 w-16 rounded-lg" />
        <Skeleton className="h-6 w-16 rounded-lg" />
        <Skeleton className="h-6 w-16 rounded-lg" />
      </div>
    </div>

    {/* Footer Bar */}
    <div className="border-t border-slate-100 bg-slate-50 p-4 grid grid-cols-2 divide-x divide-slate-200">
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-3 w-12" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  </div>
);

export const MeetMentors = () => {
  const shouldReduceMotion = useReducedMotion();
  const [mentors, setMentors] = useState<(Mentor & { stats: ReviewStats })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const mentorsList = await userService.getMentors();
        const mentorsWithStats = await Promise.all(
          mentorsList.slice(0, 6).map(async (mentor) => {
            try {
              const stats = await userService.getMentorReviewStats(mentor._id);
              return { ...mentor, stats };
            } catch {
              // FIXED: Removed 'err' variable to satisfy ESLint
              return { ...mentor, stats: { averageRating: 0, totalReviews: 0 } };
            }
          })
        );
        setMentors(mentorsWithStats);
      } catch (error) {
        console.error('Error fetching mentors:', error);
        setMentors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  // ... rest of your return statement stays exactly the same ...
  return (
    <section className="py-24 bg-white">
      {/* ... your existing JSX ... */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Meet Your New <span className="text-blue-600">Mentors</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Stop guessing. Get unstuck with personalized guidance from senior engineers who have been in your shoes.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : mentors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm mx-auto max-w-2xl"
          >
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No mentors found</h3>
            <p className="text-slate-500">Check back later, we're onboarding new experts!</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentors.map((mentor, index) => (
              <motion.div
                key={mentor._id}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <MentorCard mentor={mentor} stats={mentor.stats} />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && mentors.length > 0 && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-center mt-16"
          >
            <Button
              asChild
              size="lg"
              className="h-12 px-8 text-base bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm"
            >
              <ProtectedLink to="/mentors">
                Explore All Mentors <ArrowRight className="ml-2 h-4 w-4" />
              </ProtectedLink>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};