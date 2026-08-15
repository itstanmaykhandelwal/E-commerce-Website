import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

// =========================
// ADD TO CART
// =========================

const addToCart = async (req, res) => {
    try {
        const { itemId, size, color, quantity = 1 } = req.body;

        const userId = req.user.id;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Get real product from database
        const product = await productModel.findById(itemId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Total available stock
        const stock = Number(product.quantity) || 0;

        if (stock <= 0) {
            return res.status(400).json({
                success: false,
                message: "Product is out of stock",
            });
        }

        let cartData = user.cartData || {};

        // Create product entry
        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        // Create size entry
        if (!cartData[itemId][size]) {
            cartData[itemId][size] = {};
        }

        // =========================
        // CALCULATE CURRENT QUANTITY
        // =========================

        let currentTotal = 0;

        for (const currentSize in cartData[itemId]) {
            const sizeData = cartData[itemId][currentSize];

            if (typeof sizeData === "object" && sizeData !== null) {
                for (const currentColor in sizeData) {
                    currentTotal +=
                        Number(sizeData[currentColor]) || 0;
                }
            } else {
                currentTotal += Number(sizeData) || 0;
            }
        }

        const requestedQuantity = Number(quantity) || 1;

        // =========================
        // STOCK CHECK
        // =========================

        if (currentTotal + requestedQuantity > stock) {
            const availableQuantity = Math.max(
                stock - currentTotal,
                0,
            );

            return res.status(400).json({
                success: false,
                message:
                    availableQuantity > 0
                        ? `Only ${availableQuantity} item(s) available`
                        : "No more stock available",
                availableQuantity,
            });
        }

        // =========================
        // ADD PRODUCT TO CART
        // =========================

        cartData[itemId][size][color] =
            (Number(cartData[itemId][size][color]) || 0) +
            requestedQuantity;

        user.cartData = cartData;

        user.markModified("cartData");

        await user.save();

        return res.json({
            success: true,
            message: "Added to cart",
            cartData: user.cartData,
        });
    } catch (error) {
        console.error("Add To Cart Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// =========================
// UPDATE CART
// =========================

const updateCart = async (req, res) => {
    try {
        const { itemId, size, color, quantity } = req.body;

        const userId = req.user.id;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Get real product
        const product = await productModel.findById(itemId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        let cartData = user.cartData || {};

        // Check cart item exists
        if (
            !cartData[itemId] ||
            !cartData[itemId][size] ||
            cartData[itemId][size][color] === undefined
        ) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found",
            });
        }

        const newQuantity = Number(quantity);

        // =========================
        // REMOVE ITEM
        // =========================

        if (newQuantity <= 0) {
            delete cartData[itemId][size][color];

            // Remove empty size
            if (Object.keys(cartData[itemId][size]).length === 0) {
                delete cartData[itemId][size];
            }

            // Remove empty product
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }

            user.cartData = cartData;

            user.markModified("cartData");

            await user.save();

            return res.json({
                success: true,
                message: "Cart item removed",
                cartData: user.cartData,
            });
        }

        // =========================
        // CALCULATE OTHER QUANTITY
        // =========================

        let otherQuantity = 0;

        for (const currentSize in cartData[itemId]) {
            const sizeData = cartData[itemId][currentSize];

            if (
                typeof sizeData === "object" &&
                sizeData !== null
            ) {
                for (const currentColor in sizeData) {
                    // Don't count the item we're updating
                    if (
                        currentSize === size &&
                        currentColor === color
                    ) {
                        continue;
                    }

                    otherQuantity +=
                        Number(sizeData[currentColor]) || 0;
                }
            }
        }

        // =========================
        // STOCK CHECK
        // =========================

        const stock = Number(product.quantity) || 0;

        if (otherQuantity + newQuantity > stock) {
            const availableQuantity = Math.max(
                stock - otherQuantity,
                0,
            );

            return res.status(400).json({
                success: false,
                message:
                    availableQuantity > 0
                        ? `Only ${availableQuantity} item(s) available`
                        : "No more stock available",
                availableQuantity,
            });
        }

        // =========================
        // UPDATE QUANTITY
        // =========================

        cartData[itemId][size][color] = newQuantity;

        user.cartData = cartData;

        user.markModified("cartData");

        await user.save();

        return res.json({
            success: true,
            message: "Cart updated",
            cartData: user.cartData,
        });
    } catch (error) {
        console.error("Update Cart Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// =========================
// GET USER CART
// =========================

const getUserCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.json({
            success: true,
            cartData: user.cartData || {},
        });
    } catch (error) {
        console.error("Get Cart Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// =========================
// EXPORT
// =========================

export {
    addToCart,
    updateCart,
    getUserCart,
};