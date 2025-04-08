import User from '../models/User.js';
import mongoose from 'mongoose';


export const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const createUser = async (req, res) => {
    const { name, email, password, image } = req.body;
    if (!name || !email || !password || !image) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    try {
        const newUser = new User({ name, email, password, image });
        await newUser.save();
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, image } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid user ID" });
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(id, { name, email, password, image }, { new: true });
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const deleteUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid user ID" });
    }
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
