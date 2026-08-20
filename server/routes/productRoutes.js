import express from 'express';
const router = express.Router();
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from '../controllers/productController.js';
import authMiddleware from '../middleware/auth.js';
import upload from '../middleware/upload.js';

router.get('/', getAllProducts);
router.post('/upload', authMiddleware, upload.single('image'), uploadProductImage);
router.get('/:id', getProductById);
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;