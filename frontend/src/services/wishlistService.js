import api from "../lib/axios";

// =========================
// GET WISHLIST
// =========================

export const getWishlistData =
    async () => {

        try {

            const response =
                await api.get(
                    "/api/wishlist/"
                );

            return response.data;

        } catch (error) {

            console.log(
                error
            );

            throw error;

        }
    };

// =========================
// ADD TO WISHLIST
// =========================

export const addWishlistItem =
    async (productId) => {

        try {

            const response =
                await api.post(
                    "/api/wishlist/add",
                    {
                        productId,
                    }
                );

            return response.data;

        } catch (error) {

            console.log(
                error
            );

            throw error;

        }
    };

// =========================
// REMOVE FROM WISHLIST
// =========================

export const removeWishlistItem =
    async (productId) => {

        try {

            const response =
                await api.delete(
                    `/api/wishlist/remove/${productId}`
                );

            return response.data;

        } catch (error) {

            console.log(
                error
            );

            throw error;

        }
    };