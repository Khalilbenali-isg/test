import Leaderboard from '../models/leaderboard.js';
import User from '../models/User.js';

export const addScore = async (req, res) => {
  try {
    const { game, score, timeTaken } = req.body;
    const userId = req.user.id; 

    const newScore = await Leaderboard.create({
      userId,
      game,
      score,
      timeTaken
    });

    res.status(201).json(newScore);
  } catch (err) {
    res.status(500).json({ message: 'Error adding score', error: err.message });
  }
};

export const getTopScores = async (req, res) => {
  try {
    const { game } = req.params;

    const topScores = await Leaderboard.find({ game })
      .sort({ score: -1 }) 
      .limit(10)
      .populate('userId', 'name image'); 

    res.status(200).json(topScores);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching leaderboard', error: err.message });
  }
};
