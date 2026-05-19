import express from 'express';
import { getProducts, createProduct, deleteProduct } from '../controllers/productController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, createProduct);

router.route('/:id')
  .delete(protect, deleteProduct);

export default router;
