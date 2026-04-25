import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import RippleButton from "../components/RippleButton";
import {
    FiShoppingCart,
    FiHeart,
    FiShare2,
    FiTruck,
    FiRefreshCw,
    FiShield,
    FiX,
    FiChevronRight,
    FiZoomIn,
} from "react-icons/fi";

const Product = () => {
    const { productId } = useParams();
    const navigate = useNavigate();

    const {
        products,
        currency,
        addToCart,
        reviews,
        fetchReviews,
        addReview,
        updateReview,
        currentUser,
        removeReview,
        wishlist,
        addToWishlist,
        removeFromWishlist,
    } = useContext(ShopContext);

    const [productData, setProductData] = useState(null);
    const [image, setImage] = useState("");
    const [size, setSize] = useState("");
    const [color, setColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showImageZoom, setShowImageZoom] = useState(false);

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);
    const [reviewText, setReviewText] = useState("");
    const [editingReviewId, setEditingReviewId] = useState(null);

    useEffect(() => {
        const product = products.find((item) => item._id === productId);
        if (product) {
            setProductData(product);
            setImage(product.image?.[0] || "");
        }
        if (productId) fetchReviews && fetchReviews(productId);
    }, [productId, products]);

    useEffect(() => {
        if (wishlist && productId) {
            setIsWishlisted(wishlist.some((item) => item._id === productId));
        }
    }, [wishlist, productId]);

    const handleWishlist = () => {
        isWishlisted ? removeFromWishlist(productId) : addToWishlist(productId);
    };

    const handleOpenReview = () => {
        if (!currentUser) {
            toast.error("Please login to write a review");
            return;
        }
        setShowReviewModal(true);
    };

    const submitReview = async () => {
        if (!rating) return toast.error("Select rating");
        if (!reviewText.trim()) return toast.error("Write review");

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
        } catch {
            toast.error("Failed to submit");
        }
    };

    if (!productData) return null;

    const totalReviews = reviews?.length || 0;
    const avgRating =
        totalReviews > 0
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
            : 0;

    return (
        <div className="min-h-screen ">
            {/* Breadcrumb */}
            <div className="border-b">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2 text-sm text-slate-600">
                    <button
                        onClick={() => navigate("/")}
                        className="hover:text-emerald-600"
                    >
                        Home
                    </button>
                    <FiChevronRight />
                    <button
                        onClick={() => navigate("/collection")}
                        className="hover:text-emerald-600"
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
                    <div className="relative group bg-white rounded-3xl overflow-hidden shadow-xl border border-emerald-100">
                        <img
                            src={image}
                            alt={productData.name}
                            className="w-full aspect-square object-cover group-hover:scale-105 transition duration-700"
                        />

                        <button
                            onClick={() => setShowImageZoom(true)}
                            className="absolute top-4 right-4 p-3 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition hover:scale-110"
                        >
                            <FiZoomIn className="w-5 h-5 text-slate-700" />
                        </button>

                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <span className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded-full shadow-lg">
                                NEW
                            </span>
                        </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-4">
                        {productData.image?.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => setImage(item)}
                                className={`aspect-square rounded-2xl overflow-hidden border-2 transition ${
                                    image === item
                                        ? "border-emerald-600 shadow-lg scale-105"
                                        : "border-emerald-100 hover:border-emerald-400"
                                }`}
                            >
                                <img
                                    src={item}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* INFO SECTION */}
                <div className="space-y-6">
                    {/* Title + Wishlist */}
                    <div className="flex items-start justify-between">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                            {productData.name}
                        </h1>

                        <button
                            onClick={handleWishlist}
                            className="p-3 rounded-full bg-white border-2 border-emerald-200 hover:border-emerald-600 hover:bg-emerald-50 transition"
                        >
                            <FiHeart
                                className={`w-6 h-6 ${
                                    isWishlisted
                                        ? "fill-emerald-600 text-emerald-600"
                                        : "text-slate-600"
                                }`}
                            />
                        </button>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-4">
                        {[...Array(5)].map((_, index) => (
                            <FaStar
                                key={index}
                                size={20}
                                color={
                                    index < Math.round(avgRating)
                                        ? "#059669"
                                        : "#e5e7eb"
                                }
                            />
                        ))}
                        <span className="text-slate-600">
                            {avgRating.toFixed(1)} ({totalReviews})
                        </span>
                    </div>

                    {/* Price */}
                    <div className="text-5xl font-bold text-emerald-700">
                        {currency}
                        {productData.price}
                    </div>

                    <p className="text-slate-600">{productData.description}</p>

                    {/* SIZE */}
                    {productData.sizes?.length > 0 && (
                        <div>
                            <p className="font-semibold mb-3">Select Size</p>
                            <div className="flex flex-wrap gap-3">
                                {productData.sizes.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSize(item)}
                                        className={`min-w-[60px] px-5 py-3 rounded-xl font-semibold transition ${
                                            item === size
                                                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105"
                                                : "bg-white border-2 border-emerald-200 hover:border-emerald-600 hover:scale-105"
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
                            <p className="font-semibold mb-3">Select Color</p>
                            <div className="flex flex-wrap gap-3">
                                {productData.color.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setColor(item)}
                                        className={`px-5 py-3 rounded-xl font-semibold transition capitalize ${
                                            item === color
                                                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105"
                                                : "bg-white border-2 border-emerald-200 hover:border-emerald-600 hover:scale-105"
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
                        <p className="font-semibold mb-3">Quantity</p>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() =>
                                        setQuantity((prev) =>
                                            Math.max(1, prev - 1),
                                        )
                                    }
                                    className="w-12 h-12 rounded-xl border-2 border-emerald-200 hover:border-emerald-600 hover:bg-emerald-50 transition"
                                >
                                    −
                                </button>

                                <span className="w-16 text-center text-xl font-bold">
                                    {quantity}
                                </span>

                                <button
                                    onClick={() =>
                                        setQuantity((prev) => prev + 1)
                                    }
                                    className="w-12 h-12 rounded-xl border-2 border-emerald-200 hover:border-emerald-600 hover:bg-emerald-50 transition"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <RippleButton
                            // onClick={() => {
                            //     addToCart(
                            //         productData._id,
                            //         size,
                            //         color,
                            //         quantity,
                            //     );
                            //     toast.success("Added to cart");
                            // }}
                            onClick={() => {
                                addToCart(
                                    productData._id,
                                    size,
                                    color,
                                    quantity,
                                );
                            }}
                            className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-semibold hover:scale-105 transition"
                        >
                            {/* <FiShoppingCart /> */}
                            ADD TO CART
                        </RippleButton>

                        <RippleButton
                            onClick={handleOpenReview}
                            className="px-8 py-4 bg-white border-2 border-emerald-600 text-emerald-700 rounded-2xl font-semibold hover:bg-emerald-50 transition"
                        >
                            WRITE REVIEW
                        </RippleButton>

                        <button className="p-4 bg-white border-2 border-emerald-200 rounded-2xl hover:border-emerald-600 hover:bg-emerald-50 transition">
                            <FiShare2 className="w-5 h-5 text-slate-700" />
                        </button>
                    </div>

                    {/* FEATURES */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                        {[
                            { icon: FiTruck, text: "Free Delivery" },
                            { icon: FiRefreshCw, text: "Easy Returns" },
                            { icon: FiShield, text: "100% Secure" },
                        ].map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm"
                                >
                                    <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl">
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
            {/* REVIEWS SECTION */}
            <div className="max-w-7xl mx-auto px-4 mt-20">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-slate-900">
                        Customer Reviews
                    </h2>
                    <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                        {totalReviews} Reviews
                    </span>
                </div>

                {reviews && reviews.length === 0 ? (
                    <div className="text-center py-16 rounded-3xl border border-emerald-100">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full mb-4">
                            <FaStar className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            No reviews yet
                        </h3>
                        <p className="text-slate-600 mb-6">
                            Be the first to review this product!
                        </p>
                        <RippleButton
                            onClick={handleOpenReview}
                            className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-semibold hover:scale-105 transition"
                        >
                            Write First Review
                        </RippleButton>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews.map((review, i) => (
                            <div
                                key={review._id || i}
                                className="p-6 bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-lg transition"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {(review.userId?.name ||
                                                "A")[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">
                                                {review.userId?.name ||
                                                    "Anonymous"}
                                            </p>
                                            <div className="flex gap-1 mt-1">
                                                {[...Array(5)].map(
                                                    (_, index) => (
                                                        <FaStar
                                                            key={index}
                                                            size={14}
                                                            color={
                                                                index <
                                                                review.rating
                                                                    ? "#059669"
                                                                    : "#e5e7eb"
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Edit/Delete for owner */}
                                    {currentUser &&
                                        String(review.userId?._id) ===
                                            String(currentUser._id) && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setShowReviewModal(
                                                            true,
                                                        );
                                                        setRating(
                                                            review.rating,
                                                        );
                                                        setReviewText(
                                                            review.comment,
                                                        );
                                                        setEditingReviewId(
                                                            review._id,
                                                        );
                                                    }}
                                                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        removeReview(
                                                            review._id,
                                                            productId,
                                                        )
                                                    }
                                                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                </div>

                                <p className="text-slate-600 leading-relaxed">
                                    {review.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
        </div>
    );
};

export default Product;
