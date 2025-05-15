
import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message:{ type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  Verified: { type: Boolean, default: false }
  
});

const feedback = mongoose.model("feedback", feedbackSchema);
export default feedback;
