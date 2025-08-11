// import userModel from "../models/userModel.js";

// // Add products to user cart
// const addToCart = async (req, res) => {
//     console.log("Body:", req.body);
// console.log("User ID:", req.user.id);
//     try {
//         const { itemId, size, color } = req.body;
//         const userId = req.user.id; // ✅ from auth.js

//         let user = await userModel.findById(userId);
//         if (!user) {
//             return res
//                 .status(404)
//                 .json({ success: false, message: "User not found" });
//         }

//         let cartData = user.cartData || {};
//         if (!cartData[itemId]) cartData[itemId] = {};
//         if (!cartData[itemId][size]) cartData[itemId][size] = {};
//         cartData[itemId][size][color] =
//             (cartData[itemId][size][color] || 0) + 1;

//         user.cartData = cartData;
//         await user.save(); // ✅ save to MongoDB

//         res.json({
//             success: true,
//             message: "Added to cart",
//             cartData: user.cartData,
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// };

// // Update user cart
// const updateCart = async (req, res) => {
//     try {
//         const { itemId, size, color, quantity } = req.body;
//         const userId = req.user.id;

//         let user = await userModel.findById(userId);
//         let cartData = user.cartData || {};

//         if (cartData[itemId] && cartData[itemId][size]) {
//             cartData[itemId][size][color] = quantity;
//         }

//         user.cartData = cartData;
//         await user.save();

//         res.json({
//             success: true,
//             message: "Cart updated",
//             cartData: user.cartData,
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// };

// // Get user cart
// const getUserCart = async (req, res) => {
//     try {
//         const userId = req.user.id; // ✅ Auth se lo
//         const userData = await userModel.findById(userId);
//         if (!userData) {
//             return res
//                 .status(404)
//                 .json({ success: false, message: "User not found" });
//         }
//         res.json({ success: true, cartData: userData.cartData || {} });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// export { addToCart, updateCart, getUserCart };

import userModel from "../models/userModel.js";

// ✅ Add products to user cart
const addToCart = async (req, res) => {
    try {
        const { itemId, size, color } = req.body;
        const userId = req.user.id; // from auth middleware

        let user = await userModel.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        let cartData = user.cartData || {};

        if (!cartData[itemId]) cartData[itemId] = {};
        if (!cartData[itemId][size]) cartData[itemId][size] = {};
        cartData[itemId][size][color] =
            (cartData[itemId][size][color] || 0) + 1;

        user.cartData = cartData;

        // ✅ Mark nested object modified
        user.markModified("cartData");

        await user.save();

        res.json({
            success: true,
            message: "Added to cart",
            cartData: user.cartData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Update user cart
const updateCart = async (req, res) => {
    try {
        const { itemId, size, color, quantity } = req.body;
        const userId = req.user.id;

        let user = await userModel.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        let cartData = user.cartData || {};

        if (
            cartData[itemId] &&
            cartData[itemId][size] &&
            cartData[itemId][size][color] !== undefined
        ) {
            cartData[itemId][size][color] = quantity;
        }

        user.cartData = cartData;

        // ✅ Mark nested object modified
        user.markModified("cartData");

        await user.save();

        res.json({
            success: true,
            message: "Cart updated",
            cartData: user.cartData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Get user cart
const getUserCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        res.json({ success: true, cartData: user.cartData || {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getUserCart };
