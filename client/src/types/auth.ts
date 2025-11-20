export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'mentor' | 'admin';
  isMentor: boolean;
  bio?: string;
  about?: string;
  skills: string[];
  avatar?: {
    public_id: string;
    url: string;
  };
  title?: string;
  company?: string;
  experience?: string;
  location?: string;
  hourlyRate?: string;
  linkedin?: string;
  website?: string;
  github?: string;
  twitter?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: string;
}