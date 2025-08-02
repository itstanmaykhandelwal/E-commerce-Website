import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
    mongoose.connection.on("connected", () => {
        console.log("✅ MongoDB Connected");
    });

    mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
    });

    try {
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.error("Failed to connect DB:", error.message);
        process.exit(1);
    }
};

export default connectDB;
