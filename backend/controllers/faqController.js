import faqs from "../data/faqData.js";

const getFaqResponse = (req, res) => {
    const { message } = req.body;
    if (!message)
        return res.json({ success: false, answer: "Message is required" });

    const msgLower = message.toLowerCase();

    // Simple keyword matching
    const matchedFaq = faqs.find((faq) =>
        faq.keywords.some((kw) => msgLower.includes(kw.toLowerCase()))
    );

    if (matchedFaq) {
        return res.json({ success: true, answer: matchedFaq.answer });
    } else {
        return res.json({
            success: true,
            answer: "Sorry, I don't understand your question.",
        });
    }
};

export { getFaqResponse };
