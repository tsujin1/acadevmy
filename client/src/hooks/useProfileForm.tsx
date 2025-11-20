import { useState, useEffect } from 'react';
import type { User } from '../services/authService';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  experience: string;
  location: string;
  bio: string;
  about: string;
  hourlyRate: string;
  skills: string[];
}

export const useProfileForm = (user: User | null) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    title: '',
    company: '',
    experience: '',
    location: '',
    bio: '',
    about: '',
    hourlyRate: '',
    skills: [],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        title: user.title || (user.role === 'mentor' ? 'Mentor' : 'Student'),
        company: user.company || '',
        experience: user.experience || '',
        location: user.location || '',
        bio: user.bio || '',
        about: user.about || '',
        hourlyRate: user.hourlyRate || '',
        skills: user.skills || [],
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        title: user.title || (user.role === 'mentor' ? 'Mentor' : 'Student'),
        company: user.company || '',
        experience: user.experience || '',
        location: user.location || '',
        bio: user.bio || '',
        about: user.about || '',
        hourlyRate: user.hourlyRate || '',
        skills: user.skills || [],
      });
    }
  };

  return { formData, setFormData, handleChange, resetForm };
};