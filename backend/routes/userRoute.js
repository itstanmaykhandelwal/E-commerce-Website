import express from "express";
import { loginUser,registerUser,adminLogin, profileUser, updateProfile, changePassword } from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.post("/admin",adminLogin);
// userRouter.post("/profile",profileUser)
userRouter.post("/profile", authUser, profileUser);
userRouter.post("/update", authUser, updateProfile);
userRouter.post("/change-password",authUser,changePassword); 



export default userRouter;
