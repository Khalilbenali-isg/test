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
      status: userProduct.status,
      deliveryStartedAt: userProduct.deliveryStartedAt,
      deliveredAt: userProduct.deliveredAt,
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
export const getAllBoughtProducts = async (req, res) => {
  try {
    // Get all user products with populated user and product data
    const boughtProducts = await UserProduct.find({})
      .populate({
        path: 'userId',
        select: 'name email image', // Only get necessary user fields
        model: 'User'
      })
      .populate({
        path: 'productId',
        select: 'name price image description category', // Only get necessary product fields
        model: 'Product'
      })
      .populate({
        path: 'subscriptionId',
        select: 'name type duration price',
        model: 'Subscription'
      })
      .sort({ purchasedAt: -1 }) // Sort by most recent purchases first
      .exec();

    if (!boughtProducts || boughtProducts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No purchased products found",
        data: []
      });
    }

    // Format the response data
    const formattedData = boughtProducts.map(userProduct => ({
      _id: userProduct._id,
      quantity: userProduct.quantity,
      purchasedAt: userProduct.purchasedAt,
      expiresAt: userProduct.expiresAt,
      status: userProduct.status,
      deliveryStartedAt: userProduct.deliveryStartedAt,
      deliveredAt: userProduct.deliveredAt,
      user: {
        _id: userProduct.userId?._id,
        name: userProduct.userId?.name,
        email: userProduct.userId?.email,
        image: userProduct.userId?.image
      },
      product: {
        _id: userProduct.productId?._id,
        name: userProduct.productId?.name,
        price: userProduct.productId?.price,
        image: userProduct.productId?.image,
        description: userProduct.productId?.description,
        category: userProduct.productId?.category
      },
      subscription: userProduct.subscriptionId ? {
        _id: userProduct.subscriptionId._id,
        name: userProduct.subscriptionId.name,
        type: userProduct.subscriptionId.type,
        duration: userProduct.subscriptionId.duration,
        price: userProduct.subscriptionId.price
      } : null,
      totalValue: userProduct.quantity * (userProduct.productId?.price || 0)
    }));

    res.status(200).json({
      success: true,
      data: formattedData,
      count: formattedData.length
    });

  } catch (error) {
    console.error("Error fetching all bought products:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching bought products",
      error: error.message
    });
  }
};

// Admin function: Get bought products with pagination and filtering
export const getAllBoughtProductsPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Optional filters
    const { status, userId, productId, startDate, endDate } = req.query;
    
    // Build filter object
    let filter = {};
    if (status) filter.status = status;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) filter.userId = userId;
    if (productId && mongoose.Types.ObjectId.isValid(productId)) filter.productId = productId;
    
    // Date range filter
    if (startDate || endDate) {
      filter.purchasedAt = {};
      if (startDate) filter.purchasedAt.$gte = new Date(startDate);
      if (endDate) filter.purchasedAt.$lte = new Date(endDate);
    }

    // Get total count for pagination
    const totalCount = await UserProduct.countDocuments(filter);
    
    // Get paginated results
    const boughtProducts = await UserProduct.find(filter)
      .populate({
        path: 'userId',
        select: 'name email image',
        model: 'User'
      })
      .populate({
        path: 'productId',
        select: 'name price image description category',
        model: 'Product'
      })
      .populate({
        path: 'subscriptionId',
        select: 'name type duration price',
        model: 'Subscription'
      })
      .sort({ purchasedAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // Format the response data
    const formattedData = boughtProducts.map(userProduct => ({
      _id: userProduct._id,
      quantity: userProduct.quantity,
      purchasedAt: userProduct.purchasedAt,
      expiresAt: userProduct.expiresAt,
      status: userProduct.status,
      deliveryStartedAt: userProduct.deliveryStartedAt,
      deliveredAt: userProduct.deliveredAt,
      user: {
        _id: userProduct.userId?._id,
        name: userProduct.userId?.name,
        email: userProduct.userId?.email,
        image: userProduct.userId?.image
      },
      product: {
        _id: userProduct.productId?._id,
        name: userProduct.productId?.name,
        price: userProduct.productId?.price,
        image: userProduct.productId?.image,
        description: userProduct.productId?.description,
        category: userProduct.productId?.category
      },
      subscription: userProduct.subscriptionId ? {
        _id: userProduct.subscriptionId._id,
        name: userProduct.subscriptionId.name,
        type: userProduct.subscriptionId.type,
        duration: userProduct.subscriptionId.duration,
        price: userProduct.subscriptionId.price
      } : null,
      totalValue: userProduct.quantity * (userProduct.productId?.price || 0)
    }));

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      data: formattedData,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error("Error fetching paginated bought products:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching bought products",
      error: error.message
    });
  }
};