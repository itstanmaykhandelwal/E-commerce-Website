import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const searchProductsWithAI = async (message) => {
    try {
        const response = await axios.post(
            `${backendUrl}/api/ai/product-search`,
            {
                message,
            },
        );

        return response.data;
    } catch (error) {
        console.error(
            "AI Product Search Error:",
            error.response?.data || error.message,
        );

        throw error;
    }
};
