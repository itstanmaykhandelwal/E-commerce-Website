import {
    generateAIResponse,
    extractProductSearchFilters,
    generateProductRecommendation,
} from "../services/aiService.js";

import productModel from "../models/productModel.js";

// ==========================================
// NORMAL AI CHAT
// ==========================================
export const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        // Normal Gemini AI response
        const response = await generateAIResponse(message);

        res.status(200).json({
            success: true,
            response,
        });
    } catch (error) {
        console.error("AI Controller Error:", error);

        res.status(500).json({
            success: false,
            message: "Something went wrong with AI",
        });
    }
};

// ==========================================
// AI PRODUCT SEARCH
// ==========================================
export const searchProductsWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        // ------------------------------------------
        // STEP 1: Extract filters using Gemini
        // ------------------------------------------
        const filters = await extractProductSearchFilters(message);

        console.log("AI Filters:", filters);

        // ------------------------------------------
        // STEP 2: Build MongoDB query
        // ------------------------------------------
        const query = {};

        // Product name / keyword search
        if (filters.search) {
            query.$text = {
                $search: filters.search,
            };
        }

        // Category
        if (filters.category) {
            query.category = {
                $regex: filters.category,
                $options: "i",
            };
        }

        // Sub Category
        if (filters.subCategory) {
            query.subCategory = {
                $regex: filters.subCategory,
                $options: "i",
            };
        }

        // Color
        if (filters.color) {
            query.color = {
                $regex: filters.color,
                $options: "i",
            };
        }

        // Maximum price
        if (
            filters.maxPrice !== null &&
            filters.maxPrice !== undefined &&
            filters.maxPrice !== ""
        ) {
            query.price = {
                $lte: Number(filters.maxPrice),
            };
        }

        console.log("MongoDB Query:", JSON.stringify(query, null, 2));

        // ------------------------------------------
        // STEP 3: Get REAL products from MongoDB
        // ------------------------------------------
        const products = await productModel
            .find(query)
            .limit(10);

        console.log("Products Found:", products.length);

        // ------------------------------------------
        // STEP 4: Generate customer-friendly AI response
        // ------------------------------------------
        const response = await generateProductRecommendation({
            userMessage: message,
            products,
        });

        // ------------------------------------------
        // STEP 5: Send response
        // ------------------------------------------
        res.status(200).json({
            success: true,
            filters,
            response,
            products,
        });
    } catch (error) {
        console.error("AI Product Search Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to search products",
            error: error.message,
        });
    }
};