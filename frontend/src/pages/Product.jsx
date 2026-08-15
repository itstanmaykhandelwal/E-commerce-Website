import React, { useEffect, useMemo, useState } from "react";

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
    FiX,
} from "react-icons/fi";

// REVIEWS
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

    // =========================
    // PRODUCTS
    // =========================

    const { products } = useProducts();

    // =========================
    // CART
    // =========================

    const { addToCart } = useCart();

    // =========================
    // AUTH
    // =========================

    const { user: currentUser } = useAuth();

    // =========================
    // WISHLIST
    // =========================

    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

    // =========================
    // REVIEWS
    // =========================

    const { reviews, fetchReviews, addReview, updateReview, removeReview } =
        useReviews();

    // =========================
    // PRODUCT DATA
    // =========================

    const productData = useMemo(() => {
        return products.find((item) => item._id === productId);
    }, [products, productId]);

    // =========================
    // STATES
    // =========================

    const [image, setImage] = useState("");

    const [size, setSize] = useState("");

    const [color, setColor] = useState("");

    const [quantity, setQuantity] = useState(1);

    const [isWishlisted, setIsWishlisted] = useState(false);

    const [showImageZoom, setShowImageZoom] = useState(false);

    // =========================
    // REVIEW STATES
    // =========================

    const [showReviewModal, setShowReviewModal] = useState(false);

    const [rating, setRating] = useState(0);

    const [hover, setHover] = useState(null);

    const [reviewText, setReviewText] = useState("");

    const [editingReviewId, setEditingReviewId] = useState(null);

    // =========================
    // IMAGE + REVIEWS
    // =========================

    useEffect(() => {
        if (productData) {
            setImage(productData.image?.[0] || "");
        }

        if (productId && fetchReviews) {
            fetchReviews(productId);
        }
    }, [productData, productId]);

    // =========================
    // WISHLIST CHECK
    // =========================

    useEffect(() => {
        if (wishlist && productId) {
            setIsWishlisted(wishlist.some((item) => item._id === productId));
        }
    }, [wishlist, productId]);

    // =========================
    // HANDLE WISHLIST
    // =========================

    const handleWishlist = () => {
        if (isWishlisted) {
            removeFromWishlist(productId);
        } else {
            addToWishlist(productId);
        }
    };

    // =========================
    // OPEN REVIEW
    // =========================

    const handleOpenReview = () => {
        if (!currentUser) {
            toast.error("Please login to write a review");

            return;
        }

        setShowReviewModal(true);
    };

    // =========================
    // SUBMIT REVIEW
    // =========================

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

            // Refresh reviews
            if (fetchReviews) {
                await fetchReviews(productId);
            }
        } catch (error) {
            console.log(error);

            toast.error("Failed to submit review");
        }
    };

    // =========================
    // CLOSE REVIEW MODAL
    // =========================

    const closeReviewModal = () => {
        setShowReviewModal(false);
        setRating(0);
        setReviewText("");
        setEditingReviewId(null);
        setHover(null);
    };

    // =========================
    // LOADING
    // =========================

    if (!productData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // =========================
    // RATINGS
    // =========================

    const totalReviews = reviews?.length || 0;

    const avgRating =
        totalReviews > 0
            ? reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) /
              totalReviews
            : 0;

    // =========================
    // HANDLE ADD TO CART
    // =========================

    const handleAddToCart = async () => {
        if (Number(productData.quantity) <= 0) {
            toast.error("Product is out of stock");

            return;
        }

        if (productData.sizes?.length > 0 && !size) {
            toast.error("Please select size");

            return;
        }

        if (productData.color?.length > 0 && !color) {
            toast.error("Please select color");

            return;
        }

        if (quantity > Number(productData.quantity)) {
            toast.error(`Only ${productData.quantity} item(s) available`);

            return;
        }

        try {
            await addToCart(
                productData._id,
                size ? size.trim() : "default",
                color ? color.trim() : "default",
                quantity,
            );
        } catch (error) {
            console.log(error);
        }
    };
    const handleShareProduct = async () => {
        const shareData = {
            title: productData.name,
            text: `Check out ${productData.name}`,
            url: window.location.href,
        };

        try {
            if (navigator.share && navigator.canShare?.(shareData)) {
                await navigator.share(shareData);
                return;
            }

            await navigator.clipboard.writeText(window.location.href);

            toast.success("Product link copied!");
        } catch (error) {
            if (error?.name === "AbortError") {
                return;
            }

            try {
                await navigator.clipboard.writeText(window.location.href);

                toast.success("Product link copied!");
            } catch (clipboardError) {
                console.error("Share Error:", clipboardError);

                toast.error("Unable to share product");
            }
        }
    };

    return (
        <div className="min-h-screen pt-[90px] sm:pt-[110px] lg:pt-[150px] bg-white">
            {/* =====================================================
                BREADCRUMB
            ====================================================== */}

            <div className="border-b border-gray-200">
                <div
                    className="
                        max-w-7xl
                        mx-auto
                        px-4
                        py-3
                        sm:py-4
                        flex
                        items-center
                        gap-1.5
                        sm:gap-2
                        text-xs
                        sm:text-sm
                        text-slate-600
                        overflow-hidden
                    "
                >
                    <button
                        onClick={() => navigate("/")}
                        className="hover:text-black transition flex-shrink-0"
                    >
                        Home
                    </button>

                    <FiChevronRight className="flex-shrink-0" />

                    <button
                        onClick={() => navigate("/collection")}
                        className="hover:text-black transition flex-shrink-0"
                    >
                        Collection
                    </button>

                    <FiChevronRight className="flex-shrink-0" />

                    <span className="text-slate-900 font-medium truncate">
                        {productData.name}
                    </span>
                </div>
            </div>

            {/* =====================================================
                MAIN PRODUCT SECTION
            ====================================================== */}

            <div
                className="
                    max-w-7xl
                    mx-auto
                    px-4
                    py-7
                    sm:py-10
                    lg:py-12
                    grid
                    grid-cols-1
                    lg:grid-cols-2
                    gap-8
                    sm:gap-10
                    lg:gap-12
                "
            >
                {/* =================================================
                    IMAGE SECTION
                ================================================== */}

                <div className="space-y-3 sm:space-y-4">
                    {/* MAIN IMAGE */}

                    <div
                        className="
                            relative
                            group
                            bg-white
                            rounded-2xl
                            sm:rounded-3xl
                            overflow-hidden
                            shadow-lg
                            border
                            border-gray-200
                        "
                    >
                        <img
                            src={image}
                            alt={productData.name}
                            className="
                                w-full
                                aspect-square
                                object-cover
                                lg:group-hover:scale-105
                                transition
                                duration-700
                            "
                        />

                        {/* ZOOM BUTTON */}

                        <button
                            onClick={() => setShowImageZoom(true)}
                            className="
                                absolute
                                top-3
                                right-3
                                sm:top-4
                                sm:right-4
                                p-2.5
                                sm:p-3
                                bg-white
                                rounded-full
                                shadow-md
                                opacity-100
                                lg:opacity-0
                                lg:group-hover:opacity-100
                                transition
                                hover:scale-110
                                border
                                border-gray-200
                            "
                        >
                            <FiZoomIn className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
                        </button>
                    </div>

                    {/* THUMBNAILS */}

                    <div className="grid grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
                        {productData.image?.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => setImage(item)}
                                className={`
                                        aspect-square
                                        rounded-xl
                                        sm:rounded-2xl
                                        overflow-hidden
                                        border-2
                                        transition
                                        ${
                                            image === item
                                                ? "border-black shadow-md scale-[1.02]"
                                                : "border-gray-200 hover:border-black"
                                        }
                                    `}
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

                {/* =================================================
                    PRODUCT INFO
                ================================================== */}

                <div className="space-y-5 sm:space-y-6">
                    {/* TITLE */}

                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                        <h1
                            className="
                                text-2xl
                                sm:text-3xl
                                lg:text-4xl
                                font-bold
                                leading-tight
                                text-[#1E3A5F]
                            "
                        >
                            {productData.name}
                        </h1>

                        {/* WISHLIST */}

                        <button
                            onClick={handleWishlist}
                            className="
                                p-2.5
                                sm:p-3
                                rounded-full
                                bg-white
                                border
                                border-gray-200
                                hover:border-black
                                hover:bg-slate-50
                                transition
                                flex-shrink-0
                            "
                        >
                            <FiHeart
                                className={`
                                    w-5
                                    h-5
                                    sm:w-6
                                    sm:h-6
                                    ${
                                        isWishlisted
                                            ? "fill-[#0F766E] text-[#0F766E]"
                                            : "text-slate-600"
                                    }
                                `}
                            />
                        </button>
                    </div>

                    {/* RATING */}

                    <div className="flex items-center gap-2.5 sm:gap-4">
                        <div className="flex items-center gap-0.5 sm:gap-1">
                            {[...Array(5)].map((_, index) => (
                                <FaStar
                                    key={index}
                                    size={window.innerWidth < 640 ? 16 : 20}
                                    color={
                                        index < Math.round(avgRating)
                                            ? "#0F766E"
                                            : "#e5e7eb"
                                    }
                                />
                            ))}
                        </div>

                        <span className="text-xs sm:text-sm text-slate-600">
                            {avgRating.toFixed(1)} ({totalReviews})
                        </span>
                    </div>

                    {/* PRICE */}

                    <div
                        className="
                            text-3xl
                            sm:text-4xl
                            lg:text-5xl
                            font-bold
                            text-slate-900
                        "
                    >
                        {currency}
                        {productData.price}
                    </div>

                    {/* DESCRIPTION */}

                    <p
                        className="
                            text-sm
                            sm:text-base
                            text-slate-600
                            leading-relaxed
                        "
                    >
                        {productData.description}
                    </p>

                    {/* SIZE */}

                    {productData.sizes?.length > 0 && (
                        <div>
                            <p className="font-semibold mb-3 text-sm sm:text-base text-slate-900">
                                Select Size
                            </p>

                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                {productData.sizes.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSize(item)}
                                        className={`
                                                min-w-[52px]
                                                sm:min-w-[60px]
                                                px-4
                                                sm:px-5
                                                py-2.5
                                                sm:py-3
                                                rounded-xl
                                                text-sm
                                                sm:text-base
                                                font-semibold
                                                transition-all
                                                duration-300
                                                ${
                                                    item === size
                                                        ? "bg-black text-white shadow-md scale-105"
                                                        : "bg-white border border-gray-300 hover:border-black hover:scale-105"
                                                }
                                            `}
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
                            <p className="font-semibold mb-3 text-sm sm:text-base text-slate-900">
                                Select Color
                            </p>

                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                {productData.color.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setColor(item)}
                                        className={`
                                                px-4
                                                sm:px-5
                                                py-2.5
                                                sm:py-3
                                                rounded-xl
                                                text-sm
                                                sm:text-base
                                                font-semibold
                                                capitalize
                                                transition-all
                                                duration-300
                                                ${
                                                    item === color
                                                        ? "bg-black text-white shadow-md scale-105"
                                                        : "bg-white border border-gray-300 hover:border-black hover:scale-105"
                                                }
                                            `}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* QUANTITY */}

                    <div>
                        <p className="font-semibold mb-2 text-sm sm:text-base text-slate-900">
                            Quantity
                        </p>

                        <p className="text-xs sm:text-sm text-slate-500 mb-3">
                            {productData.quantity > 0
                                ? `${productData.quantity} items available`
                                : "Out of stock"}
                        </p>

                        <div className="flex items-center gap-2.5">
                            {/* MINUS */}

                            <button
                                onClick={() =>
                                    setQuantity((prev) => Math.max(1, prev - 1))
                                }
                                disabled={quantity <= 1}
                                className="
                                    w-10
                                    h-10
                                    sm:w-12
                                    sm:h-12
                                    rounded-xl
                                    border
                                    border-gray-300
                                    hover:border-black
                                    hover:bg-black
                                    hover:text-white
                                    disabled:opacity-40
                                    disabled:cursor-not-allowed
                                    transition
                                "
                            >
                                −
                            </button>

                            {/* NUMBER */}

                            <span
                                className="
                                    w-12
                                    sm:w-16
                                    text-center
                                    text-lg
                                    sm:text-xl
                                    font-bold
                                    text-slate-900
                                "
                            >
                                {quantity}
                            </span>

                            {/* PLUS */}

                            <button
                                onClick={() =>
                                    setQuantity((prev) =>
                                        Math.min(
                                            Number(productData.quantity) || 1,
                                            prev + 1,
                                        ),
                                    )
                                }
                                disabled={
                                    quantity >= Number(productData.quantity)
                                }
                                className="
                                    w-10
                                    h-10
                                    sm:w-12
                                    sm:h-12
                                    rounded-xl
                                    border
                                    border-gray-300
                                    hover:border-black
                                    hover:bg-black
                                    hover:text-white
                                    disabled:opacity-40
                                    disabled:cursor-not-allowed
                                    transition
                                "
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* =================================================
                        ACTION BUTTONS
                    ================================================== */}

                    <div
                        className="
        flex
        flex-col
        sm:flex-row
        gap-3
        sm:gap-4
        pt-4
        sm:pt-6
    "
                    >
                        {/* ADD TO CART */}

                        <RippleButton
                            onClick={handleAddToCart}
                            className="
            w-full
            sm:flex-1
            px-4
            sm:px-8
            py-3
            sm:py-4
            rounded-xl
            sm:rounded-2xl
            text-sm
            sm:text-base
        "
                        >
                            Add To Cart
                        </RippleButton>

                        {/* WRITE REVIEW */}

                        <button
                            onClick={handleOpenReview}
                            className="
            w-full
            sm:flex-1
            px-4
            sm:px-8
            py-3
            sm:py-4
            bg-white
            border
            border-gray-300
            text-slate-800
            rounded-xl
            sm:rounded-2xl
            text-sm
            sm:text-base
            font-semibold
            hover:border-black
            hover:bg-slate-50
            transition
        "
                        >
                            WRITE REVIEW
                        </button>

                        {/* SHARE */}

                        <button
                            onClick={handleShareProduct}
                            className="
        w-full
        sm:w-auto
        sm:flex-shrink-0
        px-4
        sm:px-5
        py-3
        sm:py-4
        bg-white
        border
        border-gray-300
        text-slate-800
        rounded-xl
        sm:rounded-2xl
        hover:border-black
        hover:bg-slate-50
        transition
        flex
        items-center
        justify-center
        gap-2
        font-semibold
        text-sm
    "
                            aria-label="Share product"
                        >
                            <FiShare2 className="w-5 h-5 text-slate-700" />

                            <span className="sm:hidden">SHARE PRODUCT</span>
                        </button>
                    </div>

                    {/* =================================================
                        FEATURES
                    ================================================== */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            sm:grid-cols-3
                            gap-2.5
                            sm:gap-4
                            pt-4
                            sm:pt-6
                        "
                    >
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
                                    className="
                                            flex
                                            items-center
                                            gap-3
                                            p-3
                                            sm:p-4
                                            bg-white
                                            rounded-xl
                                            sm:rounded-2xl
                                            border
                                            border-gray-200
                                            shadow-sm
                                        "
                                >
                                    <div className="p-2 sm:p-3 bg-black rounded-xl flex-shrink-0">
                                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                    </div>

                                    <span className="text-xs sm:text-sm font-semibold text-slate-700">
                                        {feature.text}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* =====================================================
                REVIEWS
            ====================================================== */}

            <div className="max-w-7xl mx-auto px-4 mt-12 sm:mt-16 lg:mt-20">
                {/* REVIEW HEADER */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        mb-6
                        sm:mb-8
                    "
                >
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        Customer Reviews
                    </h2>

                    <span
                        className="
                            px-3
                            sm:px-4
                            py-1.5
                            sm:py-2
                            bg-slate-100
                            text-[#1E3A5F]
                            rounded-full
                            text-xs
                            sm:text-sm
                            font-semibold
                            border
                            border-gray-200
                            flex-shrink-0
                        "
                    >
                        {totalReviews} Reviews
                    </span>
                </div>

                {/* REVIEW LIST */}

                <div className="space-y-4 sm:space-y-6">
                    {reviews && reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div
                                key={review._id}
                                className="
                                        bg-white
                                        border
                                        border-gray-200
                                        rounded-2xl
                                        sm:rounded-3xl
                                        p-4
                                        sm:p-6
                                        shadow-sm
                                        hover:shadow-md
                                        transition-all
                                        duration-300
                                    "
                            >
                                <div
                                    className="
                                            flex
                                            flex-col
                                            sm:flex-row
                                            sm:items-start
                                            justify-between
                                            gap-4
                                        "
                                >
                                    {/* LEFT */}

                                    <div className="flex items-start gap-3 sm:gap-4">
                                        {/* USER */}

                                        <div
                                            className="
                                                    w-11
                                                    h-11
                                                    sm:w-14
                                                    sm:h-14
                                                    rounded-full
                                                    bg-black
                                                    text-white
                                                    flex
                                                    items-center
                                                    justify-center
                                                    text-base
                                                    sm:text-xl
                                                    font-bold
                                                    shrink-0
                                                "
                                        >
                                            {review?.user?.name?.[0]?.toUpperCase() ||
                                                "U"}
                                        </div>

                                        {/* CONTENT */}

                                        <div className="min-w-0">
                                            <h4
                                                className="
                                                        text-base
                                                        sm:text-lg
                                                        font-semibold
                                                        text-slate-900
                                                    "
                                            >
                                                {review?.userId?.name ||
                                                    "Anonymous User"}
                                            </h4>

                                            {/* STARS */}

                                            <div className="flex items-center gap-1 mt-1 mb-2 sm:mb-3">
                                                {[...Array(5)].map(
                                                    (_, index) => (
                                                        <FaStar
                                                            key={index}
                                                            size={14}
                                                            color={
                                                                index <
                                                                review.rating
                                                                    ? "#0F766E"
                                                                    : "#d1d5db"
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </div>

                                            {/* TEXT */}

                                            <p
                                                className="
                                                        text-sm
                                                        sm:text-base
                                                        text-slate-600
                                                        leading-relaxed
                                                        break-words
                                                    "
                                            >
                                                {review.comment}
                                            </p>

                                            {/* DATE */}

                                            <p className="text-xs text-slate-400 mt-3 sm:mt-4">
                                                {new Date(
                                                    review.date,
                                                ).toDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* ACTIONS */}

                                    {currentUser?._id ===
                                        review?.userId?._id && (
                                        <div
                                            className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    sm:gap-3
                                                    sm:flex-shrink-0
                                                "
                                        >
                                            {/* EDIT */}

                                            <button
                                                onClick={() => {
                                                    setEditingReviewId(
                                                        review._id,
                                                    );

                                                    setRating(review.rating);

                                                    setReviewText(
                                                        review.comment,
                                                    );

                                                    setShowReviewModal(true);
                                                }}
                                                className="
                                                        px-3
                                                        sm:px-4
                                                        py-2
                                                        text-xs
                                                        sm:text-sm
                                                        border
                                                        border-gray-300
                                                        rounded-xl
                                                        hover:border-black
                                                        hover:bg-slate-50
                                                        transition
                                                    "
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

                                                        if (fetchReviews) {
                                                            await fetchReviews(
                                                                productId,
                                                            );
                                                        }
                                                    } catch {
                                                        toast.error(
                                                            "Failed to delete review",
                                                        );
                                                    }
                                                }}
                                                className="
                                                        px-3
                                                        sm:px-4
                                                        py-2
                                                        text-xs
                                                        sm:text-sm
                                                        bg-red-500
                                                        hover:bg-red-600
                                                        text-white
                                                        rounded-xl
                                                        transition
                                                    "
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        /* EMPTY REVIEWS */

                        <div
                            className="
                                bg-gradient-to-br
                                from-sky-50
                                to-slate-100
                                border
                                border-gray-200
                                rounded-2xl
                                sm:rounded-3xl
                                p-8
                                sm:p-12
                                text-center
                                shadow-sm
                            "
                        >
                            <div
                                className="
                                    w-16
                                    h-16
                                    sm:w-20
                                    sm:h-20
                                    rounded-full
                                    bg-white
                                    border
                                    border-gray-200
                                    flex
                                    items-center
                                    justify-center
                                    mx-auto
                                    mb-4
                                    sm:mb-5
                                    shadow-sm
                                "
                            >
                                <FaStar className="text-[#1E3A5F] text-2xl sm:text-3xl" />
                            </div>

                            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 sm:mb-3">
                                No Reviews Yet
                            </h3>

                            <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
                                Be the first one to share your experience about
                                this product.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* =====================================================
                RELATED PRODUCTS
            ====================================================== */}

            <RelatedProducts
                category={productData.category}
                subCategory={productData.subCategory}
            />

            {/* =====================================================
                IMAGE ZOOM
            ====================================================== */}

            {showImageZoom && (
                <div
                    onClick={() => setShowImageZoom(false)}
                    className="
                        fixed
                        inset-0
                        z-[100]
                        flex
                        items-center
                        justify-center
                        bg-black/90
                        cursor-zoom-out
                        p-4
                    "
                >
                    {/* CLOSE */}

                    <button
                        onClick={(e) => {
                            e.stopPropagation();

                            setShowImageZoom(false);
                        }}
                        className="
                            absolute
                            top-4
                            right-4
                            z-10
                            p-2.5
                            sm:p-3
                            bg-white
                            rounded-full
                            shadow-lg
                        "
                    >
                        <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    <img
                        src={image}
                        alt={productData.name}
                        onClick={(e) => e.stopPropagation()}
                        className="
                            max-w-full
                            max-h-[90vh]
                            object-contain
                            rounded-xl
                            sm:rounded-2xl
                        "
                    />
                </div>
            )}

            {/* =====================================================
                REVIEW MODAL
            ====================================================== */}

            {showReviewModal && (
                <div
                    className="
                        fixed
                        inset-0
                        z-[110]
                        flex
                        items-center
                        justify-center
                        bg-black/60
                        px-3
                        sm:px-4
                    "
                >
                    <div
                        className="
                            w-full
                            max-w-lg
                            max-h-[90vh]
                            overflow-y-auto
                            bg-white
                            rounded-2xl
                            sm:rounded-3xl
                            shadow-2xl
                            border
                            border-gray-200
                            p-5
                            sm:p-8
                            relative
                        "
                    >
                        {/* CLOSE */}

                        <button
                            onClick={closeReviewModal}
                            className="
                                absolute
                                top-3
                                right-3
                                sm:top-4
                                sm:right-4
                                w-9
                                h-9
                                sm:w-10
                                sm:h-10
                                rounded-full
                                border
                                border-gray-200
                                hover:border-black
                                hover:bg-slate-100
                                transition
                                flex
                                items-center
                                justify-center
                                text-slate-600
                            "
                        >
                            <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        {/* TITLE */}

                        <h2
                            className="
                                text-2xl
                                sm:text-3xl
                                font-bold
                                text-[#1E3A5F]
                                mb-2
                                pr-10
                            "
                        >
                            {editingReviewId ? "Edit Review" : "Write a Review"}
                        </h2>

                        <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8">
                            Share your experience about this product
                        </p>

                        {/* STAR RATING */}

                        <div className="flex items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
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
                                            size={28}
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

                        {/* TEXTAREA */}

                        <textarea
                            rows={5}
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Write your review here..."
                            className="
                                w-full
                                border
                                border-gray-300
                                rounded-2xl
                                p-4
                                outline-none
                                focus:ring-2
                                focus:ring-black
                                focus:border-black
                                transition
                                resize-none
                                text-sm
                                sm:text-base
                                text-slate-700
                            "
                        />

                        {/* ACTIONS */}

                        <div
                            className="
                                flex
                                flex-col-reverse
                                sm:flex-row
                                justify-end
                                gap-2.5
                                sm:gap-3
                                mt-6
                                sm:mt-8
                            "
                        >
                            <button
                                onClick={closeReviewModal}
                                className="
                                    w-full
                                    sm:w-auto
                                    px-6
                                    py-3
                                    border
                                    border-gray-300
                                    rounded-2xl
                                    hover:border-black
                                    hover:bg-slate-50
                                    transition
                                    font-medium
                                    text-sm
                                    sm:text-base
                                "
                            >
                                Cancel
                            </button>

                            <button
                                onClick={submitReview}
                                className="
                                    w-full
                                    sm:w-auto
                                    px-6
                                    py-3
                                    bg-black
                                    hover:bg-neutral-800
                                    text-white
                                    rounded-2xl
                                    transition-all
                                    duration-300
                                    font-medium
                                    shadow-md
                                    text-sm
                                    sm:text-base
                                "
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
