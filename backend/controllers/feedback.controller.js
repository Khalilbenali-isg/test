import mongoose from "mongoose";
import feedback from "../models/feedback.js";

export const createFeedback = async (req, res) => {
    const {userId , message }= req.body;

    if (!userId || !message) {
        return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }
    try{
        const newFeedback = new feedback({
            userId ,
            message,
            setAt: new Date(),
        });
        await newFeedback.save();
        res.status(201).json({
            success:true,
            data: newFeedback
        });
    }catch(error){
        console.error("error creating feedback", error);
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

export const getFeedback = async (req, res) => {
    try{
        const feedbacks = await feedback.find({});
        res.status(200).json({
            success:true,
            data: feedbacks
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};
export const DeleteFeedback = async (req, res) => {
    const {id} = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({
            success:false,
            message:"Feedback not found"
        })
    }
    try{
        const DeletedFeedback = await feedback.findByIdAndDelete(id);
        if(!DeletedFeedback){
            return res.status(404).json({
                success:false,
                message:"Feedback not found"
            });
        }
        res.status(200).json({
            success:true,
            message:"Feedback deleted successfully"
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
};

export const approveFeedback = async(req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Feedback not found" });
    }
    try {
        const feedbackToUpdate = await feedback.findById(id);
        if (!feedbackToUpdate) {
            return res.status(404).json({ success: false, message: "Feedback not found" });
        }
        feedbackToUpdate.Verified = true;
        await feedbackToUpdate.save();
        res.status(200).json({ success: true, data: feedbackToUpdate });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
}
};
    