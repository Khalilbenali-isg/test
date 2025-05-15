import express from "express";
import { createFeedback, getFeedback, DeleteFeedback, approveFeedback } from "../controllers/feedback.controller.js";
import { checkAuth, checkRole } from '../middleware/auth.js';

const router = express.Router();

router.post("/:userId",createFeedback);
router.get("/",getFeedback);
router.delete("/:id",DeleteFeedback);
router.put("/:id",checkAuth, checkRole (['admin']),approveFeedback);


export default router;