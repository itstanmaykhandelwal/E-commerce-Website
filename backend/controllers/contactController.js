import contactModel from "../models/contactModel.js";

// Create / submit contact message
const submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }

        const newContact = await contactModel.create({
            name,
            email,
            subject,
            message,
        });
        res.status(201).json({
            success: true,
            message: "Message submitted successfully",
            data: newContact,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Optional: get all contact messages (admin use)
const getContacts = async (req, res) => {
    try {
        const contacts = await contactModel.find().sort({ date: -1 });
        res.status(200).json({ success: true, data: contacts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export { submitContact, getContacts };
