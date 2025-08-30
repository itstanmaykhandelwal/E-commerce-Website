import express from "express";
import cors from "cors";
import "dotenv/config";
import { Server } from "socket.io";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import wishRouter from "./routes/wishlistRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import http from "http";
import faqRouter from "./routes/faqRoute.js";
import faqs from "./data/faqData.js"; // faqData import kar lo
import Product from "./models/productModel.js";
import contactRouter from "./routes/contactRoute.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middlewares
app.use(cors());
app.use(express.json());

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/wishlist", wishRouter);
app.use("/api/review", reviewRouter);
app.use("/api/faq", faqRouter);
app.use("/api/contact", contactRouter);

// API test endpoint
app.get("/", (req, res) => {
    res.send("API Working");
});

// Socket.io Chat Setup
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Helper functions
// const getAnswerFromFAQ = (message) => {
//     const msgLower = message.toLowerCase();
//     const matchedFaq = faqs.find((faq) =>
//         faq.keywords.some((kw) => msgLower.includes(kw.toLowerCase()))
//     );
//     if (matchedFaq) return matchedFaq.answer;
//     return "Sorry, I don't understand your question.";
// };
const getAnswerFromMessage = async (msg) => {
    const msgLower = msg.toLowerCase();

    // 1️⃣ Check FAQs
    const matchedFaq = faqs.find((faq) =>
        faq.keywords.some((kw) => msgLower.includes(kw.toLowerCase()))
    );
    if (matchedFaq) return { type: "faq", answer: matchedFaq.answer };

    // 2️⃣ Check Products in DB
    const matchedProduct = await Product.findOne({
        name: { $regex: msg, $options: "i" },
    });
    if (matchedProduct) {
        return {
            type: "product",
            product: {
                id: matchedProduct._id,
                name: matchedProduct.name,
                price: matchedProduct.price,
                image: matchedProduct.images[0], // assuming images array
                link: `/product/${matchedProduct._id}`,
            },
        };
    }

    return { type: "faq", answer: "Sorry, I don't understand your question." };
};
const getRelatedQuestions = (answer, shownQuestions = []) => {
    // Filter out the answered question
    let remainingFaqs = faqs.filter(
        (faq) => faq.answer !== answer && !shownQuestions.includes(faq.question)
    );

    // Agar remainingFaqs khatam ho gaye to circularly start se repeat karein
    if (remainingFaqs.length === 0) {
        shownQuestions = [];
        remainingFaqs = faqs.filter((faq) => faq.answer !== answer);
    }

    // Next 3 questions
    const nextQuestions = remainingFaqs.slice(0, 3).map((faq) => faq.question);

    return nextQuestions;
};

io.on("connection", (socket) => {
    socket.on("user message", async (msg) => {
        try {
            const data = await getAnswerFromMessage(msg);

            if (data.type === "faq") {
                const relatedQuestions = faqs
                    .filter((f) => f.answer !== data.answer)
                    .slice(0, 3)
                    .map((f) => f.question);
                socket.emit("bot message", {
                    type: "faq",
                    answer: data.answer,
                    relatedQuestions,
                });
            } else if (data.type === "product") {
                socket.emit("bot message", {
                    type: "product",
                    product: data.product,
                });
            }
        } catch (err) {
            console.log(err);
            socket.emit("bot message", {
                type: "error",
                answer: "Error processing your message",
            });
        }
    });
});

// Start server
server.listen(port, () => console.log(`Server is running on port ${port}`));
