export interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  experience: string;
  location: string;
  hourlyRate: string;
  rating: number;
  reviewCount: number;
  skills: string[];
  bio: string;
  about: string;
  isAvailable: boolean;
  email: string;
  linkedin: string;
  github: string;
  twitter: string;
  website: string;
  reviews: Review[];
  image?: string;
  avatar?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'mentor';
  timestamp: string;
}