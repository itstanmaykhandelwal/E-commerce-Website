import React, { useContext, useEffect, useMemo, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import RelatedProducts from "../components/RelatedProducts";

import { FaStar } from "react-icons/fa";

import { toast } from "react-toastify";

import RippleButton from "../components/RippleButton";

import {
    FiHeart,
    FiShare2,
    FiTruck,
    FiRefreshCw,
    FiShield,
    FiChevronRight,
    FiZoomIn,
} from "react-icons/fi";

// TEMP REVIEW CONTEXT
import useReviews from "../hooks/useReviews";

// CUSTOM HOOKS
import useProducts from "../hooks/useProducts";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import useWishlist from "../hooks/useWishlist";

// CONSTANTS
import { currency } from "../utils/constants";

const Product = () => {
    const { productId } = useParams();

    const navigate = useNavigate();

    // PRODUCTS
    const { products } = useProducts();

    // CART
    const { addToCart } = useCart();

    // AUTH
    const { user: currentUser } = useAuth();

    // WISHLIST
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

    // REVIEWS
    const { reviews, fetchReviews, addReview, updateReview, removeReview } =
        useReviews();

    // PRODUCT DATA
    const productData = useMemo(() => {
        return products.find((item) => item._id === productId);
    }, [products, productId]);

    // STATES
    const [image, setImage] = useState("");

    const [size, setSize] = useState("");

    const [color, setColor] = useState("");

    const [quantity, setQuantity] = useState(1);

    const [isWishlisted, setIsWishlisted] = useState(false);

    const [showImageZoom, setShowImageZoom] = useState(false);

    // REVIEW STATES
    const [showReviewModal, setShowReviewModal] = useState(false);

    const [rating, setRating] = useState(0);

    const [hover, setHover] = useState(null);

    const [reviewText, setReviewText] = useState("");

    const [editingReviewId, setEditingReviewId] = useState(null);

    // IMAGE + REVIEWS
    useEffect(() => {
        if (productData) {
            setImage(productData.image?.[0] || "");
        }

        if (productId && fetchReviews) {
            fetchReviews(productId);
        }
    }, [productData, productId]);

    // WISHLIST CHECK
    useEffect(() => {
        if (wishlist && productId) {
            setIsWishlisted(wishlist?.some((item) => item._id === productId));
        }
    }, [wishlist, productId]);

    // HANDLE WISHLIST
    const handleWishlist = () => {
        if (isWishlisted) {
            removeFromWishlist(productId);
        } else {
            addToWishlist(productId);
        }
    };

    // OPEN REVIEW
    const handleOpenReview = () => {
        if (!currentUser) {
            toast.error("Please login to write a review");

            return;
        }

        setShowReviewModal(true);
    };

    // SUBMIT REVIEW
    const submitReview = async () => {
        if (!rating) {
            return toast.error("Select rating");
        }

        if (!reviewText.trim()) {
            return toast.error("Write review");
        }

        try {
            if (editingReviewId) {
                await updateReview(
                    editingReviewId,
                    productId,
                    rating,
                    reviewText,
                );
            } else {
                await addReview(productId, rating, reviewText);
            }

            toast.success("Review submitted");

            setShowReviewModal(false);

            setRating(0);

            setReviewText("");

            setEditingReviewId(null);
        } catch (error) {
            toast.error("Failed to submit review");
        }
    };

    // LOADING
    if (!productData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // RATINGS
    const totalReviews = reviews?.length || 0;

    const avgRating =
        totalReviews > 0
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
            : 0;

    return (
        <div className="min-h-screen pt-[150px] bg-white">
            {/* BREADCRUMB */}
            <div className="border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2 text-sm text-slate-600">
                    <button
                        onClick={() => navigate("/")}
                        className="hover:text-black transition"
                    >
                        Home
                    </button>

                    <FiChevronRight />

                    <button
                        onClick={() => navigate("/collection")}
                        className="hover:text-black transition"
                    >
                        Collection
                    </button>

                    <FiChevronRight />

                    <span className="text-slate-900 font-medium truncate">
                        {productData.name}
                    </span>
                </div>
            </div>

            {/* MAIN SECTION */}
            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* IMAGE SECTION */}
                <div className="space-y-4">
                    <div className="relative group bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-200">
                        <img
                            src={image}
                            alt={productData.name}
                            className="w-full aspect-square object-cover group-hover:scale-105 transition duration-700"
                        />

                        <button
                            onClick={() => setShowImageZoom(true)}
                            className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition hover:scale-110 border border-gray-200"
                        >
                            <FiZoomIn className="w-5 h-5 text-slate-700" />
                        </button>
                    </div>

                    {/* THUMBNAILS */}
                    <div className="grid grid-cols-4 gap-4">
                        {productData.image?.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => setImage(item)}
                                className={`aspect-square rounded-2xl overflow-hidden border-2 transition ${
                                    image === item
                                        ? "border-black shadow-md scale-105"
                                        : "border-gray-200 hover:border-black"
                                }`}
                            >
                                <img
                                    src={item}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* INFO SECTION */}
                <div className="space-y-6">
                    {/* TITLE */}
                    <div className="flex items-start justify-between gap-4">
                        <h1 className="text-4xl font-bold text-[#1E3A5F]">
                            {productData.name}
                        </h1>

                        <button
                            onClick={handleWishlist}
                            className="p-3 rounded-full bg-white border border-gray-200 hover:border-black hover:bg-slate-50 transition"
                        >
                            <FiHeart
                                className={`w-6 h-6 ${
                                    isWishlisted
                                        ? "fill-[#0F766E] text-[#0F766E]"
                                        : "text-slate-600"
                                }`}
                            />
                        </button>
                    </div>

                    {/* RATING */}
                    <div className="flex items-center gap-4">
                        {[...Array(5)].map((_, index) => (
                            <FaStar
                                key={index}
                                size={20}
                                color={
                                    index < Math.round(avgRating)
                                        ? "#0F766E"
                                        : "#e5e7eb"
                                }
                            />
                        ))}

                        <span className="text-slate-600">
                            {avgRating.toFixed(1)} ({totalReviews})
                        </span>
                    </div>

                    {/* PRICE */}
                    <div className="text-5xl font-bold text-slate-900">
                        {currency}
                        {productData.price}
                    </div>

                    {/* DESCRIPTION */}
                    <p className="text-slate-600 leading-relaxed">
                        {productData.description}
                    </p>

                    {/* SIZE */}
                    {productData.sizes?.length > 0 && (
                        <div>
                            <p className="font-semibold mb-3 text-slate-900">
                                Select Size
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {productData.sizes.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSize(item)}
                                        className={`min-w-[60px] px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                            item === size
                                                ? "bg-black text-white shadow-md scale-105"
                                                : "bg-white border border-gray-300 hover:border-black hover:scale-105"
                                        }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* COLOR */}
                    {productData.color?.length > 0 && (
                        <div>
                            <p className="font-semibold mb-3 text-slate-900">
                                Select Color
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {productData.color.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setColor(item)}
                                        className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 capitalize ${
                                            item === color
                                                ? "bg-black text-white shadow-md scale-105"
                                                : "bg-white border border-gray-300 hover:border-black hover:scale-105"
                                        }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* QUANTITY */}
                    <div>
                        <p className="font-semibold mb-3 text-slate-900">
                            Quantity
                        </p>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() =>
                                    setQuantity((prev) => Math.max(1, prev - 1))
                                }
                                className="w-12 h-12 rounded-xl border border-gray-300 hover:border-black hover:bg-black hover:text-white transition"
                            >
                                −
                            </button>

                            <span className="w-16 text-center text-xl font-bold text-slate-900">
                                {quantity}
                            </span>

                            <button
                                onClick={() => setQuantity((prev) => prev + 1)}
                                className="w-12 h-12 rounded-xl border border-gray-300 hover:border-black hover:bg-black hover:text-white transition"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <RippleButton
                            onClick={() => {
                                if (productData.sizes?.length > 0 && !size) {
                                    toast.error("Please select size");

                                    return;
                                }

                                if (productData.color?.length > 0 && !color) {
                                    toast.error("Please select color");

                                    return;
                                }

                                addToCart(
                                    productData._id,
                                    size ? size.trim() : "default",
                                    color ? color.trim() : "default",
                                    quantity,
                                );

                                toast.success("Added to cart");
                            }}
                        >
                            Add To Cart
                        </RippleButton>

                        <button
                            onClick={handleOpenReview}
                            className="px-8 py-4 bg-white border border-gray-300 text-slate-800 rounded-2xl font-semibold hover:border-black hover:bg-slate-50 transition"
                        >
                            WRITE REVIEW
                        </button>

                        <button className="p-4 bg-white border border-gray-300 rounded-2xl hover:border-black hover:bg-slate-50 transition">
                            <FiShare2 className="w-5 h-5 text-slate-700" />
                        </button>
                    </div>

                    {/* FEATURES */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                        {[
                            {
                                icon: FiTruck,
                                text: "Free Delivery",
                            },
                            {
                                icon: FiRefreshCw,
                                text: "Easy Returns",
                            },
                            {
                                icon: FiShield,
                                text: "100% Secure",
                            },
                        ].map((feature, index) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm"
                                >
                                    <div className="p-3 bg-black rounded-xl">
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>

                                    <span className="text-sm font-semibold text-slate-700">
                                        {feature.text}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* REVIEWS */}
            <div className="max-w-7xl mx-auto px-4 mt-20">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-slate-900">
                        Customer Reviews
                    </h2>

                    <span className="px-4 py-2 bg-slate-100 text-[#1E3A5F] rounded-full text-sm font-semibold border border-gray-200">
                        {totalReviews} Reviews
                    </span>
                </div>
            </div>
            {/* REVIEWS LIST */}
            <div className="space-y-6">
                {reviews && reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div
                            key={review._id}
                            className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <div className="flex items-start justify-between gap-4">
                                {/* LEFT */}
                                <div className="flex items-start gap-4">
                                    {/* USER IMAGE */}
                                    <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold shrink-0">
                                        {review?.user?.name?.[0]?.toUpperCase() ||
                                            "U"}
                                    </div>

                                    {/* CONTENT */}
                                    <div>
                                        {/* NAME */}
                                        <h4 className="text-lg font-semibold text-slate-900">
                                            {review?.userId?.name || "Anonymous User"}
                                        </h4>

                                        {/* STARS */}
                                        <div className="flex items-center gap-1 mt-1 mb-3">
                                            {[...Array(5)].map((_, index) => (
                                                <FaStar
                                                    key={index}
                                                    size={16}
                                                    color={
                                                        index < review.rating
                                                            ? "#0F766E"
                                                            : "#d1d5db"
                                                    }
                                                />
                                            ))}
                                        </div>

                                        {/* REVIEW TEXT */}
                                        <p className="text-slate-600 leading-relaxed">
                                           {review.comment}
                                        </p>

                                        {/* DATE */}
                                        <p className="text-xs text-slate-400 mt-4">
                                            {new Date(review.date).toDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* ACTIONS */}
                                {currentUser?._id === review?.userId?._id && (
                                    <div className="flex items-center gap-3">
                                        {/* EDIT */}
                                        <button
                                            onClick={() => {
                                                setEditingReviewId(review._id);

                                                setRating(review.rating);

                                                // setReviewText(review.review);
                                                setReviewText(review.comment)

                                                setShowReviewModal(true);
                                            }}
                                            className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:border-black hover:bg-slate-50 transition"
                                        >
                                            Edit
                                        </button>

                                        {/* DELETE */}
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await removeReview(
                                                        review._id,
                                                        productId,
                                                    );

                                                    toast.success(
                                                        "Review deleted",
                                                    );
                                                } catch {
                                                    toast.error(
                                                        "Failed to delete review",
                                                    );
                                                }
                                            }}
                                            className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-xl transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-gradient-to-br from-sky-50 to-slate-100 border border-gray-200 rounded-3xl p-12 text-center shadow-sm">
                        <div className="w-20 h-20 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto mb-5 shadow-sm">
                            <FaStar className="text-[#1E3A5F] text-3xl" />
                        </div>

                        <h3 className="text-2xl font-bold text-slate-800 mb-3">
                            No Reviews Yet
                        </h3>

                        <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                            Be the first one to share your experience about this
                            product.
                        </p>
                    </div>
                )}
            </div>

            {/* RELATED PRODUCTS */}
            <RelatedProducts
                category={productData.category}
                subCategory={productData.subCategory}
            />

            {/* IMAGE ZOOM */}
            {showImageZoom && (
                <div
                    onClick={() => setShowImageZoom(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 cursor-zoom-out"
                >
                    <img
                        src={image}
                        alt={productData.name}
                        className="max-w-full max-h-full object-contain rounded-2xl"
                    />
                </div>
            )}
            {/* REVIEW MODAL */}
            {showReviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                    <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 relative animate-fadeIn">
                        {/* CLOSE BUTTON */}
                        <button
                            onClick={() => {
                                setShowReviewModal(false);

                                setRating(0);

                                setReviewText("");

                                setEditingReviewId(null);
                            }}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full border border-gray-200 hover:border-black hover:bg-slate-100 transition flex items-center justify-center text-slate-600"
                        >
                            ✕
                        </button>

                        {/* TITLE */}
                        <h2 className="text-3xl font-bold text-[#1E3A5F] mb-2">
                            {editingReviewId ? "Edit Review" : "Write a Review"}
                        </h2>

                        <p className="text-slate-500 mb-8">
                            Share your experience about this product
                        </p>

                        {/* STAR RATING */}
                        <div className="flex items-center gap-2 mb-8">
                            {[...Array(5)].map((_, index) => {
                                const currentRating = index + 1;

                                return (
                                    <button
                                        type="button"
                                        key={index}
                                        onClick={() => setRating(currentRating)}
                                        onMouseEnter={() =>
                                            setHover(currentRating)
                                        }
                                        onMouseLeave={() => setHover(null)}
                                        className="transition hover:scale-110"
                                    >
                                        <FaStar
                                            size={34}
                                            color={
                                                currentRating <=
                                                (hover || rating)
                                                    ? "#0F766E"
                                                    : "#d1d5db"
                                            }
                                        />
                                    </button>
                                );
                            })}
                        </div>

                        {/* REVIEW TEXT */}
                        <textarea
                            rows={5}
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Write your review here..."
                            className="w-full border border-gray-300 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-black focus:border-black transition resize-none text-slate-700"
                        />

                        {/* ACTION BUTTONS */}
                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => {
                                    setShowReviewModal(false);

                                    setRating(0);

                                    setReviewText("");

                                    setEditingReviewId(null);
                                }}
                                className="px-6 py-3 border border-gray-300 rounded-2xl hover:border-black hover:bg-slate-50 transition font-medium"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={submitReview}
                                className="px-6 py-3 bg-black hover:bg-neutral-800 text-white rounded-2xl transition-all duration-300 font-medium shadow-md hover:scale-105"
                            >
                                {editingReviewId
                                    ? "Update Review"
                                    : "Submit Review"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Product;
