import express from 'express';
import { getNotifications, markNotificationRead } from '../controllers/notificationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getNotifications);

router.route('/:id')
  .put(protect, markNotificationRead);

export default router;
