import express from 'express';
const router = express.Router();
import {
  login,
  logout,
  getDashboardStats,
  sendOtp,
  verifyOtp,
  resetPassword,
  getAllCustomers,
  getCustomerOrders,
  getAllAdmins,
  createAdmin,
  updateAdmin,
  updateAdminPassword,
  deleteAdmin,
} from '../controllers/adminController.js';
import authMiddleware from '../middleware/auth.js';

// Auth routes
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/logout', authMiddleware, logout);

// Dashboard & Customers
router.get('/dashboard', authMiddleware, getDashboardStats);
router.get('/users', authMiddleware, getAllCustomers);
router.get('/users/:email/orders', authMiddleware, getCustomerOrders);

// Admin Account Management (Protected)
router.get('/admins', authMiddleware, getAllAdmins);
router.post('/admins', authMiddleware, createAdmin);
router.put('/admins/:id', authMiddleware, updateAdmin);
router.put('/admins/:id/password', authMiddleware, updateAdminPassword);
router.delete('/admins/:id', authMiddleware, deleteAdmin);

export default router;