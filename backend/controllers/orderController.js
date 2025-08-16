// import { currency } from "../../admin/src/App.jsx";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import razorpay from "razorpay";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Global Variables
const currency = "INR";
const deliveryCharges = 10;

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Placing order using COD Method
// const placeOrder = async (req, res) => {
//     try {
//         const { items, amount, address } = req.body;
//         const userId = req.user.id;

//         const orderData = {
//             userId,
//             items,
//             address,
//             amount,
//             paymentMethod: "COD",
//             payment: false,
//             date: Date.now(),
//         };

//         const newOrder = new orderModel(orderData);
//         await newOrder.save();

//         await userModel.findByIdAndUpdate(userId, { cartData: {} });

//         res.json({ success: true, message: "Order Placed" });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// };

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

        // ✅ Mail bhej
        const user = await userModel.findById(userId);
        await sendOrderMail(user, newOrder);

        res.json({ success: true, message: "Order Placed & Email Sent" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Placing order using Stripe Method
const placeOrderStripped = async (req, res) => {
    try {
        const { items, amount, address, frontendUrl } = req.body; // frontend se frontendUrl bhejo
        const userId = req.user.id;

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
            price_data: {
                currency: currency,
                product_data: { name: item.name },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: { name: "Delivery Charges" },
                unit_amount: deliveryCharges * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`,
            mode: "payment",
            line_items: line_items,
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Verify Stripe
const verifyStripe = async (req, res) => {
    const { orderId, success } = req.body;
    const userId = req.user.id;

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({ success: true });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Placing order using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
    try {
        const { items, amount, address } = req.body; // frontend se frontendUrl bhejo
        const userId = req.user.id;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now(),
        };
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString(),
        };
        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.json({ success: false, message: error });
            }
            res.json({ success: true, order });
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            req.body;
        const userId = req.user.id;

        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        // signature verify karo
        const hmac = crypto.createHmac("sha256", key_secret);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generatedSignature = hmac.digest("hex");

        if (generatedSignature === razorpay_signature) {
            // Razorpay order fetch karo
            const orderInfo = await razorpayInstance.orders.fetch(
                razorpay_order_id
            );

            // MongoDB me order receipt ke basis par update karo
            await orderModel.findByIdAndUpdate(orderInfo.receipt, {
                payment: true,
            });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });

            res.json({ success: true, message: "Payment Successful" });
        } else {
            res.json({
                success: false,
                message: "Payment Verification Failed",
            });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
// Cancel Order
const cancelOrder = async (req, res) => {
    try {
        const { orderId, reason } = req.body; // ✅ frontend se reason bhi aayega
        const userId = req.user.id;

        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        // Sirf wahi banda cancel kar sake jisne order kiya hai
        if (order.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: "Not Authorized" });
        }

        // Agar already delivered hai to cancel na ho
        if (order.status === "Delivered") {
            return res.json({
                success: false,
                message: "Order already delivered, cannot cancel",
            });
        }

        // Cancel logic
        order.status = "Cancelled";
        order.cancelReason = reason; // ✅ is field ko schema me add karo
        if (order.payment && order.paymentMethod !== "COD") {
            order.isRefundInitiated = true; // optional flag
        }

        await order.save();

        res.json({ success: true, message: "Order cancelled successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
const sendOrderMail = async (user, order) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Forever App" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Order Confirmation - Forever App",
            html: `
        <h2>Hi ${user.name}, your order is confirmed ✅</h2>
        <p><b>Order ID:</b> ${order._id}</p>
        <p><b>Total:</b> ₹${order.amount}</p>
        <p><b>Payment Method:</b> ${order.paymentMethod}</p>
        <h3>Items:</h3>
        <ul>
          ${order.items
              .map((item) => `<li>${item.name} x ${item.quantity}</li>`)
              .join("")}
        </ul>
        <p>Delivery Address: ${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.zipcode}</p>
      `,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("Mail error:", error);
    }
};

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
    verifyStripe,
    verifyRazorpay,
    cancelOrder,
};
