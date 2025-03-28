import express from "express";
import { addToCart, getCart, removeFromCart, clearCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/:userId", getCart);
router.post("/add", addToCart);
router.delete("/remove/:userId/:productId", removeFromCart);
router.delete("/clear/:userId", clearCart);

export default router;
