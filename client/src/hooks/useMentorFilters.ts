import { useState, useMemo, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import axiosInstance from '../services/axiosInstance';
import type { Mentor } from '@/types/mentor';
import type { User } from '../services/authService';

export interface MentorFilters {
  searchQuery: string;
  selectedSkills: string[];
  priceRange: [number, number];
  minRating: number;
}

interface ExtendedUser extends User {
  rating?: number;
  reviews?: Mentor['reviews'];
}

const safeParseRate = (rate: string | number): number => {
  const numericRate = typeof rate === 'number' ? rate : parseInt(rate, 10);
  return isNaN(numericRate) ? 0 : Math.max(0, numericRate);
};

const userToMentorAdapter = (user: User): Mentor => {
  const extendedUser = user as ExtendedUser;
  const experienceValue = user.experience ?? '0 year';
  const hourlyRateValue = String(user.hourlyRate ?? '0');
  const skillsArray = Array.isArray(user.skills) ? user.skills : [];

  let rating = Number(extendedUser.rating) || 0;

  if (extendedUser.reviews && extendedUser.reviews.length > 0) {
    const totalRating = extendedUser.reviews.reduce((sum: number, review) => {
      return sum + (Number(review.rating) || 0);
    }, 0);
    const calculatedAvg = totalRating / extendedUser.reviews.length;
    const roundedAvg = Math.round(calculatedAvg * 10) / 10;
    if (roundedAvg > 0) rating = roundedAvg;
  }

  return {
    id: user._id,
    name: `${user.firstName} ${user.lastName}`,
    title: user.title || 'Mentor',
    company: user.company || 'Not specified',
    experience: typeof experienceValue === 'number' ? `${experienceValue} ` : experienceValue,
    location: user.location || 'Not specified',
    hourlyRate: hourlyRateValue,
    rating: rating,
    reviewCount: extendedUser.reviews?.length || 0,
    skills: skillsArray,
    bio: user.bio || 'No bio available',
    about: user.about || user.bio || 'No about information available',
    isAvailable: true,
    email: user.email,
    linkedin: user.linkedin || '#',
    website: user.website || '#',
    reviews: extendedUser.reviews || [],
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
      // Always limit to prevent fetching all mentors at once (performance)
      const users = await userService.getMentors(100, 1); // Max 100 mentors per page

      const mentorsWithStats = await Promise.all(
        users.map(async (user) => {
          const baseMentor = userToMentorAdapter(user);
          try {
            const response = await axiosInstance.get(`/reviews/mentor/${user._id}`);
            const stats = response.data.stats;

            return {
              ...baseMentor,
              rating: stats?.averageRating || baseMentor.rating,
              reviewCount: stats?.totalReviews || baseMentor.reviewCount
            };
          } catch {
            return baseMentor;
          }
        })
      );

      setMentors(mentorsWithStats);
    } catch (error) {
      console.error(error);
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

  const globalMaxPrice = useMemo(() => {
    if (mentors.length === 0) return 100;
    const rates = mentors.map(m => safeParseRate(m.hourlyRate));
    const max = Math.max(...rates);
    return Math.ceil(max / 10) * 10;
  }, [mentors]);

  const [filters, setFilters] = useState<MentorFilters>({
    searchQuery: '',
    selectedSkills: [],
    priceRange: [0, globalMaxPrice],
    minRating: 0,
  });

  useEffect(() => {
    setFilters(prev => {
      if (prev.priceRange[1] === 0 || prev.priceRange[1] < globalMaxPrice) {
        return { ...prev, priceRange: [0, globalMaxPrice] };
      }
      return prev;
    });
  }, [globalMaxPrice]);

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
      const matchesPrice = maxPrice >= globalMaxPrice
        ? true
        : numericRate >= minPrice && numericRate <= maxPrice;

      const matchesRating = filters.minRating === 0
        ? true
        : mentor.rating >= filters.minRating;

      return matchesSearch && matchesSkills && matchesPrice && matchesRating;
    });
  }, [mentors, filters, globalMaxPrice]);

  const updateFilters = useCallback((updates: Partial<MentorFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      selectedSkills: [],
      priceRange: [0, globalMaxPrice],
      minRating: 0,
    });
  }, [globalMaxPrice]);

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
    globalMaxPrice,
    updateFilters,
    clearFilters,
    toggleSkill,
    refetch: fetchMentors,
  };
};