import express from 'express';
import {
  createReview,
  getMentorReviews,
  updateReview,
  deleteReview,
  getUserReviewForMentor,
  getReviewsByUser,
} from '../controllers/reviewController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/mentor/:mentorId', getMentorReviews);
router.get('/mentor/:mentorId/my-review', protect, getUserReviewForMentor);
router.get('/user/:userId', getReviewsByUser);
router.put('/:reviewId', protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);

export default router;