import express from 'express';


import { checkAuth } from '../middleware/auth.js';  

const router = express.Router();


router.get('/protected', checkAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'This is a protected route. You have access!',
  });
});

export default router;

