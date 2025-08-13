import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Placing order using COD Method
const placeOrder = async (req, res) => {
    try {
        const { items, amount, address } = req.body;
        const userId = req.user.id;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Placing order using Stripe Method
const placeOrderStripped = async (req, res) => {};

// Placing order using Razorpay Method
const placeOrderRazorpay = async (req, res) => {};

// All Order data for Admin Panel
const allOrders = async (req, res) => {
    try{
        const orders = await orderModel.find({})
        res.json({success:true,orders})
    }catch(error){
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Using Order Data for frontend
const userOrder = async (req, res) => {
    try {
        const userId = req.user.id; // token se le raha hai
        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// update Order status from admin
const updateStatus = async (req, res) => {};

export {
    placeOrder,
    placeOrderRazorpay,
    placeOrderStripped,
    allOrders,
    updateStatus,
    userOrder,
};
