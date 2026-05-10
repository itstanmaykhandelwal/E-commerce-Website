import React, { useMemo } from "react";

import ProductItem from "./ProductItem";

import Title from "./Title";

// CUSTOM HOOK
import useProducts from "../hooks/useProducts";

const Bestseller = () => {
    // PRODUCTS
    const { products, loading } = useProducts();

    // BESTSELLER PRODUCTS
    const bestSeller = useMemo(() => {
        return products?.filter((item) => item.bestseller)?.slice(0, 5);
    }, [products]);

    return (
        <section className="my-16 bg-white">
            {/* TITLE */}
            <div className="text-center text-3xl py-8">
                <Title text1={"BEST"} text2={"SELLERS"} />

                <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-slate-600 mt-3 leading-relaxed">
                    Discover our most loved products, trusted by customers for
                    quality, comfort, and style.
                </p>
            </div>

            {/* PRODUCTS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {loading ? (
                    [...Array(5)].map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="aspect-square rounded-2xl bg-gray-200 mb-3" />

                            <div className="h-4 bg-gray-200 rounded-full mb-2" />

                            <div className="h-4 w-2/3 bg-gray-200 rounded-full" />
                        </div>
                    ))
                ) : bestSeller?.length > 0 ? (
                    bestSeller.map((item) => (
                        <ProductItem
                            key={item._id}
                            id={item._id}
                            image={item.image}
                            name={item.name}
                            price={item.price}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-16">
                        <div className="inline-flex flex-col items-center bg-gradient-to-br from-sky-50 to-slate-100 border border-gray-200 rounded-3xl px-10 py-10 shadow-sm">
                            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm mb-5 border border-gray-200">
                                <svg
                                    className="w-10 h-10 text-[#1E3A5F]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.8}
                                        d="M5 8h14l-1 11H6L5 8zm3-3a4 4 0 018 0"
                                    />
                                </svg>
                            </div>

                            <p className="text-slate-700 text-lg font-semibold">
                                No bestseller products available.
                            </p>

                            <p className="text-slate-500 text-sm mt-2">
                                New featured collections will appear here soon.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Bestseller;
