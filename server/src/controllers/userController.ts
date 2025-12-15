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

// Format user response for public listings (excludes email)
const formatPublicUserResponse = (user: any) => {
  const formatted = formatUserResponse(user);
  delete formatted.email;
  
  // Keep base64 images if they're reasonably sized (for backward compatibility)
  // Large base64 images will be filtered out in the calling functions
  // TODO: Migrate all base64 images to proper image storage (Cloudinary/S3)
  
  return formatted;
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    
    // Validate ObjectId format
    if (!userId || userId.length !== 24) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await User.findById(userId).select('-password -email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Use public formatter to exclude email for public access
    const formatted = formatPublicUserResponse(user);
    
    // Keep base64 images for now (until migration) but limit size
    if (formatted.avatar?.url && formatted.avatar.url.startsWith('data:')) {
      // Only keep if it's reasonably sized (less than 100KB base64 = ~75KB image)
      const base64Size = formatted.avatar.url.length;
      if (base64Size > 100000) {
        // Too large, remove it
        formatted.avatar = {};
      }
      // Otherwise keep it for now
    }
    
    res.json(formatted);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMentors = async (req: Request, res: Response) => {
  try {
    // ALWAYS enforce a limit for performance - default to 50 if not specified
    const limit = parseInt(req.query.limit as string) || 50; // Default limit of 50
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;
    const maxLimit = Math.min(limit, 100); // Cap at 100 for performance

    // Filter out test users and users with incomplete profiles
    const query = { 
      role: 'mentor',
      // Exclude test users
      firstName: { $not: /^test$/i },
      lastName: { $not: /^[0-9]+$/ },
      // Only include users with at least some profile data
      $or: [
        { title: { $exists: true, $ne: '' } },
        { company: { $exists: true, $ne: '' } },
        { bio: { $exists: true, $ne: '' } },
        { skills: { $exists: true, $ne: [] } }
      ]
    };

    const mentors = await User.find(query)
      .select('-password -email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(maxLimit); // Always apply limit

    // Format response - keep base64 images if reasonable size (for backward compatibility)
    const formattedMentors = mentors.map(user => {
      const formatted = formatPublicUserResponse(user);
      // Only remove base64 images if they're too large (performance issue)
      if (formatted.avatar?.url && formatted.avatar.url.startsWith('data:')) {
        const base64Size = formatted.avatar.url.length;
        if (base64Size > 100000) {
          // Too large (>100KB), remove it to prevent performance issues
          formatted.avatar = {};
        }
        // Otherwise keep it (for now, until migration to proper image storage)
      }
      return formatted;
    });

    // Always return paginated format for consistency and performance tracking
    const total = await User.countDocuments(query);
    res.json({
      mentors: formattedMentors,
      pagination: {
        page,
        limit: maxLimit,
        total,
        totalPages: Math.ceil(total / maxLimit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    // Filter out test users and exclude email for public access
    const students = await User.find({ 
      role: 'student',
      // Exclude test users
      firstName: { $not: /^test$/i },
      lastName: { $not: /^[0-9]+$/ }
    })
      .select('-password -email')
      .sort({ createdAt: -1 });
    res.json(students.map(formatPublicUserResponse));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent role manipulation - explicitly exclude role and isMentor from updates
    const restrictedFields = ['role', 'isMentor', 'password', '_id', 'isEmailVerified'];
    restrictedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        delete req.body[field]; // Remove restricted fields from request
      }
    });

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

export const getRelatedMentors = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 6;

    const currentMentor = await User.findById(id).select('-password');
    if (!currentMentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const currentSkills = currentMentor.skills || [];
    const currentCompany = currentMentor.company || '';
    const currentLocation = currentMentor.location || '';

    // Find mentors with matching criteria (exclude test users)
    const relatedMentors = await User.find({
      role: 'mentor',
      _id: { $ne: id }, // Exclude current mentor
      // Exclude test users
      firstName: { $not: /^test$/i },
      lastName: { $not: /^[0-9]+$/ },
      $or: [
        // Match by skills (at least one common skill)
        ...(currentSkills.length > 0 ? [{ skills: { $in: currentSkills } }] : []),
        // Match by company
        ...(currentCompany ? [{ company: currentCompany }] : []),
        // Match by location
        ...(currentLocation ? [{ location: currentLocation }] : [])
      ]
    })
      .select('-password -email')
      .limit(limit);

    // Sort by relevance: prioritize mentors with more matching criteria
    const scoredMentors = relatedMentors.map(mentor => {
      let score = 0;
      const mentorSkills = mentor.skills || [];
      
      // Count matching skills
      const matchingSkills = currentSkills.filter(skill => 
        mentorSkills.some((ms: string) => ms.toLowerCase() === skill.toLowerCase())
      );
      score += matchingSkills.length * 3; // Skills are weighted higher
      
      // Company match
      if (currentCompany && mentor.company && 
          mentor.company.toLowerCase() === currentCompany.toLowerCase()) {
        score += 2;
      }
      
      // Location match
      if (currentLocation && mentor.location && 
          mentor.location.toLowerCase() === currentLocation.toLowerCase()) {
        score += 1;
      }
      
      return { mentor, score };
    });

    // Sort by score (descending) and return formatted mentors (exclude email)
    const sortedMentors = scoredMentors
      .sort((a, b) => b.score - a.score)
      .map(item => formatPublicUserResponse(item.mentor));

    res.json(sortedMentors);
  } catch (error) {
    console.error('Get related mentors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};