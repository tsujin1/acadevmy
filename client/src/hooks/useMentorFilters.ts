import { useState, useMemo, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import type { Mentor } from '@/types/mentor';
import type { User } from '../services/authService';
import { PRICE_RANGE } from '@/constants/filters';

export interface MentorFilters {
  searchQuery: string;
  selectedSkills: string[];
  priceRange: [number, number];
  minRating: number;
}

const safeParseRate = (rate: string | number): number => {
  const numericRate = typeof rate === 'number' ? rate : parseInt(rate, 10);
  return isNaN(numericRate) ? 0 : Math.max(0, numericRate);
};

const userToMentorAdapter = (user: User): Mentor => {
  const experienceValue = user.experience ?? '0 year';
  const hourlyRateValue = String(user.hourlyRate ?? '0');
  const skillsArray = Array.isArray(user.skills) ? user.skills : [];

  return {
    id: user._id,
    name: `${user.firstName} ${user.lastName}`,
    title: user.title || 'Mentor',
    company: user.company || 'Not specified',
    experience: typeof experienceValue === 'number' ? `${experienceValue} ` : experienceValue,
    location: user.location || 'Not specified',
    hourlyRate: hourlyRateValue,
    rating: 4.0,
    reviewCount: 0,
    skills: skillsArray,
    bio: user.bio || 'No bio available',
    about: user.about || user.bio || 'No about information available',
    isAvailable: true,
    email: user.email,
    linkedin: user.linkedin || '#',
    website: user.website || '#',
    reviews: [],
    image: user.avatar?.url || undefined,
    github: '',
    twitter: ''
  };
};

export const useMentorFilters = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMentors = useCallback(async () => {
    try {
      setLoading(true);
      const users = await userService.getMentors();
      const adaptedMentors = users.map(userToMentorAdapter);
      setMentors(adaptedMentors);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setMentors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  useEffect(() => {
    const handleProfileUpdate = () => fetchMentors();
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, [fetchMentors]);

  const dynamicPriceRange = useMemo((): [number, number] => {
    if (mentors.length === 0) return [PRICE_RANGE.MIN, PRICE_RANGE.MAX];

    const rates = mentors.map(m => safeParseRate(m.hourlyRate));
    const minRate = Math.floor(Math.min(...rates));
    const maxRate = Math.ceil(Math.max(...rates));

    return [
      Math.max(PRICE_RANGE.MIN, minRate - 10),
      Math.max(PRICE_RANGE.MAX, maxRate + 10)
    ];
  }, [mentors]);

  const [filters, setFilters] = useState<MentorFilters>({
    searchQuery: '',
    selectedSkills: [],
    priceRange: dynamicPriceRange,
    minRating: 0,
  });

  useEffect(() => {
    if (mentors.length > 0) {
      setFilters(prev => ({
        ...prev,
        priceRange: dynamicPriceRange,
      }));
    }
  }, [dynamicPriceRange, mentors.length]);

  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    mentors.forEach(mentor => {
      mentor.skills.forEach((skill: string) => skills.add(skill));
    });
    return Array.from(skills).sort();
  }, [mentors]);

  const filteredMentors = useMemo(() => {
    return mentors.filter(mentor => {
      const searchLower = filters.searchQuery.toLowerCase();

      const matchesSearch = !filters.searchQuery ||
        mentor.name.toLowerCase().includes(searchLower) ||
        mentor.title.toLowerCase().includes(searchLower) ||
        mentor.bio.toLowerCase().includes(searchLower) ||
        mentor.skills.some((skill: string) => skill.toLowerCase().includes(searchLower));

      const matchesSkills = !filters.selectedSkills.length ||
        filters.selectedSkills.every((skill: string) => mentor.skills.includes(skill));

      const numericRate = safeParseRate(mentor.hourlyRate);
      const [minPrice, maxPrice] = filters.priceRange;

      const matchesPrice = maxPrice >= PRICE_RANGE.MAX
        ? true
        : numericRate >= minPrice && numericRate <= maxPrice;

      const matchesRating = mentor.rating >= filters.minRating;

      return matchesSearch && matchesSkills && matchesPrice && matchesRating;
    });
  }, [mentors, filters]);

  const updateFilters = useCallback((updates: Partial<MentorFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      selectedSkills: [],
      priceRange: dynamicPriceRange,
      minRating: 0,
    });
  }, [dynamicPriceRange]);

  const toggleSkill = useCallback((skill: string) => {
    setFilters(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter(s => s !== skill)
        : [...prev.selectedSkills, skill]
    }));
  }, []);

  return {
    filters,
    filteredMentors,
    allSkills,
    mentors,
    loading,
    updateFilters,
    clearFilters,
    toggleSkill,
    refetch: fetchMentors,
  };
};