// routes/reviewRoutes.js
import express from "express";
import authUser from "../middleware/auth.js";   // <-- add this import
import {
  addReview,
  listReviews,
  removeReview,
  singleReview,
  updateReview,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

// ✅ Auth sirf un routes par jahan user identity chahiye
reviewRouter.post("/add", authUser, addReview);
reviewRouter.post("/remove", authUser, removeReview);
reviewRouter.post("/update", authUser, updateReview);

// ❕ List/single public reh sakte hain (auth optional)
reviewRouter.post("/list", listReviews);
reviewRouter.post("/single", singleReview);

export default reviewRouter;
