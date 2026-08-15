import express from "express";

import {
    listProducts,
    addProduct,
    removeProduct,
    singleProduct,
    updateProduct,
} from "../controllers/productController.js";

import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

// =========================
// ADD PRODUCT
// =========================

productRouter.post(
    "/add",
    adminAuth,
    upload.fields([
        { name: "image1", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 },
        { name: "image4", maxCount: 1 },
    ]),
    addProduct,
);

// =========================
// UPDATE PRODUCT
// =========================

productRouter.post(
    "/update",
    adminAuth,
    upload.fields([
        { name: "image1", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 },
        { name: "image4", maxCount: 1 },
    ]),
    updateProduct,
);

// =========================
// REMOVE PRODUCT
// =========================

productRouter.post("/remove", adminAuth, removeProduct);

// =========================
// SINGLE PRODUCT
// =========================

productRouter.post("/single", singleProduct);

// =========================
// LIST PRODUCTS
// =========================

productRouter.get("/list", listProducts);

export default productRouter;
