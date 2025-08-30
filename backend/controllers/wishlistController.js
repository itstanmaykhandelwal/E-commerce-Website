// controllers/wishlistController.js
import userModel from "../models/userModel.js";

// Add to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id; // token se aaya hoga
        const { productId } = req.body;

        if (!productId) {
            return res.json({ success: false, message: "Product ID required" });
        }

        const user = await userModel.findById(userId);
        if (!user)
            return res.json({ success: false, message: "User not found" });

        if (user.wishlist.includes(productId)) {
            return res.json({ success: false, message: "Already in wishlist" });
        }

        user.wishlist.push(productId);
        await user.save();

        res.json({
            success: true,
            message: "Added to wishlist",
            wishlist: user.wishlist,
        });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

// Remove from wishlist (REST style)
export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id; // 👈 ab params se milega

        if (!productId) {
            return res.json({ success: false, message: "Product ID required" });
        }

        const user = await userModel.findById(userId);
        if (!user)
            return res.json({ success: false, message: "User not found" });

        user.wishlist = user.wishlist.filter(
            (id) => id.toString() !== productId
        );
        await user.save();

        res.json({
            success: true,
            message: "Removed from wishlist",
            wishlist: user.wishlist,
        });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

// Get wishlist
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await userModel.findById(userId).populate("wishlist");
        if (!user)
            return res.json({ success: false, message: "User not found" });

        res.json({ success: true, wishlist: user.wishlist });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};
