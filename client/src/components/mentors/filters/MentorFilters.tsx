import { useState, useCallback, memo } from 'react';
import { FaFilter } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import type { MentorFilters as MentorFiltersType } from '@/hooks/useMentorFilters';
import { PRICE_RANGE } from '@/constants/filters'; 
import FilterContent from './FilterContent';

interface MentorFiltersProps {
  filters: MentorFiltersType;
  allSkills: string[];
  globalMaxPrice: number; 
  onFiltersChange: (updates: Partial<MentorFiltersType>) => void;
  onToggleSkill: (skill: string) => void;
  onClearFilters: () => void;
}

const MentorFilters = memo(({
  filters,
  allSkills,
  globalMaxPrice, 
  onFiltersChange,
  onToggleSkill,
  onClearFilters,
}: MentorFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePriceChange = useCallback((value: number) => {
    onFiltersChange({ 
      priceRange: [PRICE_RANGE.MIN, value] 
    });
  }, [onFiltersChange]);

  const handleRatingChange = useCallback((value: number) => {
    onFiltersChange({ minRating: value });
  }, [onFiltersChange]);

  const toggleMobileMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <>
      <div className="hidden lg:block bg-gray-50 rounded-lg p-6 sticky top-6 h-fit">
        <FilterContent
          filters={filters}
          allSkills={allSkills}
          globalMaxPrice={globalMaxPrice}
          onToggleSkill={onToggleSkill}
          onClearFilters={onClearFilters}
          onPriceChange={handlePriceChange}
          onRatingChange={handleRatingChange}
        />
      </div>

      <div className="lg:hidden mb-4">
        <motion.button
          onClick={toggleMobileMenu}
          className="w-full flex items-center justify-center gap-2 bg-linear-to-br from-gray-950 via-gray-900 to-gray-800 text-white px-4 py-3 rounded-lg font-medium cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaFilter className="text-sm" />
          Filters
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="mt-3 bg-white border border-gray-200 rounded-lg shadow-sm p-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <FilterContent
                filters={filters}
                allSkills={allSkills}
                globalMaxPrice={globalMaxPrice} 
                onToggleSkill={onToggleSkill}
                onClearFilters={onClearFilters}
                onPriceChange={handlePriceChange}
                onRatingChange={handleRatingChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
});

MentorFilters.displayName = 'MentorFilters';

export default MentorFilters;