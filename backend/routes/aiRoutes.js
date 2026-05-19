import express from 'express';
import { recommendCrop, detectDisease, getChatbotResponse } from '../controllers/aiController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/recommend-crop', protect, recommendCrop);
router.post('/detect-disease', protect, detectDisease);
router.post('/chatbot', protect, getChatbotResponse);

export default router;
