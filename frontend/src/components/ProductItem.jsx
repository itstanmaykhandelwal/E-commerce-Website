// import React, { useContext } from 'react'
// import { ShopContext } from '../context/ShopContext'
// import { Link, useNavigate } from 'react-router-dom'
// import { toast } from 'react-toastify';
// import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

// const ProductItem = ({ id, image, name, price }) => {
//     const { currency, wishlist, addToWishlist, removeFromWishlist, token } = useContext(ShopContext);
//     const navigate = useNavigate();

//     const isInWishlist = wishlist.some(item => item._id === id);

//     const toggleWishlist = (e) => {
//         e.preventDefault(); // Link ke click ko rokne ke liye

//         if (!token) {
//             toast.error("Please login to use wishlist");
//             return;
//         }

//         if (isInWishlist) removeFromWishlist(id);
//         else addToWishlist(id);
//     }

//     return (
//         <div  onClick={() => navigate(`/product/${id}`)} className='product-card text-gray-700 cursor-pointer relative block' to={`/product/${id}`}>
//             {/* Heart Icon */}
//             <div
//                 onClick={toggleWishlist}
//                 className="absolute top-2 right-4 z-10 cursor-pointer text-xl"
//             >
//                 {isInWishlist ? (
//                     <AiFillHeart className="text-red-500" />
//                 ) : (
//                     <AiOutlineHeart />
//                 )}
//             </div>

//             {/* Product Image */}
//             <div className='overflow-hidden'>
//                 <img
//                     className='hover:scale-110 transition ease-in-out'
//                     src={image[0]}
//                     alt={name}
//                 />
//             </div>
//             <div className='p-2'>
//                 <p className='pt-2 pb-1 text-sm'>{name}</p>
//             <p className='text-sm font-medium'>{currency}{price}</p>
//             </div>
//         </div>
//     )
// }

// export default ProductItem

import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const ProductItem = ({ id, image, name, price }) => {
    const { currency, wishlist, addToWishlist, removeFromWishlist, token } =
        useContext(ShopContext);
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const isInWishlist = wishlist.some((item) => item._id === id);

    const toggleWishlist = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (!token) {
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
            className="product-card group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
        >
            {/* IMAGE */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50">
                <img
                    src={image[0]}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700"
                />

                {/* Overlay */}
                <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 ${
                        isHovered ? "opacity-100" : "opacity-0"
                    }`}
                />

                {/* Wishlist */}
                <div
                    onClick={toggleWishlist}
                    className="absolute top-4 right-4 z-10 p-2.5 bg-white/95 backdrop-blur rounded-full shadow hover:scale-110 transition"
                >
                    {isInWishlist ? (
                        <AiFillHeart className="text-emerald-600 text-lg" />
                    ) : (
                        <AiOutlineHeart className="text-slate-700 text-lg hover:text-emerald-600 transition-colors" />
                    )}
                </div>

                {/* Rating */}
                <div
                    className={`absolute bottom-4 left-4 flex items-center gap-1 px-3 py-1.5 bg-white/95 backdrop-blur rounded-full shadow transition-all duration-300 ${
                        isHovered
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-12"
                    }`}
                >
                    <svg
                        className="w-3.5 h-3.5 text-emerald-500"
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
                    <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded-full shadow">
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
                        className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold rounded-full shadow hover:scale-105 transition"
                    >
                        View
                    </button>
                </div>
            </div>

            {/* INFO */}
            <div className="p-4 space-y-2">
                <h3 className="text-sm md:text-base font-semibold text-slate-800 line-clamp-2 min-h-[2.5rem] hover:text-emerald-700 transition">
                    {name}
                </h3>

                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-lg font-bold text-slate-900">
                            {currency}
                            {price}
                        </p>
                        <p className="text-xs text-slate-500 line-through">
                            {currency}
                            {Math.round(price * 1.5)}
                        </p>
                    </div>

                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                        33% OFF
                    </span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                        In Stock
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>Fast Delivery</span>
                </div>
            </div>

            {/* SHINE */}
            <div
                className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transition-all duration-1000 ${
                    isHovered ? "translate-x-full" : "-translate-x-full"
                }`}
                style={{ pointerEvents: "none" }}
            />
        </div>
    );
};

export default ProductItem;
