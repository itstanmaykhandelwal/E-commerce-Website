import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import RippleButton from "./RippleButton";
import { searchProductsWithAI } from "../services/aiService";

const ChatBot = () => {
    const [open, setOpen] = useState(false);

    const [messages, setMessages] = useState([]);

    const [input, setInput] = useState("");

    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    const location = useLocation();
    const navigate = useNavigate();

    // Close chatbot when route changes
    useEffect(() => {
        setOpen(false);
    }, [location]);

    // Scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, loading]);

    const sendMessage = async () => {
        const message = input.trim();

        if (!message || loading) return;

        // Add user message
        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: message,
            },
        ]);

        setInput("");
        setLoading(true);

        try {
            // Call backend AI
            const data = await searchProductsWithAI(message);

            // Add AI response
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: data.response || "Sorry, I couldn't find anything.",
                    products: data.products || [],
                },
            ]);
        } catch (error) {
            console.error("Chatbot error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: "Sorry, something went wrong. Please try again.",
                    products: [],
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = (productId) => {
        setOpen(false);
        navigate(`/product/${productId}`);
    };

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
            {/* Toggle Button */}
            <button
                onClick={() => setOpen(!open)}
                className="bg-black text-white px-4 py-2 rounded-full shadow-lg hover:bg-neutral-800"
            >
                {open ? "Close Chat" : "AI Shopping"}
            </button>

            {open && (
                <div className="w-[360px] h-[520px] bg-white shadow-2xl rounded-2xl mt-2 flex flex-col overflow-hidden border border-gray-200">
                    {/* HEADER */}
                    <div className="bg-black text-white px-4 py-3">
                        <p className="font-semibold">AI Shopping Assistant</p>

                        <p className="text-xs text-gray-300">
                            Find products using natural language
                        </p>
                    </div>

                    {/* MESSAGES */}
                    <div className="flex-1 p-3 overflow-y-auto space-y-3">
                        {messages.length === 0 && (
                            <div className="text-sm text-gray-500 text-center mt-10">
                                <p className="font-medium text-gray-700">
                                    Hi! 👋
                                </p>

                                <p className="mt-2">Try something like:</p>

                                <p className="mt-1 text-gray-400">
                                    "Mujhe white t-shirt 2000 ke andar chahiye"
                                </p>
                            </div>
                        )}

                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={
                                    msg.sender === "user"
                                        ? "flex justify-end"
                                        : "flex justify-start"
                                }
                            >
                                <div
                                    className={
                                        msg.sender === "user"
                                            ? "max-w-[85%] bg-black text-white px-3 py-2 rounded-2xl rounded-br-sm text-sm"
                                            : "max-w-[95%] bg-gray-100 text-gray-800 px-3 py-2 rounded-2xl rounded-bl-sm text-sm"
                                    }
                                >
                                    {/* AI TEXT */}
                                    <p className="whitespace-pre-line">
                                        {msg.text}
                                    </p>

                                    {/* PRODUCTS */}
                                    {msg.products?.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {msg.products.map((product) => (
                                                <div
                                                    key={product._id}
                                                    className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition"
                                                    onClick={() =>
                                                        handleProductClick(
                                                            product._id,
                                                        )
                                                    }
                                                >
                                                    {/* IMAGE */}
                                                    <img
                                                        src={product.image?.[0]}
                                                        alt={product.name}
                                                        className="w-full h-36 object-cover"
                                                    />

                                                    {/* PRODUCT INFO */}
                                                    <div className="p-3">
                                                        <p className="font-semibold text-gray-900">
                                                            {product.name}
                                                        </p>

                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {
                                                                product.description
                                                            }
                                                        </p>

                                                        <div className="flex justify-between items-center mt-2">
                                                            <span className="font-bold text-black">
                                                                ₹{product.price}
                                                            </span>

                                                            <span className="text-xs text-gray-500">
                                                                View Product →
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* LOADING */}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 px-4 py-3 rounded-2xl text-sm text-gray-500">
                                    Searching products...
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* INPUT */}
                    <div className="p-3 border-t flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                            placeholder="Ask for a product..."
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }}
                        />

                        <RippleButton onClick={sendMessage} disabled={loading}>
                            Send
                        </RippleButton>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
