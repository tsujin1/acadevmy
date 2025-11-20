import type { User } from '../services/authService';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { firstName: string; lastName: string; email: string; password: string; role: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (updatedUser: User) => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}