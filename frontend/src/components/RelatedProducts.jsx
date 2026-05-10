import React, { useMemo } from "react";

import Title from "./Title";

import ProductItem from "./ProductItem";

// CUSTOM HOOK
import useProducts from "../hooks/useProducts";

const RelatedProducts = ({ category, subCategory }) => {
    // PRODUCTS
    const { products, loading } = useProducts();

    // RELATED PRODUCTS
    const relatedProducts = useMemo(() => {
        if (!products?.length) {
            return [];
        }

        return products
            .filter((item) => item.category === category)
            .filter((item) => item.subCategory === subCategory)
            .slice(0, 5);
    }, [products, category, subCategory]);

    return (
        <section className="my-24 bg-white">
            {/* TITLE */}
            <div className="text-center text-3xl py-4">
                <Title text1={"RELATED"} text2={"PRODUCTS"} />

                <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-2xl mx-auto leading-relaxed">
                    Explore more products similar to your selection, carefully
                    chosen based on category and style.
                </p>
            </div>

            {/* PRODUCTS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {loading ? (
                    [...Array(5)].map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="aspect-square rounded-2xl bg-gray-200 mb-3" />

                            <div className="h-4 bg-gray-200 rounded-full mb-2" />

                            <div className="h-4 w-2/3 bg-gray-200 rounded-full" />
                        </div>
                    ))
                ) : relatedProducts.length > 0 ? (
                    relatedProducts.map((item) => (
                        <ProductItem
                            key={item._id}
                            id={item._id}
                            name={item.name}
                            price={item.price}
                            image={item.image}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-16">
                        <div className="inline-flex flex-col items-center bg-gradient-to-br from-sky-50 to-slate-100 border border-gray-200 rounded-3xl px-10 py-10 shadow-sm">
                            <div className="w-20 h-20 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center mb-5">
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
                                        d="M3 7l9-4 9 4-9 4-9-4zm0 0v10l9 4 9-4V7"
                                    />
                                </svg>
                            </div>

                            <p className="text-slate-700 text-lg font-semibold">
                                No related products found.
                            </p>

                            <p className="text-slate-500 text-sm mt-2">
                                More matching collections will appear here soon.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default RelatedProducts;
