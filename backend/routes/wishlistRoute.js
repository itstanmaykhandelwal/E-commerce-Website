// routes/wishlistRoute.js
import express from "express";
import { addToWishlist, removeFromWishlist, getWishlist } from "../controllers/wishlistController.js";
import authUser from '../middleware/auth.js';
const wishRouter = express.Router();

wishRouter.post("/add",authUser,addToWishlist);
// wishRouter.post("/remove",authUser,removeFromWishlist);
wishRouter.delete("/remove/:id", authUser, removeFromWishlist);
wishRouter.get("/",authUser,getWishlist);

export default wishRouter;
