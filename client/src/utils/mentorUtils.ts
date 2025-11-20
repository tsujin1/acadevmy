import type { User } from '../services/authService';
import type { Mentor } from '../types/mentor';

export const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('');
};

export const formatPrice = (price: string | number): string => {
  if (typeof price === 'string') {
    if (price.includes('$') || price.includes('/hr')) {
      return price;
    }
    const priceNum = parseInt(price) || 0;
    return `$${priceNum}/hr`;
  }
  return `$${price}/hr`;
};

export const mapUserToMentor = (user: User): Mentor => {
  return {
    id: user._id,
    name: `${user.firstName} ${user.lastName}`,
    title: user.title || 'Mentor',
    company: user.company || '',
    experience: String(user.experience || 0),
    location: user.location || '',
    hourlyRate: user.hourlyRate || '0',
    rating: 4.5,
    reviewCount: 0,
    skills: user.skills || [],
    bio: user.bio || '',
    about: user.about || '',
    isAvailable: true,
    email: user.email || '',
    linkedin: user.linkedin || '',
    website: user.website || '',
    github: user.github || '',
    twitter: user.twitter || '',
    reviews: [],
    image: user.avatar?.url
  };
};