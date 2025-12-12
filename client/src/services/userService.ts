import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Mentor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: {
    url: string;
    public_id: string;
  };
  title?: string;
  company?: string;
  bio?: string;
  hourlyRate?: string | number;
  skills?: string[];
  location?: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

export const userService = {
  async getMentors(): Promise<Mentor[]> {
    const response = await axios.get<Mentor[]>(`${API_URL}/users/mentors`);
    return response.data;
  },

  async getMentorReviewStats(mentorId: string): Promise<ReviewStats> {
    try {
      const response = await axios.get(`${API_URL}/reviews/mentor/${mentorId}`);
      return response.data.stats || { averageRating: 0, totalReviews: 0 };
    } catch (error) {
      return { averageRating: 0, totalReviews: 0 };
    }
  },
};
