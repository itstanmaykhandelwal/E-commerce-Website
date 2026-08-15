import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// =========================
// ADD PRODUCT
// =========================

const addProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            quantity,
            category,
            subCategory,
            sizes,
            bestseller,
            color,
        } = req.body;

        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];

        const images = [image1, image2, image3, image4].filter(Boolean);

        const imagesUrl = await Promise.all(
            images.map(async (item) => {
                const result = await cloudinary.uploader.upload(item.path, {
                    resource_type: "image",
                });

                return result.secure_url;
            }),
        );

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            quantity: Number(quantity),
            subCategory,
            bestseller: bestseller === "true",
            sizes: JSON.parse(sizes),
            color: JSON.parse(color),
            image: imagesUrl,
            date: Date.now(),
        };

        const product = new productModel(productData);

        await product.save();

        res.json({
            success: true,
            message: "Product Added",
        });
    } catch (error) {
        console.log("Add Product Error:", error);

        res.json({
            success: false,
            message: error.message,
        });
    }
};

// =========================
// LIST PRODUCTS
// =========================

const listProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;

        const skip = (page - 1) * limit;

        const products = await productModel
            .find({})
            .skip(skip)
            .limit(limit)
            .sort({ date: -1 });

        const totalProducts = await productModel.countDocuments();

        res.json({
            success: true,
            products,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts,
        });
    } catch (error) {
        console.log("List Products Error:", error);

        res.json({
            success: false,
            message: error.message,
        });
    }
};

// =========================
// REMOVE PRODUCT
// =========================

const removeProduct = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.json({
                success: false,
                message: "Product ID is required",
            });
        }

        const product = await productModel.findById(id);

        if (!product) {
            return res.json({
                success: false,
                message: "Product not found",
            });
        }

        await productModel.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Product Removed",
        });
    } catch (error) {
        console.log("Remove Product Error:", error);

        res.json({
            success: false,
            message: error.message,
        });
    }
};

// =========================
// SINGLE PRODUCT
// =========================

const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;

        const product = await productModel.findById(productId);

        if (!product) {
            return res.json({
                success: false,
                message: "Product not found",
            });
        }

        res.json({
            success: true,
            product,
        });
    } catch (error) {
        console.log("Single Product Error:", error);

        res.json({
            success: false,
            message: error.message,
        });
    }
};

// =========================
// UPDATE PRODUCT
// =========================

const updateProduct = async (req, res) => {
    try {
        const {
            id,
            name,
            description,
            price,
            quantity,
            category,
            subCategory,
            sizes,
            bestseller,
            color,
        } = req.body;

        if (!id) {
            return res.json({
                success: false,
                message: "Product ID is required",
            });
        }

        // Find existing product
        const product = await productModel.findById(id);

        if (!product) {
            return res.json({
                success: false,
                message: "Product not found",
            });
        }

        // =========================
        // HANDLE IMAGES
        // =========================

        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];

        const newImages = [image1, image2, image3, image4].filter(Boolean);

        let imagesUrl = product.image || [];

        // Agar new images upload hui hain
        if (newImages.length > 0) {
            imagesUrl = await Promise.all(
                newImages.map(async (item) => {
                    const result = await cloudinary.uploader.upload(item.path, {
                        resource_type: "image",
                    });

                    return result.secure_url;
                }),
            );
        }

        // =========================
        // UPDATE DATA
        // =========================

        product.name = name;
        product.description = description;
        product.price = Number(price);
        product.quantity = Number(quantity);
        product.category = category;
        product.subCategory = subCategory;
        product.sizes = JSON.parse(sizes);
        product.color = JSON.parse(color);
        product.bestseller = bestseller === "true";
        product.image = imagesUrl;

        await product.save();

        res.json({
            success: true,
            message: "Product Updated Successfully",
            product,
        });
    } catch (error) {
        console.log("Update Product Error:", error);

        res.json({
            success: false,
            message: error.message,
        });
    }
};

// =========================
// EXPORT
// =========================

export {
    listProducts,
    addProduct,
    removeProduct,
    singleProduct,
    updateProduct,
};
