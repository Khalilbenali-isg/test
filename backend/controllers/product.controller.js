import Product from '../models/product.js';
import mongoose from 'mongoose';
import UserProduct from '../models/UserProduct.js';
import Subscription from "../models/subscriptions.js";
import fs from 'fs';
import path from 'path';

export const getProducts = async(req, res) => {
    try {
        const products = await Product.find({});
        
        // Transform image paths to full URLs
        const productsWithFullImageUrls = products.map(product => ({
            ...product.toObject(),
            Image: product.Image ? `/api/products/image/${path.basename(product.Image)}` : null
        }));

        res.status(200).json({
            success: true, 
            data: productsWithFullImageUrls
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
    const { name, price, age, stock = 0 } = req.body;
    
    
    if (!req.file) {
        console.error('No file uploaded');
        return res.status(400).json({
            success: false,
            message: 'Image is required'
        });
    }
    
    if (!name || !price || !age) {
        
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (err) {
                console.error('Error removing uploaded file:', err);
            }
        }
        return res.status(400).json({
            success: false,
            message: 'Name, price, and age are required'
        });
    }

    try {
       
        const imagePath = req.file.path.replace(/\\/g, '/');

        const newProduct = new Product({
            name, 
            price, 
            Image: imagePath, 
            age, 
            stock: stock || 0  
        });

        await newProduct.save();
        
       
        const productResponse = newProduct.toObject();
        productResponse.Image = `/api/products/image/${path.basename(imagePath)}`;
        
        res.status(201).json({
            success: true, 
            data: productResponse
        }); 
    } catch(error) {
       
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (err) {
                console.error('Error removing uploaded file:', err);
            }
        }
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

        
        const productResponse = product.toObject();
        productResponse.Image = product.Image 
            ? `/api/products/image/${path.basename(product.Image)}` 
            : null;

        res.status(200).json({
            success: true, 
            data: productResponse
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({
            success: false, 
            message: error.message
        });
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    try {
       
        console.log('Update request for product ID:', id);
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);

        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        
        let { name, price, age, stock } = req.body;
        
        
        const updateData = {};
        
       
        if (name) updateData.name = name;
        if (price !== undefined && price !== '') updateData.price = Number(price);
        if (age !== undefined && age !== '') updateData.age = Number(age);
        if (stock !== undefined && stock !== '') updateData.stock = Number(stock);

        
        if (req.file) {
            //delete old
            if (existingProduct.Image) {
                try {
                    fs.unlinkSync(existingProduct.Image);
                } catch (err) {
                    console.error('Error deleting old image:', err);
                    
                }
            }
            updateData.Image = req.file.path.replace(/\\/g, '/');
        }

       
        console.log('Final update data to be applied:', JSON.stringify(updateData));
        console.log('Update data keys:', Object.keys(updateData));
        console.log('Update data values:', Object.values(updateData));

       
        if (Object.keys(updateData).length === 0 && !req.file) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update"
            });
        }

       
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            throw new Error('Update operation failed');
        }

       
        res.status(200).json({
            success: true,
            data: {
                ...updatedProduct.toObject(),
                Image: updatedProduct.Image 
                    ? `/api/products/image/${path.basename(updatedProduct.Image)}`
                    : null
            }
        });

    } catch (error) {
       
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (err) {
                console.error('Error removing uploaded file:', err);
            }
        }
        console.error('Update error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Update failed'
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

       
        if (deletedProduct.Image) {
            try {
                fs.unlinkSync(deletedProduct.Image);
            } catch (err) {
                console.log('Product image file not found or could not be deleted');
            }
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

/*export const getProductImage = (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), 'uploads/products', filename);
    
    
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            success: false,
            message: 'Image not found'
        });
    }
    
    res.sendFile(filePath);
}*/

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