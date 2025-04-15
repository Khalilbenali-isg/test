import express from 'express';
import { assignSubscription, getUserProducts } from '../controllers/userProduct.controller.js';

const router = express.Router();

router.put('/:userProductId/subscribe', assignSubscription);
router.get('/user/:userId', getUserProducts);

export default router;