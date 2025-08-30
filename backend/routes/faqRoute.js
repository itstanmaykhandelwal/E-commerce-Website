// routes/faqRoute.js
import express from "express";
import { getFaqResponse } from "../controllers/faqController.js";

const faqRouter = express.Router();

faqRouter.post("/ask", getFaqResponse);

export default faqRouter;
