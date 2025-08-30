// components/ChatBot.jsx
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL); // backend socket URL

const ChatBot = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("Hii"); // initial input
    const [relatedCards, setRelatedCards] = useState([]);
    const messagesEndRef = useRef(null);

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, relatedCards]);

    // Listen to backend messages
    useEffect(() => {
        socket.on("bot message", (data) => {
            setMessages((prev) => [...prev, { sender: "bot", text: data.answer }]);
            // filter out questions already sent by user
            const filteredCards = (data.relatedQuestions || []).filter(
                q => !messages.some(msg => msg.sender === "user" && msg.text.toLowerCase() === q.toLowerCase())
            );
            setRelatedCards(filteredCards);
        });

        return () => socket.off("bot message");
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;

        // prevent duplicate user messages
        if (!messages.some(msg => msg.sender === "user" && msg.text.toLowerCase() === input.toLowerCase())) {
            setMessages(prev => [...prev, { sender: "user", text: input }]);
            socket.emit("user message", input); // backend se reply aayega
        }

        setInput(""); // clear input
    };

    const handleCardClick = (question) => {
        const userMessages = messages.filter(m => m.sender === "user").map(m => m.text);

        setMessages((prev) => [...prev, { sender: "user", text: question }]);
        socket.emit("user message", question, userMessages);

        setRelatedCards([]);
    };

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
            {/* Toggle Button */}
            <button
                onClick={() => setOpen(!open)}
                className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700"
            >
                {open ? "Close Chat" : "Chat"}
            </button>

            {open && (
                <div className="w-80 h-96 bg-white shadow-xl rounded-lg mt-2 flex flex-col overflow-hidden">
                    <div className="bg-blue-600 text-white px-4 py-2 font-semibold">
                        ChatBot
                    </div>

                    <div className="flex-1 p-3 overflow-y-auto space-y-2">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`p-2 rounded ${msg.sender === "user" ? "bg-gray-200 self-end" : "bg-blue-100 self-start"}`}
                            >
                                {msg.text}
                            </div>
                        ))}

                        {/* Related question cards */}
                        {relatedCards.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {relatedCards.map((q, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleCardClick(q)}
                                        className="bg-gray-100 text-sm px-2 py-1 rounded hover:bg-gray-200"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-2 border-t flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 border rounded px-2 py-1 focus:outline-none"
                            placeholder="Type a message..."
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
