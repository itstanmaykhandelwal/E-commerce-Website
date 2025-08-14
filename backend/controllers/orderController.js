// import { currency } from "../../admin/src/App.jsx";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// Global Variables
const currency = 'inr'
const deliveryCharges = 10

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
const placeOrderStripped = async (req, res) => {
    try {
        const { items, amount, address } = req.body;
        const userId = req.user.id;
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now(),
        };
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data:{
                currency:currency,
                product_data:{
                    name:item.name
                },
                unit_amount: item.price * 100,
            },
            quantity:item.quantity
        }))
        line_items.push({
            price_data:{
                currency:currency,
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount: deliveryCharges * 100,
            },
            quantity:1
        })
        const session = await stripe.checkout.sessions.create({
            success_url:`${origin}/verify?sucess=true&orderId=${newOrder._id}`,
            cancel_url:`${origin}/verify?sucess=false&orderId=${newOrder._id}`,
            mode:'payment',
            // payment_method_types:['card'],
            line_items:line_items
        })

        res.json({ success: true, session_url: session.url  });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Verify Stripe
const verifyStripe = async(req,res) =>{
    const { orderId, success } = req.body;
    const userId = req.user.id;

    try{
        if(success === "true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            await userModel.findByIdAndUpdate(userId,{cartData:{}})
            res.json({success:true});
        }else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false });   
        }
    }catch(error){
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Placing order using Razorpay Method
const placeOrderRazorpay = async (req, res) => {};

// All Order data for Admin Panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
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
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    placeOrder,
    placeOrderRazorpay,
    placeOrderStripped,
    allOrders,
    updateStatus,
    userOrder,
    verifyStripe
};
