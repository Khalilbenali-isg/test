import Product from '../models/product.js';
import mongoose from 'mongoose';
import UserProduct from '../models/UserProduct.js';
import Subscription from "../models/subscriptions.js";


export const getProducts = async(req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({
            success: true, 
            data: products
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            success: false, 
            message: error.message
        });
    }
}

export const createProduct = async(req, res) => {
    const { name, price, Image, age, stock = 0 } = req.body;
    
    
    if (!name || !price || !Image || !age) {
        return res.status(400).json({
            success: false,
            message: 'Name, price, image, and age are required'
        });
    }

    try {
        const newProduct = new Product({
            name, 
            price, 
            Image, 
            age, 
            stock: stock || 0  
        });

        await newProduct.save();
        
        res.status(201).json({
            success: true, 
            data: newProduct
        }); 
    } catch(error) {
        console.error("Error creating product:", error);
        res.status(500).json({
            success: false, 
            message: error.message
        });
    }
}

export const getProductById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            success: false, 
            message: "Invalid product id"
        });
    }

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false, 
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true, 
            data: product
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({
            success: false, 
            message: error.message
        });
    }
}

export const updateProduct = async(req, res) => {
    const { id } = req.params;
    const { name, price, Image, age, stock } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            success: false, 
            message: "Invalid product id"
        });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id, 
            { name, price, Image, age, stock }, 
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false, 
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true, 
            data: updatedProduct
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            success: false, 
            message: error.message
        });
    }
}

export const deleteProduct = async(req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            success: false, 
            message: "Invalid product id"
        });
    }

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false, 
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true, 
            message: 'Product deleted successfully'
        });
    } catch(error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            success: false, 
            message: error.message
        });
    }
}



export const purchaseProduct = async (req, res) => {
    const { id } = req.params;
    const { userId, subscriptionId , quantity = 1 } = req.body;
  
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
  
      if (product.stock < quantity) {
        return res.status(400).json({ success: false, message: "Not enough stock" });
      }
      
      product.stock -= quantity;
      await product.save();
  
      // subscription duration
      let expiresAt = null;
      if (subscriptionId) {
        const subscription = await Subscription.findById(subscriptionId);
        if (subscription && subscription.durationInDays) {
          const now = new Date();
          expiresAt = new Date(now.getTime() + subscription.durationInDays * 24 * 60 * 60 * 1000);
        }
      }
  
      //userProduct with expiration
      const userProduct = new UserProduct({
        userId,
        productId: id,
        subscriptionId: subscriptionId || null,
        quantity, 
        purchasedAt: new Date(),
        expiresAt,
      });
  
      await userProduct.save();
  
      res.json({
        success: true,
        message: "Product purchased successfully",
        newStock: product.stock,
        userProductId: userProduct._id,
      });
    } catch (error) {
      console.error("Error purchasing product:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
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
  
