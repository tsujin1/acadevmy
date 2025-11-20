import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Review from '../models/Review';
import User from '../models/User';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/auth';

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { mentorId, rating, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can submit reviews' });
    }

    const mentor = await User.findById(mentorId);
    if (!mentor || !mentor.isMentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    if (mentorId.toString() === userId.toString()) {
      return res.status(400).json({ message: 'Cannot review yourself' });
    }

    const existingReview = await Review.findOne({ mentorId, userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this mentor' });
    }

    const review = new Review({ mentorId, userId, rating, comment });
    const savedReview = await review.save();

    const reviewId = (savedReview._id as mongoose.Types.ObjectId).toString();

    const notification = new Notification({
      recipient: mentorId,
      sender: userId,
      type: 'review',
      title: 'New Review Received',
      message: `${user.firstName} ${user.lastName} left a review.`,
      relatedId: reviewId
    });

    await notification.save();

    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getMentorReviews = async (req: Request, res: Response) => {
  try {
    const { mentorId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return res.status(400).json({ message: 'Invalid mentor ID' });
    }

    const reviews = await Review.find({ mentorId })
      .populate('userId', 'firstName lastName avatar role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({ mentorId });

    const ratingStats = await Review.aggregate([
      { $match: { mentorId: new mongoose.Types.ObjectId(mentorId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: { $push: '$rating' }
        }
      }
    ]);

    const stats = ratingStats[0] || {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: []
    };

    const distribution = [1, 2, 3, 4, 5].map(star => ({
      star,
      count: stats.ratingDistribution.filter((r: number) => r === star).length
    }));

    res.json({
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        hasNext: page < Math.ceil(totalReviews / limit),
        hasPrev: page > 1
      },
      stats: {
        averageRating: Math.round(stats.averageRating * 10) / 10 || 0,
        totalReviews: stats.totalReviews,
        distribution
      }
    });
  } catch (error) {
    console.error('Get mentor reviews error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.userId.toString() !== userId?.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    review.rating = rating;
    review.comment = comment;

    const updatedReview = await review.save();
    await updatedReview.populate('userId', 'firstName lastName avatar role');

    res.json(updatedReview);
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.id;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.userId.toString() !== userId?.toString()) {
      const user = await User.findById(userId);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this review' });
      }
    }

    await Review.findByIdAndDelete(reviewId);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getUserReviewForMentor = async (req: AuthRequest, res: Response) => {
  try {
    const { mentorId } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'User not authenticated' });

    const review = await Review.findOne({ mentorId, userId })
      .populate('userId', 'firstName lastName avatar role');

    res.json(review);
  } catch (error) {
    console.error('Get user review error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'firstName lastName avatar role')
      .populate('mentorId', 'firstName lastName avatar role title company')
      .sort({ createdAt: -1 });

    res.json({ reviews, totalReviews: reviews.length });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getReviewsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const reviews = await Review.find({ userId })
      .populate('mentorId', 'firstName lastName avatar role title company')
      .sort({ createdAt: -1 });

    res.json({ reviews, totalReviews: reviews.length });
  } catch (error) {
    console.error('Get reviews by user error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};