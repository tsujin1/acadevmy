import api from './api';
import type { User } from './authService';

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  title?: string;
  company?: string;
  experience?: string;
  location?: string;
  bio?: string;
  about?: string;
  hourlyRate?: string;
  linkedin?: string;
  website?: string;
  github?: string;
  twitter?: string;
  skills?: string[];
  avatar?: {
    public_id?: string;
    url?: string;
  };
}

export const userService = {
  async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async getMentors(): Promise<User[]> {
    const response = await api.get<User[]>('/users/mentors');
    return response.data;
  },

  async getStudents(): Promise<User[]> {
    const response = await api.get<User[]>('/users/students');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  async uploadAvatar(imageData: string): Promise<{ avatar: User['avatar'] }> {
    const response = await api.post<{ avatar: User['avatar'] }>('/users/avatar', {
      avatar: imageData
    }, {
      timeout: 30000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    return response.data;
  },

  async getRelatedMentors(mentorId: string, limit?: number): Promise<User[]> {
    const response = await api.get<User[]>(`/users/${mentorId}/related`, {
      params: limit ? { limit } : undefined
    });
    return response.data;
  }
};