import React, { useMemo } from "react";

import Title from "./Title";
import ProductItem from "./ProductItem";

// CUSTOM HOOK
import useProducts from "../hooks/useProducts";

const RelatedProducts = ({ category, subCategory }) => {
    // =========================
    // PRODUCTS
    // =========================

    const { products, loading } = useProducts();

    // =========================
    // RELATED PRODUCTS
    // =========================

    const relatedProducts = useMemo(() => {
        if (!products?.length) {
            return [];
        }

        return products
            .filter(
                (item) =>
                    item.category === category
            )
            .filter(
                (item) =>
                    item.subCategory ===
                    subCategory
            )
            .slice(0, 5);
    }, [products, category, subCategory]);

    return (
        <section
            className="
                my-14
                sm:my-18
                lg:my-24
                bg-white
                px-4
                sm:px-6
                lg:px-8
            "
        >
            <div className="max-w-7xl mx-auto">

                {/* =========================
                    TITLE
                ========================== */}

                <div
                    className="
                        text-center
                        py-3
                        sm:py-4
                        mb-5
                        sm:mb-8
                    "
                >
                    <Title
                        text1="RELATED"
                        text2="PRODUCTS"
                    />

                    <p
                        className="
                            text-xs
                            sm:text-sm
                            md:text-base
                            text-slate-600
                            mt-2
                            sm:mt-3
                            max-w-2xl
                            mx-auto
                            leading-relaxed
                            px-2
                        "
                    >
                        Explore more products similar
                        to your selection, carefully
                        chosen based on category and
                        style.
                    </p>
                </div>

                {/* =========================
                    PRODUCTS GRID
                ========================== */}

                <div
                    className="
                        grid
                        grid-cols-2
                        sm:grid-cols-3
                        md:grid-cols-4
                        lg:grid-cols-5
                        gap-3
                        sm:gap-4
                        md:gap-5
                        lg:gap-6
                    "
                >
                    {/* =========================
                        LOADING
                    ========================== */}

                    {loading ? (
                        [...Array(5)].map(
                            (_, index) => (
                                <div
                                    key={index}
                                    className="
                                        animate-pulse
                                        min-w-0
                                    "
                                >
                                    <div
                                        className="
                                            aspect-square
                                            rounded-xl
                                            sm:rounded-2xl
                                            bg-gray-200
                                            mb-2
                                            sm:mb-3
                                        "
                                    />

                                    <div
                                        className="
                                            h-3
                                            sm:h-4
                                            bg-gray-200
                                            rounded-full
                                            mb-2
                                        "
                                    />

                                    <div
                                        className="
                                            h-3
                                            sm:h-4
                                            w-2/3
                                            bg-gray-200
                                            rounded-full
                                        "
                                    />
                                </div>
                            )
                        )
                    ) : relatedProducts.length >
                      0 ? (
                        /* =========================
                            PRODUCTS
                        ========================== */

                        relatedProducts.map(
                            (item) => (
                                <div
                                    key={
                                        item._id
                                    }
                                    className="
                                        min-w-0
                                    "
                                >
                                    <ProductItem
                                        id={
                                            item._id
                                        }
                                        name={
                                            item.name
                                        }
                                        price={
                                            item.price
                                        }
                                        image={
                                            item.image
                                        }
                                    />
                                </div>
                            )
                        )
                    ) : (
                        /* =========================
                            EMPTY STATE
                        ========================== */

                        <div
                            className="
                                col-span-full
                                text-center
                                py-10
                                sm:py-16
                            "
                        >
                            <div
                                className="
                                    inline-flex
                                    flex-col
                                    items-center
                                    bg-gradient-to-br
                                    from-sky-50
                                    to-slate-100
                                    border
                                    border-gray-200
                                    rounded-2xl
                                    sm:rounded-3xl
                                    px-6
                                    sm:px-10
                                    py-7
                                    sm:py-10
                                    shadow-sm
                                "
                            >
                                {/* ICON */}

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
                                        shadow-sm
                                        flex
                                        items-center
                                        justify-center
                                        mb-4
                                        sm:mb-5
                                    "
                                >
                                    <svg
                                        className="
                                            w-8
                                            h-8
                                            sm:w-10
                                            sm:h-10
                                            text-[#1E3A5F]
                                        "
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

                                {/* TITLE */}

                                <p
                                    className="
                                        text-slate-700
                                        text-base
                                        sm:text-lg
                                        font-semibold
                                    "
                                >
                                    No related products
                                    found.
                                </p>

                                {/* DESCRIPTION */}

                                <p
                                    className="
                                        text-slate-500
                                        text-xs
                                        sm:text-sm
                                        mt-2
                                    "
                                >
                                    More matching
                                    collections will
                                    appear here soon.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default RelatedProducts;