import { Request, Response } from 'express';
import crypto from 'crypto';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import { sendPasswordResetEmail } from '../utils/sendEmail';

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Validate role - only allow 'student' or 'mentor', default to 'student'
    // Prevent 'admin' role from being set during registration
    const validRoles = ['student', 'mentor'];
    const userRole = role && validRoles.includes(role.toLowerCase()) 
      ? role.toLowerCase() 
      : 'student';

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: userRole,
      isMentor: userRole === 'mentor'
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isMentor: user.isMentor,
      token
    });

  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.code === 11000) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({ message: messages.join(', ') });
      return;
    }

    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.comparePassword(password))) {
      const token = generateToken(user._id.toString());

      user.lastLogin = new Date();
      await user.save();

      res.json({
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isMentor: user.isMentor,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const user = await User.findById(req.user.id);

    if (user) {
      res.json({
        _id: user._id.toString(),
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || 'student',
        isMentor: user.isMentor || false,
        title: user.title || '',
        company: user.company || '',
        experience: user.experience || '',
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
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(200).json({
        message: 'If an account with that email exists, a reset link has been sent.'
      });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000);

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    try {
      await sendPasswordResetEmail(user.email, resetUrl);
      res.status(200).json({
        message: 'If an account with that email exists, a reset link has been sent.'
      });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      console.error('Email error:', emailError);
      res.status(500).json({ message: 'Failed to send reset email. Please try again.' });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    if (!token) {
      res.status(400).json({ message: 'Reset token is required' });
      return;
    }

    if (!password || password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long' });
      return;
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: new Date() }
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired reset token' });
      return;
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      message: 'Password reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};