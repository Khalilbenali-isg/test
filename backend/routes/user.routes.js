import express from 'express';
import { 
  getUsers, 
  loginUser, 
  createUser, 
  updateUser, 
  deleteUser, 
  verifyUser, 
  resendVerification ,
  requestPasswordReset,
  resetPassword,
  getUserById,
  changePassword
} from '../controllers/user.controller.js';
import { checkAuth, checkRole } from '../middleware/auth.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.post('/',upload.single('image'), createUser);  
router.post('/login', loginUser);  
router.post('/verify', verifyUser);  
router.post('/resend-verification', resendVerification);  
router.post('/request-password-reset', requestPasswordReset);  
router.post('/reset-password', resetPassword); 

router.post('/change-password', checkAuth, changePassword);



router.get('/',  getUsers);  
router.get('/:id', checkAuth, getUserById); 
router.put('/:id', checkAuth,upload.single('image'), updateUser);  
router.delete('/:id', checkAuth, checkRole(['admin']), deleteUser);  



export default router;