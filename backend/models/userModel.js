import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },

        phone: { type: String, default: "" }, 

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        }, 

        cartData: { type: mongoose.Schema.Types.Mixed, default: {} },

        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],

        isNewUserDiscount: { type: Boolean, default: true },
    },
    { minimize: false },
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
