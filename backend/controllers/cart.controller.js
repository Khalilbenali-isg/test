import Cart from "../models/cart.js";
import Product from "../models/product.js";

// Get User Cart
export const getCart = async (req, res) => {
    const { userId } = req.params;
    try {
        const cart = await Cart.findOne({ userId }).populate("products.productId");
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add to Cart
export const addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, products: [{ productId, quantity }] });
        } else {
            const existingProduct = cart.products.find(p => p.productId.toString() === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }
        }

        await cart.save();
        res.status(200).json({ success: true, message: "Product added to cart", data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Remove Item from Cart
export const removeFromCart = async (req, res) => {
    const { userId, productId } = req.params;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        cart.products = cart.products.filter(p => p.productId.toString() !== productId);
        await cart.save();

        res.status(200).json({ success: true, message: "Product removed from cart", data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Clear Cart
export const clearCart = async (req, res) => {
    const { userId } = req.params;
    try {
        await Cart.findOneAndDelete({ userId });
        res.status(200).json({ success: true, message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
