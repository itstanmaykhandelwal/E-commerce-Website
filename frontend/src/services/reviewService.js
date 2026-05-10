import api from "../lib/axios";

// =========================
// GET PRODUCT REVIEWS
// =========================

export const getReviews = async (productId) => {
    try {
        const response = await api.post("/api/review/list", {
            productId,
        });

        return response.data;
    } catch (error) {
        console.log(error);

        throw error;
    }
};

// =========================
// GET SINGLE REVIEW
// =========================

export const getSingleReview = async (reviewId) => {
    try {
        const response = await api.post("/api/review/single", {
            reviewId,
        });

        return response.data;
    } catch (error) {
        console.log(error);

        throw error;
    }
};

// =========================
// CREATE REVIEW
// =========================

export const createReview = async (reviewData) => {
    try {
        const response = await api.post("/api/review/add", reviewData);

        return response.data;
    } catch (error) {
        console.log(error);

        throw error;
    }
};

// =========================
// UPDATE REVIEW
// =========================

export const editReview = async (reviewData) => {
    try {
        const response = await api.post("/api/review/update", reviewData);

        return response.data;
    } catch (error) {
        console.log(error);

        throw error;
    }
};

// =========================
// DELETE REVIEW
// =========================

export const deleteReview = async (reviewId, productId) => {
    try {
        const response = await api.post("/api/review/remove", {
            reviewId,
            productId,
        });

        return response.data;
    } catch (error) {
        console.log("Delete Review Error:", error);

        throw error;
    }
};
