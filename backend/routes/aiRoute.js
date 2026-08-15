import express from "express";

import {
  chatWithAI,
  searchProductsWithAI,
} from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post("/chat", chatWithAI);

aiRouter.post("/product-search", searchProductsWithAI);

export default aiRouter;