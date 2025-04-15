import UserProduct from '../models/UserProduct.js';
import Product from '../models/product.js';
import Subscription from '../models/subscriptions.js';
import mongoose from 'mongoose';


export const assignSubscription = async (req, res) => {
  const { userProductId } = req.params;
  const { subscriptionId } = req.body;

  try {
    const userProduct = await UserProduct.findById(userProductId);
    if (!userProduct) return res.status(404).json({ success: false, message: "Not found" });

    userProduct.subscriptionId = subscriptionId;
    await userProduct.save();

    res.json({ success: true, message: "Subscription assigned", data: userProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getUserProducts = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ 
      success: false, 
      message: "Invalid user ID" 
    });
  }

  try {

    const userProducts = await UserProduct.find({ userId })
      .populate('productId')
      .populate('subscriptionId')
      .exec();

    if (!userProducts || userProducts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No products found for this user",
        data: []
      });
    }

 
    const formattedProducts = userProducts.map(userProduct => ({
      _id: userProduct._id,
      userId: userProduct.userId,
      quantity: userProduct.quantity,
      purchasedAt: userProduct.purchasedAt,
      expiresAt: userProduct.expiresAt,
      product: userProduct.productId,
      subscription: userProduct.subscriptionId
    }));

    res.status(200).json({
      success: true,
      data: formattedProducts
    });
  } catch (error) {
    console.error("Error fetching user products:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};