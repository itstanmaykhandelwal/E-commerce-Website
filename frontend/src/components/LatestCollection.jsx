import React, { useMemo } from "react";

import { useNavigate } from "react-router-dom";

import Title from "./Title";
import ProductItem from "./ProductItem";

import useProducts from "../hooks/useProducts";

const LatestCollection = () => {
    const navigate = useNavigate();

    const { products, loading } = useProducts();

    // MEMOIZED PRODUCTS
    const latestProducts = useMemo(() => {
        return products?.slice(0, 10) || [];
    }, [products]);

    return (
        <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white">
            <div className="relative max-w-7xl mx-auto">
                {/* SECTION HEADER */}
                <div className="text-center mb-12 space-y-4 animate-fade-in-up">
                    <Title text1="LATEST" text2="COLLECTIONS" />

                    <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed px-4">
                        Shop the latest collection of Krishna Ji Poshaks, Laddu
                        Gopal dresses, and devotional attire – perfect for
                        festivals and daily worship.
                    </p>
                </div>

                {/* LOADING */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {[...Array(10)].map((_, index) => (
                            <div key={index} className="animate-pulse">
                                <div className="bg-gray-200 aspect-square rounded-2xl mb-3"></div>

                                <div className="bg-gray-200 h-4 rounded-full mb-2"></div>

                                <div className="bg-gray-200 h-4 w-2/3 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                ) : latestProducts.length > 0 ? (
                    <>
                        {/* PRODUCTS GRID */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
                            {latestProducts.map((item, index) => (
                                <div
                                    key={item._id}
                                    className="animate-fade-in-up"
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                    }}
                                >
                                    <ProductItem
                                        id={item._id}
                                        image={item.image}
                                        name={item.name}
                                        price={item.price}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* VIEW MORE */}
                        <div className="flex justify-center mt-12 animate-fade-in-up">
                            <button
                                onClick={() => navigate("/collection")}
                                className="group px-8 py-4 bg-black text-white font-semibold rounded-full shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 hover:bg-neutral-800"
                            >
                                <span>View All Collections</span>

                                <svg
                                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                    />
                                </svg>
                            </button>
                        </div>
                    </>
                ) : (
                    /* EMPTY STATE */
                    <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 bg-sky-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                            </div>

                            <div className="relative bg-gradient-to-br from-sky-50 to-slate-100 p-8 rounded-full border border-gray-200">
                                <svg
                                    className="w-16 h-16 text-[#1E3A5F]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                </svg>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-slate-800 mb-2">
                            No Products Available
                        </h3>

                        <p className="text-slate-600 text-center max-w-md mb-6">
                            We're working on bringing you amazing new
                            collections. Check back soon.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default LatestCollection;
