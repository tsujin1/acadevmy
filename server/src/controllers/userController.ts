import { Request, Response } from 'express';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: { id: string };
}

const formatUserResponse = (user: any) => ({
  _id: user._id.toString(),
  firstName: user.firstName || '',
  lastName: user.lastName || '',
  email: user.email || '',
  role: user.role || 'student',
  isMentor: user.isMentor || false,
  title: user.title || '',
  company: user.company || '',
  experience: user.experience || 0,
  location: user.location || '',
  bio: user.bio || '',
  about: user.about || '',
  hourlyRate: user.hourlyRate || '',
  skills: user.skills || [],
  avatar: user.avatar || {},
  linkedin: user.linkedin || '',
  website: user.website || '',
  github: user.github || '',
  twitter: user.twitter || ''
});

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(formatUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMentors = async (req: Request, res: Response) => {
  try {
    const mentors = await User.find({ role: 'mentor' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(mentors.map(formatUserResponse));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(students.map(formatUserResponse));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updatableFields = [
      'firstName', 'lastName', 'email', 'title', 'company', 'experience',
      'location', 'bio', 'about', 'hourlyRate', 'linkedin',
      'website', 'github', 'twitter', 'skills'
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        (user as any)[field] = req.body[field];
      }
    });

    const updatedUser = await user.save();
    res.json(formatUserResponse(updatedUser));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCurrentProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(formatUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const uploadAvatar = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const { avatar } = req.body;
    if (!avatar) return res.status(400).json({ message: 'No image data provided' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.avatar = {
      public_id: `avatar_${req.user.id}_${Date.now()}`,
      url: avatar
    };

    const updatedUser = await user.save();
    res.json({ avatar: updatedUser.avatar });
  } catch (error) {
    res.status(500).json({ message: 'Server error during avatar upload' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required' });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully!' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error while updating password' });
  }
};