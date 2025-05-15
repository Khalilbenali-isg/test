import express from 'express';
import { addScore, getTopScores } from '../controllers/leaderboard.Controller.js' 
import { checkAuth } from '../middleware/auth.js';

const router = express.Router();


router.post('/',checkAuth, addScore);
router.get('/:game', getTopScores);

export default router;
