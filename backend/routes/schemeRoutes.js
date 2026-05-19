import express from 'express';
import { getSchemes, createScheme, deleteScheme, applyForScheme } from '../controllers/schemeController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getSchemes)
  .post(protect, admin, createScheme);

router.route('/:id')
  .delete(protect, admin, deleteScheme);

router.route('/:id/apply')
  .post(protect, applyForScheme);

export default router;
