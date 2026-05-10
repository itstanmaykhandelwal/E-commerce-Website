import React, { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

// CUSTOM HOOKS
import useWishlist from "../hooks/useWishlist";

import useAuth from "../hooks/useAuth";

// CONSTANTS
import { currency } from "../utils/constants";

const ProductItem = ({ id, image, name, price }) => {
    const navigate = useNavigate();

    const [isHovered, setIsHovered] = useState(false);

    // AUTH
    const { isAuthenticated } = useAuth();

    // WISHLIST
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

    // CHECK WISHLIST
    const isInWishlist = useMemo(() => {
        return wishlist?.some((item) => item._id === id);
    }, [wishlist, id]);

    // TOGGLE WISHLIST
    const toggleWishlist = (e) => {
        e.stopPropagation();

        e.preventDefault();

        if (!isAuthenticated) {
            toast.error("Please login to use wishlist");

            return;
        }

        if (isInWishlist) {
            removeFromWishlist(id);

            toast.success("Removed from wishlist");
        } else {
            addToWishlist(id);

            toast.success("Added to wishlist");
        }
    };

    return (
        <div
            onClick={() => navigate(`/product/${id}`)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="product-card group relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 cursor-pointer"
        >
            {/* IMAGE */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-sky-50">
                <img
                    src={image?.[0]}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* OVERLAY */}
                <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent transition-opacity duration-300 ${
                        isHovered ? "opacity-100" : "opacity-0"
                    }`}
                />

                {/* WISHLIST */}
                <div
                    onClick={toggleWishlist}
                    className="absolute top-4 right-4 z-10 p-2.5 bg-white rounded-full shadow-md border border-gray-200 hover:scale-110 transition"
                >
                    {isInWishlist ? (
                        <AiFillHeart className="text-[#0F766E] text-lg" />
                    ) : (
                        <AiOutlineHeart className="text-slate-700 text-lg hover:text-black transition-colors" />
                    )}
                </div>

                {/* RATING */}
                <div
                    className={`absolute bottom-4 left-4 flex items-center gap-1 px-3 py-1.5 bg-white rounded-full shadow border border-gray-200 transition-all duration-300 ${
                        isHovered
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-12"
                    }`}
                >
                    <svg
                        className="w-3.5 h-3.5 text-[#0F766E]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>

                    <span className="text-xs font-semibold text-slate-900">
                        4.8
                    </span>
                </div>

                {/* NEW BADGE */}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded-full shadow">
                        NEW
                    </span>
                </div>

                {/* VIEW BUTTON */}
                <div
                    className={`absolute bottom-4 right-4 transition-all duration-300 ${
                        isHovered
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-12"
                    }`}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();

                            navigate(`/product/${id}`);
                        }}
                        className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white text-sm font-semibold rounded-full shadow-md hover:scale-105 transition"
                    >
                        View
                    </button>
                </div>
            </div>

            {/* INFO */}
            <div className="p-4 space-y-2">
                <h3 className="text-sm md:text-base font-semibold text-slate-800 line-clamp-2 min-h-[2.5rem] hover:text-[#1E3A5F] transition">
                    {name}
                </h3>

                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-lg font-bold text-slate-900">
                            {currency}
                            {price}
                        </p>

                        <p className="text-xs text-slate-400 line-through">
                            {currency}
                            {Math.round(price * 1.5)}
                        </p>
                    </div>

                    <span className="px-3 py-1 bg-slate-100 text-[#1E3A5F] text-xs font-semibold rounded-full border border-gray-200">
                        33% OFF
                    </span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-[#0F766E] rounded-full" />
                        In Stock
                    </span>

                    <span className="text-slate-300">•</span>

                    <span>Fast Delivery</span>
                </div>
            </div>

            {/* SHINE EFFECT */}
            <div
                className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transition-all duration-1000 ${
                    isHovered ? "translate-x-full" : "-translate-x-full"
                }`}
                style={{
                    pointerEvents: "none",
                }}
            />
        </div>
    );
};

export default ProductItem;
