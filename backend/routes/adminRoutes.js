import express from 'express';
import { getUsers, deleteUser, getPlatformStats } from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.get('/stats', protect, admin, getPlatformStats);

export default router;
