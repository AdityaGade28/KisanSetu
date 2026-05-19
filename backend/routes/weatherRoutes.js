import express from 'express';
import { getWeatherForecast } from '../controllers/weatherController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/forecast', protect, getWeatherForecast);

export default router;
