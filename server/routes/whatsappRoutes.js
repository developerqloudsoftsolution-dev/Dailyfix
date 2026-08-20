import express from 'express';
import {
  getStatus,
  getQrCode,
  connectWhatsApp,
  logoutWhatsApp,
  getSettings,
  updateSettings,
  sendTestMessage,
} from '../controllers/whatsappController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// All routes are strictly protected by admin authentication
router.use(authMiddleware);

router.get('/status', getStatus);
router.get('/qr', getQrCode);
router.post('/connect', connectWhatsApp);
router.post('/logout', logoutWhatsApp);

router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.post('/test-message', sendTestMessage);

export default router;
