import User from '../models/User.js';
import mongoose from 'mongoose';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/mailer.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const image = req.file ? `/uploads/users/${req.file.filename}` : null;

    if (!name || !email || !password || !image) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, email, password, image',
        missingFields: {
          name: !name,
          email: !email,
          password: !password,
          image: !image
        }
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already in use'
      });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 3600000); // 1 hour

    const newUser = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      image,
      role: role || 'client',
      Verified: false,
      verificationCode,
      verificationCodeExpires
    });

    await newUser.save();
    await sendVerificationEmail(email, verificationCode);

    const token = generateToken(newUser);
    res.status(201).json({
      success: true,
      message: 'User registered successfully. Verification email sent.',
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please check all required fields.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  const image = req.file ? `/uploads/users/${req.file.filename}` : undefined;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: 'Invalid user ID' });
  }

  try {
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own profile.'
      });
    }

    const updateData = { name };
    if (image) updateData.image = image;
    if (req.user.role === 'admin') {
      if (email) updateData.email = email;
      if (role) updateData.role = role;
    }

    if (req.body.password) {
      updateData.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


export const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: 'Invalid user ID' });
  }
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const verifyUser = async (req, res) => {
  const { email, verificationCode } = req.body;

  if (!email || !verificationCode) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and verification code are required' 
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    
    if (!user.verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'No verification code exists for this user. Please request a new one.'
      });
    }
    
    if (user.verificationCodeExpires && new Date() > user.verificationCodeExpires) {
      return res.status(400).json({ 
        success: false, 
        message: 'Verification code has expired' 
      });
    }

    
    if (user.verificationCode.toString() !== verificationCode.toString()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid verification code' 
      });
    }

    
    if (user.Verified) {
      return res.status(400).json({ 
        success: false, 
        message: 'User is already Verified' 
      });
    }

    
    user.Verified = true;
    user.verificationCode = undefined;
    await user.save();

    return res.status(200).json({ 
      success: true, 
      message: 'Email Verified successfully' 
    });

  } catch (error) {
    console.error('Error verifying user:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

export const resendVerification = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.Verified) return res.status(400).json({ success: false, message: 'User already verified' });

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = newCode;
    user.verificationCodeExpires = new Date(Date.now() + 3600000);
    await user.save();

    await sendVerificationEmail(email, newCode);
    
    return res.status(200).json({ success: true, message: 'New verification code sent' });
  } catch (error) {
    console.error('Error resending verification:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      
      return res.status(200).json({ 
        success: true, 
        message: 'If your email is registered, you will receive a password reset link' 
      });
    }

    
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); 
    await user.save();

    
    await sendPasswordResetEmail(email, resetToken);

    
    return res.status(200).json({ 
      success: true, 
      message: 'If your email is registered, you will receive a password reset link' 
    });

  } catch (error) {
    console.error('Error requesting password reset:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  
  if (!token || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Token and new password are required' 
    });
  }
  
  try {
    
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired password reset token' 
      });
    }
    
  
    user.password = await bcrypt.hash(password, 10);
    
    
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Password reset successful. You can now log in with your new password.' 
    });
    
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    if (!user.Verified) return res.status(403).json({ success: false, message: 'Email not verified' });

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        Verified: user.Verified,
        token
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id; 

  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required'
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      success: false,
      message: 'New password must be different from current password'
    });
  }

  try {
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID format" });
    }

    
    const user = await User.findById(userId).select('-password -verificationCode -resetPasswordToken');
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
