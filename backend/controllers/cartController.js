import userModel from "../models/userModel.js";
// cartController.js - Backend cart controller

// Add item to cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData || {};
        
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }
        
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Added to cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding to cart" });
    }
}

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData || {};
        
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }
        
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Removed from cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing from cart" });
    }
}

// Get cart data - THIS IS THE FIXED VERSION
const getCart = async (req, res) => {
    try {
        // Check if userId exists (from auth middleware)
        if (!req.body.userId) {
            return res.json({ success: false, message: "User not authenticated" });
        }
        
        let userData = await userModel.findById(req.body.userId);
        
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }
        
        let cartData = userData.cartData || {};
        res.json({ success: true, data: cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching cart" });
    }
}

export { addToCart, removeFromCart, getCart };