import express from 'express';
import {
  getUserById,
  getMentors,
  getStudents,
  updateProfile,
  getCurrentProfile,
  uploadAvatar,
  changePassword
} from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/mentors', getMentors);
router.get('/students', getStudents);
router.get('/:id', getUserById);

router.use(protect);
router.get('/profile', getCurrentProfile);
router.put('/profile', updateProfile);
router.post('/avatar', uploadAvatar);
router.put('/change-password', changePassword);

export default router;