import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        cartData: { type: mongoose.Schema.Types.Mixed, default: {} }, // ✅ cart ke liye
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }], // ✅ wishlist ke liye array of product IDs
    },
    { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
