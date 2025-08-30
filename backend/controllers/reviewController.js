import reviewModel from "../models/reviewModel.js";

// ✅ Add Review
const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        if (!productId || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const review = new reviewModel({
            productId,
            userId: req.user.id, // auth se aa raha hai
            rating,
            comment,
        });

        await review.save();

        res.json({ success: true, message: "Review added successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
const updateReview = async (req, res) => {
    try {
        const { id, rating, comment } = req.body;

        if (!id || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Sirf wahi user update kar sake jo review ka owner hai
        const review = await reviewModel.findOne({
            _id: id,
            userId: req.user.id,
        });
        if (!review) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to edit this review",
            });
        }

        review.rating = rating;
        review.comment = comment;
        await review.save();

        res.json({ success: true, message: "Review updated successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
// ✅ List Reviews for a Product
const listReviews = async (req, res) => {
    try {
        const { productId } = req.body;
        const reviews = await reviewModel
            .find({ productId })
            .populate("userId", "name email");
        res.json({ success: true, reviews });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ✅ Remove Review
const removeReview = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: "Review ID is required" });
        }

        // Sirf wahi user delete kar sakta hai jisne review likha
        const review = await reviewModel.findOne({
            _id: id,
            userId: req.user.id,
        });

        if (!review) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this review",
            });
        }

        await review.deleteOne();

        res.json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// ✅ Single Review
const singleReview = async (req, res) => {
    try {
        const { id } = req.body;
        const review = await reviewModel
            .findById(id)
            .populate("userId", "name email");
        res.json({ success: true, review });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addReview, listReviews, removeReview, singleReview, updateReview };
