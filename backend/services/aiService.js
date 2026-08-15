import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const generateAIResponse = async (message) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: message,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to generate AI response");
    }
};

export const extractProductSearchFilters = async (message) => {
    try {
        const prompt = `
You are an AI shopping search assistant for an e-commerce website.

Extract search filters from the user's message.

Return ONLY valid JSON in this exact format:

{
  "search": "",
  "category": "",
  "subCategory": "",
  "color": "",
  "maxPrice": null
}

Rules:

- "search" should contain the actual product type or keywords.
- category can ONLY be: "Men", "Women", "Kids"
- subCategory can ONLY be: "Topwear", "Bottomwear", "Winterwear"
- Never put product names like "t-shirt", "shirt", "shorts", or "jeans" inside subCategory.
- Product types should go into search.
- color should contain the requested color if specified.
- maxPrice should contain the maximum budget if specified.
- Do not invent values.
- Unknown fields should be empty string or null.

User message:
"${message}"
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt,
        });

        const text = response.text.trim();

        const cleanText = text
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Product filter extraction error:", error);

        // IMPORTANT: temporarily expose the actual Gemini error
        throw error;
    }
};

export const generateProductRecommendation = async ({
    userMessage,
    products,
}) => {
    try {
        const productData = products.map((product) => ({
            id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            subCategory: product.subCategory,
            color: product.color,
            sizes: product.sizes,
            quantity: product.quantity,
            bestSeller: product.bestSeller,
        }));

        const prompt = `
You are an AI shopping assistant for an e-commerce website.

The user asked:
"${userMessage}"

Here are the REAL products found in the database:

${JSON.stringify(productData, null, 2)}

Your job:
1. Tell the user whether suitable products were found.
2. Recommend the most relevant products from the provided products only.
3. Never invent products, prices, discounts, ratings, stock, or features.
4. Keep the response concise and helpful.
5. If no products were found, politely say that no matching products were found.
6. Do not mention MongoDB, database, API, filters, or internal systems.
7. Do not use markdown tables.

Return only the natural-language response that should be shown to the customer.
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Product recommendation error:", error);
        throw new Error("Failed to generate product recommendation");
    }
};
