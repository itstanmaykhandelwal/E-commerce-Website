import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import wishRouter from './routes/wishlistRoute.js';
// import orderRouter from './routes/orderRoute.js';
// import wishlishrouter from './routes/wishlistRoute.js';


// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary()

// Middlewares
app.use(cors());
app.use(express.json());

// api endpoints
app.use("/api/user",userRouter);
app.use("/api/product",productRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);
app.use('/api/wishlist', wishRouter);

// Api Endpoints
app.get("/",(req,res) =>{
    res.send("API Working")
})

app.listen(port,()=> console.log(`Server is running on port ${port}`))