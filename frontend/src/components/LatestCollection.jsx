import React, { useEffect, useMemo, useState } from "react";

import Title from "./Title";
import ProductItem from "./ProductItem";

import useProducts from "../hooks/useProducts";

const LatestCollection = () => {
    const { products, loading } = useProducts();

    // Number of products visible initially
    const INITIAL_PRODUCTS = 4;

    // Number of products added on every Load More click
    const LOAD_MORE_COUNT = 4;

    const [visibleCount, setVisibleCount] = useState(INITIAL_PRODUCTS);

    // Reset visible products whenever products change
    useEffect(() => {
        setVisibleCount(INITIAL_PRODUCTS);
    }, [products]);

    // Latest products
    const latestProducts = useMemo(() => {
        return products?.slice(0, visibleCount) || [];
    }, [products, visibleCount]);

    // Check if more products are available
    const hasMoreProducts =
        products && visibleCount < products.length;

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
    };

    return (
        <section className="relative py-10 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white">
            <div className="relative max-w-7xl mx-auto">

                {/* ================= SECTION HEADER ================= */}
                <div className="text-center mb-8 sm:mb-10 lg:mb-12 space-y-3 sm:space-y-4 animate-fade-in-up">

                    <Title
                        text1="LATEST"
                        text2="COLLECTIONS"
                    />

                    <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base lg:text-lg text-slate-600 leading-relaxed px-2 sm:px-4">
                        Shop the latest collection of Krishna Ji Poshaks,
                        Laddu Gopal dresses, and devotional attire – perfect
                        for festivals and daily worship.
                    </p>

                </div>

                {/* ================= LOADING ================= */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">

                        {[...Array(4)].map((_, index) => (
                            <div
                                key={index}
                                className="animate-pulse"
                            >
                                <div className="bg-gray-200 aspect-square rounded-2xl mb-3"></div>

                                <div className="bg-gray-200 h-4 rounded-full mb-2"></div>

                                <div className="bg-gray-200 h-4 w-2/3 rounded-full"></div>
                            </div>
                        ))}

                    </div>
                ) : latestProducts.length > 0 ? (
                    <>
                        {/* ================= PRODUCTS GRID ================= */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">

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

                        {/* ================= LOAD MORE ================= */}
                        {hasMoreProducts && (
                            <div className="flex justify-center mt-8 sm:mt-10 lg:mt-12">

                                <button
                                    onClick={handleLoadMore}
                                    className="
                                        group
                                        px-6 sm:px-8
                                        py-3 sm:py-4
                                        bg-black
                                        text-white
                                        text-sm sm:text-base
                                        font-semibold
                                        rounded-full
                                        shadow-md
                                        hover:shadow-xl
                                        hover:bg-neutral-800
                                        transition-all
                                        duration-300
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <span>Load More</span>

                                    <svg
                                        className="
                                            w-4 h-4 sm:w-5 sm:h-5
                                            group-hover:translate-y-1
                                            transition-transform
                                        "
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                            </div>
                        )}

                        {/* ================= ALL PRODUCTS LOADED ================= */}
                        {!hasMoreProducts && products.length > 4 && (
                            <p className="text-center text-sm text-slate-500 mt-8">
                                You've reached the end of the collection.
                            </p>
                        )}
                    </>
                ) : (
                    /* ================= EMPTY STATE ================= */
                    <div className="flex flex-col items-center justify-center py-16 sm:py-20 animate-fade-in-up">

                        <div className="relative mb-6">

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 bg-sky-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                            </div>

                            <div className="relative bg-gradient-to-br from-sky-50 to-slate-100 p-8 rounded-full border border-gray-200">

                                <svg
                                    className="w-14 h-14 sm:w-16 sm:h-16 text-[#1E3A5F]"
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

                        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
                            No Products Available
                        </h3>

                        <p className="text-sm sm:text-base text-slate-600 text-center max-w-md mb-6 px-4">
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