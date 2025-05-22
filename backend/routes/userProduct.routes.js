import express from 'express';
import { 
  assignSubscription, 
  getUserProducts,
  getAllBoughtProducts,
  getAllBoughtProductsPaginated
 
} from '../controllers/userProduct.controller.js';
import { checkAuth, checkRole } from '../middleware/auth.js';

const router = express.Router();


router.put('/:userProductId/subscribe', assignSubscription);
router.get('/user/:userId', getUserProducts);


router.get('/admin/all',checkAuth,checkRole(['admin']), getAllBoughtProducts);
router.get('/admin/paginated', checkAuth,checkRole(['admin']),getAllBoughtProductsPaginated);


export default router;