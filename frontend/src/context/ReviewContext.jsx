import React, { createContext, useState } from "react";

import {
    getReviews,
    createReview,
    editReview,
    deleteReview,
} from "../services/reviewService";

// CREATE CONTEXT
export const ReviewContext = createContext();

const ReviewProvider = ({ children }) => {
    // REVIEWS
    const [reviews, setReviews] = useState([]);

    // FETCH REVIEWS
    const fetchReviews = async (productId) => {
        try {
            const data = await getReviews(productId);

            if (data.success) {
                setReviews(data.reviews);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // ADD REVIEW
    const addReview = async (productId, rating, comment) => {
        try {
            const data = await createReview({
                productId,
                rating,
                comment,
            });

            if (data.success) {
                fetchReviews(productId);
            }

            return data;
        } catch (error) {
            console.log(error);
        }
    };

    // UPDATE REVIEW
    const updateReview = async (reviewId, productId, rating, comment) => {
        try {
            const data = await editReview(reviewId, {
                rating,
                comment,
            });

            if (data.success) {
                fetchReviews(productId);
            }

            return data;
        } catch (error) {
            console.log(error);
        }
    };

    // REMOVE REVIEW
    const removeReview = async (reviewId, productId) => {
        try {
            const data = await deleteReview(reviewId, productId);

            if (data.success) {
                await fetchReviews(productId);

                return data;
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);

            toast.error(
                error?.response?.data?.message || "Failed to delete review",
            );
        }
    };

    return (
        <ReviewContext.Provider
            value={{
                reviews,
                fetchReviews,
                addReview,
                updateReview,
                removeReview,
            }}
        >
            {children}
        </ReviewContext.Provider>
    );
};

export default ReviewProvider;
