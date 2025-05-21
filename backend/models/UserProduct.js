
import mongoose from "mongoose";

const userProductSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription", default: null },
  quantity: { type: Number, default: 1 },
  purchasedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  status: { 
    type: String, 
    enum: ['delivery', 'delivered'], 
    default: 'delivery' 
  },
  // Add these fields for tracking delivery
  deliveryStartedAt: { type: Date, default: Date.now },
  deliveredAt: { type: Date }
});

const UserProduct = mongoose.model("UserProduct", userProductSchema);
export default UserProduct;
