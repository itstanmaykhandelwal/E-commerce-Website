import api from "../lib/axios";

// Get all products
export const getProducts = async () => {
    try {
        const response = await api.get("/api/product/list");
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get single product
export const getSingleProduct = async (productId) => {
    try {
        const response = await api.post("/api/product/single", {
            productId,
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
