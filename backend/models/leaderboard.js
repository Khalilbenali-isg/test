import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  game: {
    type: String,
    required: true,
    enum: ['crossword', 'puzzle', 'quiz', 'custom'], 
    default: 'custom'
  },
  score: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number, 
  },
}, {
  timestamps: true 
});

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

export default Leaderboard;
