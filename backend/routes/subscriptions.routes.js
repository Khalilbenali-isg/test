import express from 'express';
import {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription
} from '../controllers/subscriptions.controller.js';
import { checkAuth, checkRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/',checkAuth,checkRole(['admin']), createSubscription);
router.get('/', getSubscriptions);
router.get('/:id', getSubscriptionById);
router.put('/:id',checkAuth,checkRole(['admin']), updateSubscription);
router.delete('/:id',checkAuth,checkRole(['admin']), deleteSubscription);

export default router;
