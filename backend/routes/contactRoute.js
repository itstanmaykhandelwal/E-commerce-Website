import express from "express";
import {
    submitContact,
    getContacts,
} from "../controllers/contactController.js";

const contactRouter = express.Router();

// Public route: submit a message
contactRouter.post("/submit", submitContact);

// Admin route: get all messages
contactRouter.get("/", getContacts);

export default contactRouter;
