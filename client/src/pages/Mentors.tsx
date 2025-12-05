import { useNavigate } from 'react-router-dom';
import type { Mentor } from '@/types/mentor';
import { useMentorFilters } from '@/hooks/useMentorFilters';
import MentorHero from '@/components/mentors/MentorHero';
import MentorCard from '@/components/mentors/MentorCard';
import NoMentorsFound from '@/components/mentors/NoMentorsFound';
import MentorFilters from '@/components/mentors/filters/MentorFilters';

const Mentors = () => {
  const navigate = useNavigate();
  const {
    filters,
    filteredMentors,
    allSkills,
    loading,
    globalMaxPrice,
    updateFilters,
    clearFilters,
    toggleSkill,
  } = useMentorFilters();

  const handleSearchChange = (query: string) => updateFilters({ searchQuery: query });
  const handleViewProfile = (mentor: Mentor) => navigate(`/mentor/${mentor.id}`);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-2">Loading mentors...</div>
          <div className="text-sm text-gray-500">Fetching the latest mentor data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <MentorHero
        searchQuery={filters.searchQuery}
        onSearchChange={handleSearchChange}
      />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-72 shrink-0">
            <MentorFilters
              filters={filters}
              allSkills={allSkills}
              globalMaxPrice={globalMaxPrice}
              onFiltersChange={updateFilters}
              onToggleSkill={toggleSkill}
              onClearFilters={clearFilters}
            />
          </aside>

          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredMentors.length} {filteredMentors.length === 1 ? 'Mentor' : 'Mentors'} Available
              </h2>
              <p className="text-gray-600 mt-1">
                Browse and connect with experienced professionals
              </p>
            </div>

            {filteredMentors.length === 0 ? (
              <NoMentorsFound />
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredMentors.map(mentor => (
                  <MentorCard
                    key={mentor.id}
                    mentor={mentor}
                    onViewProfile={handleViewProfile}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Mentors;