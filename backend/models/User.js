import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: {type: String, required: true
    },
    role: { type: String, enum: ['admin', 'client'], default: 'client' },
    Verified: { type: Boolean, default: false },
    verificationCode: {
        type: String,
        required: false
      },
      
      
  verificationCodeExpires: Date,
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },

}, { timestamps: true });


userSchema.index({ verificationCode: 1 }); // Faster verification
userSchema.index({ Verified: 1 }); // Faster login checks

const User = mongoose.model('User', userSchema);
export default User;
