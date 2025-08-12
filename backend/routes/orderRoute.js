import express from 'express';
import {placeOrder,placeOrderRazorpay,placeOrderStripped,allOrders,updateStatus,userOrder} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin Feature
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

// Payment Features
orderRouter.post('/place',authUser,placeOrder)               
orderRouter.post('/stripe',authUser,placeOrderStripped)               
orderRouter.post('/razorpay',authUser,placeOrderRazorpay)               

// User Feature
orderRouter.post('/userorders',authUser,userOrder)

export default orderRouter