import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};
// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid Credentials" });
        }
    } catch (error) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
};

// Route for User Register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Checking user already exist
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // validating email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Please enter a valid email",
            });
        }
        if (password.length < 6) {
            return res.json({
                success: false,
                message: "Please enter a strong password",
            });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            isNewUserDiscount: true,
        });
        const user = await newUser.save();

        const token = createToken(user._id);

        res.json({ success: true, token });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
};

// Route: Update profile
const updateProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res
                .status(401)
                .json({ success: false, message: "Not authenticated" });
        }

        const { name, email } = req.body;
        if (!name || !email) {
            return res.json({
                success: false,
                message: "Name and Email are required",
            });
        }

        const updatedUser = await userModel
            .findByIdAndUpdate(
                req.user.id,
                { name, email },
                { new: true, runValidators: true }
            )
            .select("-password");

        res.json({ success: true, user: updatedUser });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
};

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid Credentials" });
        }
    } catch (error) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
};
// New: Get profile details
const profileUser = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res
                .status(401)
                .json({ success: false, message: "User not authenticated" });
        }

        const user = await userModel.findById(req.user.id).select("-password"); // password removed
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.user.id; // JWT middleware se aayega
        const { oldPassword, newPassword } = req.body;

        const user = await userModel.findById(userId);
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch)
            return res
                .status(400)
                .json({ success: false, message: "Old password is incorrect" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export {
    loginUser,
    registerUser,
    adminLogin,
    profileUser,
    updateProfile,
    changePassword,
};
