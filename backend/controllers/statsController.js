import User from "../models/User.js";
import UserProduct from "../models/UserProduct.js";
import Product from "../models/product.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const usersByRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    const topSubscriptions = await UserProduct.aggregate([
      { $match: { subscriptionId: { $ne: null } } },
      { $group: { _id: "$subscriptionId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "_id",
          as: "subscription",
        },
      },
      { $unwind: "$subscription" },
      {
        $project: {
          name: "$subscription.name",
          count: 1,
        },
      },
    ]);

    const productPurchasesByMonth = await UserProduct.aggregate([
      {
        $group: {
          _id: { $month: "$purchasedAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    
    const productRevenue = await UserProduct.aggregate([
      
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" }, 
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $multiply: ["$quantity", "$product.price"]
            }
          },
          purchases: { $sum: 1 }
        }
      }
    ]);
      
    console.log("Product revenue:", productRevenue[0]?.totalRevenue || 0);
    console.log("Product purchases counted:", productRevenue[0]?.purchases || 0);
      
    
    const subscriptionRevenueByMonth = await UserProduct.aggregate([
      { $match: { subscriptionId: { $ne: null } } },
      {
        $lookup: {
          from: "subscriptions",
          localField: "subscriptionId",
          foreignField: "_id",
          as: "subscription",
        },
      },
      { $unwind: "$subscription" },
      {
        $group: {
          _id: {
            month: { $month: "$purchasedAt" },
            year: { $year: "$purchasedAt" },
            subscriptionName: "$subscription.name",
          },
          totalRevenue: { $sum: "$subscription.price" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({
      totalUsers,
      usersByRole,
      topSubscriptions,
      productPurchasesByMonth,
      totalProductRevenue: productRevenue[0]?.totalRevenue || 0,
      subscriptionRevenueByMonth,
    });
      
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: err.message });
  }
};