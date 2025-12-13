import axios from 'axios';
import type { User } from '@/contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    // Server returns user data directly, not nested
    const { token, ...userData } = response.data;
    const user: User = {
      _id: userData._id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
      isMentor: userData.isMentor,
    };

    // Set token in axios defaults for future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return { user, token };
  },

  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role?: string
  ): Promise<LoginResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, {
      firstName,
      lastName,
      email,
      password,
      role,
    });

    // Server returns user data directly, not nested
    const { token, ...userData } = response.data;
    const user: User = {
      _id: userData._id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
      isMentor: userData.isMentor,
    };

    // Set token in axios defaults for future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return { user, token };
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await axios.post<{ message: string }>(`${API_URL}/auth/forgot-password`, {
      email,
    });
    return response.data;
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await axios.post<{ message: string }>(`${API_URL}/auth/reset-password`, {
      token,
      password,
    });
    return response.data;
  },

  logout() {
    delete axios.defaults.headers.common['Authorization'];
  },
};

