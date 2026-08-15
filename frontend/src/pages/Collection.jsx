import React, { useEffect, useMemo, useState } from "react";

import useSearch from "../hooks/useSearch";
import useProducts from "../hooks/useProducts";

import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
    FiFilter,
    FiChevronDown,
    FiX,
} from "react-icons/fi";

const Collection = () => {
    // =========================
    // PRODUCTS
    // =========================

    const { products, loading } = useProducts();

    // =========================
    // SEARCH
    // =========================

    const { search, showSearch } = useSearch();

    // =========================
    // FILTER STATES
    // =========================

    const [showFilter, setShowFilter] = useState(false);

    const [category, setCategory] = useState([]);

    const [subCategory, setSubCategory] = useState([]);

    const [sortType, setSortType] = useState("relavent");

    // =========================
    // LOAD MORE
    // =========================

    const [visibleCount, setVisibleCount] = useState(12);

    // =========================
    // CATEGORY TOGGLE
    // =========================

    const toggleCategory = (e) => {
        const value = e.target.value;

        setCategory((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    // =========================
    // SUBCATEGORY TOGGLE
    // =========================

    const toggleSubCategory = (e) => {
        const value = e.target.value;

        setSubCategory((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    // =========================
    // FILTER + SORT
    // =========================

    const filteredProducts = useMemo(() => {
        let copy = [...(products || [])];

        // SEARCH
        if (showSearch && search?.trim()) {
            const searchText = search.toLowerCase().trim();

            copy = copy.filter((item) =>
                item.name?.toLowerCase().includes(searchText)
            );
        }

        // CATEGORY
        if (category.length > 0) {
            copy = copy.filter((item) =>
                category.includes(item.category)
            );
        }

        // SUB CATEGORY
        if (subCategory.length > 0) {
            copy = copy.filter((item) =>
                subCategory.includes(item.subCategory)
            );
        }

        // SORT
        if (sortType === "low-high") {
            copy.sort(
                (a, b) =>
                    Number(a.price) - Number(b.price)
            );
        }

        if (sortType === "high-low") {
            copy.sort(
                (a, b) =>
                    Number(b.price) - Number(a.price)
            );
        }

        return copy;
    }, [
        products,
        search,
        showSearch,
        category,
        subCategory,
        sortType,
    ]);

    // =========================
    // VISIBLE PRODUCTS
    // =========================

    const visibleProducts = filteredProducts.slice(
        0,
        visibleCount
    );

    const hasMoreProducts =
        visibleCount < filteredProducts.length;

    // =========================
    // RESET LOAD MORE
    // =========================

    useEffect(() => {
        setVisibleCount(12);
    }, [
        search,
        showSearch,
        category,
        subCategory,
        sortType,
    ]);

    // =========================
    // LOAD MORE
    // =========================

    const handleLoadMore = () => {
        setVisibleCount(
            (prev) => prev + 12
        );
    };

    // =========================
    // CLOSE FILTER
    // =========================

    const closeFilter = () => {
        setShowFilter(false);
    };

    return (
        <div
            className="
                min-h-screen
                py-10
                pt-[110px]
                sm:pt-[130px]
                pb-20
                lg:pb-0
                px-4
                sm:px-6
                lg:px-8
                bg-white
                relative
                overflow-hidden
            "
        >
            {/* =========================
                BACKGROUND BLOBS
            ========================== */}

            <div
                className="
                    absolute
                    top-0
                    left-0
                    w-48
                    h-48
                    sm:w-72
                    sm:h-72
                    bg-sky-100
                    rounded-full
                    blur-3xl
                    opacity-40
                    pointer-events-none
                "
            />

            <div
                className="
                    absolute
                    bottom-0
                    right-0
                    w-48
                    h-48
                    sm:w-72
                    sm:h-72
                    bg-slate-200
                    rounded-full
                    blur-3xl
                    opacity-40
                    pointer-events-none
                "
            />

            <div className="relative max-w-7xl mx-auto">

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

                    {/* =====================================================
                        DESKTOP FILTER SIDEBAR
                    ====================================================== */}

                    <div className="hidden lg:block lg:w-64 flex-shrink-0">

                        <div className="space-y-4">

                            {/* CATEGORY */}

                            <div
                                className="
                                    bg-white
                                    border
                                    border-gray-200
                                    rounded-3xl
                                    p-6
                                    shadow-sm
                                "
                            >
                                <h3
                                    className="
                                        font-bold
                                        mb-4
                                        flex
                                        items-center
                                        gap-2
                                        text-[#1E3A5F]
                                    "
                                >
                                    <span className="w-2 h-2 bg-black rounded-full" />

                                    CATEGORIES
                                </h3>

                                {[
                                    "Men",
                                    "Women",
                                    "Kids",
                                ].map((cat) => (
                                    <label
                                        key={cat}
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            p-3
                                            rounded-xl
                                            hover:bg-slate-50
                                            cursor-pointer
                                            transition
                                        "
                                    >
                                        <input
                                            type="checkbox"
                                            value={cat}
                                            checked={category.includes(
                                                cat
                                            )}
                                            onChange={
                                                toggleCategory
                                            }
                                            className="accent-black"
                                        />

                                        <span className="text-slate-700">
                                            {cat}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            {/* TYPE */}

                            <div
                                className="
                                    bg-white
                                    border
                                    border-gray-200
                                    rounded-3xl
                                    p-6
                                    shadow-sm
                                "
                            >
                                <h3
                                    className="
                                        font-bold
                                        mb-4
                                        flex
                                        items-center
                                        gap-2
                                        text-[#1E3A5F]
                                    "
                                >
                                    <span className="w-2 h-2 bg-[#0F766E] rounded-full" />

                                    TYPE
                                </h3>

                                {[
                                    "Topwear",
                                    "Bottomwear",
                                    "Winterwear",
                                ].map((type) => (
                                    <label
                                        key={type}
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            p-3
                                            rounded-xl
                                            hover:bg-slate-50
                                            cursor-pointer
                                            transition
                                        "
                                    >
                                        <input
                                            type="checkbox"
                                            value={type}
                                            checked={subCategory.includes(
                                                type
                                            )}
                                            onChange={
                                                toggleSubCategory
                                            }
                                            className="accent-black"
                                        />

                                        <span className="text-slate-700">
                                            {type}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            {/* ACTIVE FILTERS */}

                            {(category.length > 0 ||
                                subCategory.length > 0) && (
                                <div
                                    className="
                                        bg-gradient-to-br
                                        from-sky-50
                                        to-slate-100
                                        border
                                        border-gray-200
                                        rounded-3xl
                                        p-5
                                        shadow-sm
                                    "
                                >
                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            mb-3
                                            text-[#1E3A5F]
                                        "
                                    >
                                        Active Filters
                                    </p>

                                    <div className="flex flex-wrap gap-2">

                                        {[
                                            ...category,
                                            ...subCategory,
                                        ].map(
                                            (
                                                item,
                                                index
                                            ) => (
                                                <span
                                                    key={
                                                        index
                                                    }
                                                    className="
                                                        px-3
                                                        py-1
                                                        bg-white
                                                        border
                                                        border-gray-200
                                                        rounded-full
                                                        text-xs
                                                        shadow-sm
                                                        text-slate-700
                                                    "
                                                >
                                                    {item}
                                                </span>
                                            )
                                        )}

                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* =====================================================
                        MAIN CONTENT
                    ====================================================== */}

                    <div className="flex-1 min-w-0">

                        {/* =========================
                            TOP HEADER
                        ========================== */}

                        <div
                            className="
                                flex
                                flex-col
                                sm:flex-row
                                sm:items-end
                                justify-between
                                gap-4
                                mb-6
                                sm:mb-8
                            "
                        >

                            <div>

                                <Title
                                    text1="ALL"
                                    text2="COLLECTIONS"
                                />

                                <p
                                    className="
                                        text-slate-600
                                        mt-2
                                        text-xs
                                        sm:text-sm
                                    "
                                >
                                    Showing{" "}
                                    {
                                        visibleProducts.length
                                    }{" "}
                                    of{" "}
                                    {
                                        filteredProducts.length
                                    }{" "}
                                    products
                                </p>

                            </div>

                            {/* SORT */}

                            <div className="relative w-full sm:w-auto">

                                <select
                                    value={sortType}
                                    onChange={(e) =>
                                        setSortType(
                                            e.target.value
                                        )
                                    }
                                    className="
                                        appearance-none
                                        w-full
                                        sm:w-auto
                                        px-4
                                        sm:px-6
                                        py-3
                                        pr-10
                                        bg-white
                                        border
                                        border-gray-300
                                        rounded-xl
                                        sm:rounded-2xl
                                        hover:border-black
                                        focus:ring-2
                                        focus:ring-black
                                        outline-none
                                        transition
                                        text-sm
                                        cursor-pointer
                                    "
                                >
                                    <option value="relavent">
                                        Sort by: Relevant
                                    </option>

                                    <option value="low-high">
                                        Price: Low to High
                                    </option>

                                    <option value="high-low">
                                        Price: High to Low
                                    </option>
                                </select>

                                <FiChevronDown
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-400
                                        pointer-events-none
                                    "
                                />

                            </div>

                        </div>

                        {/* =====================================================
                            PRODUCT GRID
                        ====================================================== */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                md:grid-cols-3
                                lg:grid-cols-4
                                gap-5
                                sm:gap-5
                                lg:gap-6
                                mb-10
                            "
                        >

                            {loading ? (
                                Array(8)
                                    .fill(0)
                                    .map(
                                        (
                                            _,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    index
                                                }
                                            >
                                                <Skeleton
                                                    height={
                                                        300
                                                    }
                                                    borderRadius={
                                                        20
                                                    }
                                                />
                                            </div>
                                        )
                                    )
                            ) : visibleProducts.length >
                              0 ? (
                                visibleProducts.map(
                                    (item) => (
                                        <ProductItem
                                            key={
                                                item._id
                                            }
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
                                    )
                                )
                            ) : (
                                <div
                                    className="
                                        col-span-full
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                        py-16
                                        sm:py-20
                                    "
                                >
                                    <div
                                        className="
                                            bg-slate-100
                                            p-6
                                            rounded-full
                                            mb-5
                                        "
                                    >
                                        <FiFilter
                                            className="
                                                w-10
                                                h-10
                                                text-[#1E3A5F]
                                            "
                                        />
                                    </div>

                                    <h3
                                        className="
                                            text-xl
                                            sm:text-2xl
                                            font-bold
                                            text-slate-800
                                            mb-2
                                        "
                                    >
                                        No Products Found
                                    </h3>

                                    <p
                                        className="
                                            text-sm
                                            text-slate-600
                                            text-center
                                            max-w-md
                                            px-4
                                        "
                                    >
                                        Try changing your
                                        search, category or
                                        filters.
                                    </p>
                                </div>
                            )}

                        </div>

                        {/* =====================================================
                            LOAD MORE
                        ====================================================== */}

                        {!loading &&
                            hasMoreProducts && (
                                <div className="flex justify-center pb-8">

                                    <button
                                        onClick={
                                            handleLoadMore
                                        }
                                        className="
                                            px-7
                                            sm:px-9
                                            py-3
                                            sm:py-4
                                            bg-black
                                            text-white
                                            rounded-full
                                            font-semibold
                                            text-sm
                                            sm:text-base
                                            hover:bg-neutral-800
                                            hover:scale-105
                                            transition-all
                                            duration-300
                                            shadow-md
                                        "
                                    >
                                        Load More
                                    </button>

                                </div>
                            )}

                        {/* END MESSAGE */}

                        {!loading &&
                            filteredProducts.length >
                                0 &&
                            !hasMoreProducts &&
                            visibleProducts.length >
                                12 && (
                                <p
                                    className="
                                        text-center
                                        text-sm
                                        text-slate-400
                                        pb-8
                                    "
                                >
                                    You've reached the end
                                    of the collection.
                                </p>
                            )}

                    </div>
                </div>
            </div>

            {/* =====================================================
                MOBILE FILTER OVERLAY
            ====================================================== */}

            <div
                onClick={closeFilter}
                className={`
                    fixed
                    inset-0
                    z-[70]
                    bg-black/40
                    lg:hidden
                    transition-opacity
                    duration-300
                    ${
                        showFilter
                            ? "opacity-100 visible"
                            : "opacity-0 invisible pointer-events-none"
                    }
                `}
            />

            {/* =====================================================
                MOBILE FILTER BOTTOM SHEET
            ====================================================== */}

            <div
                className={`
                    fixed
                    left-0
                    right-0
                    bottom-0
                    z-[80]
                    bg-white
                    rounded-t-3xl
                    shadow-[0_-10px_40px_rgba(0,0,0,0.15)]
                    lg:hidden
                    transition-transform
                    duration-300
                    ease-out
                    max-h-[78vh]
                    overflow-y-auto
                    ${
                        showFilter
                            ? "translate-y-0"
                            : "translate-y-full"
                    }
                `}
            >

                {/* SHEET HEADER */}

                <div
                    className="
                        sticky
                        top-0
                        z-10
                        bg-white
                        flex
                        items-center
                        justify-between
                        px-5
                        py-4
                        border-b
                        border-gray-200
                    "
                >
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">
                            Filters
                        </h3>

                        <p className="text-xs text-slate-500 mt-0.5">
                            Choose your preferences
                        </p>
                    </div>

                    <button
                        onClick={closeFilter}
                        className="
                            p-2
                            rounded-full
                            bg-gray-100
                            hover:bg-gray-200
                            transition
                        "
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* SHEET CONTENT */}

                <div className="p-5 space-y-5">

                    {/* CATEGORY */}

                    <div>

                        <h4
                            className="
                                font-bold
                                mb-3
                                text-[#1E3A5F]
                                text-sm
                            "
                        >
                            CATEGORIES
                        </h4>

                        <div className="flex flex-wrap gap-2">

                            {[
                                "Men",
                                "Women",
                                "Kids",
                            ].map((cat) => (
                                <label
                                    key={cat}
                                    className={`
                                        flex
                                        items-center
                                        gap-2
                                        px-4
                                        py-2.5
                                        rounded-full
                                        border
                                        cursor-pointer
                                        transition
                                        text-sm
                                        ${
                                            category.includes(
                                                cat
                                            )
                                                ? "bg-black text-white border-black"
                                                : "bg-white text-slate-700 border-gray-300"
                                        }
                                    `}
                                >
                                    <input
                                        type="checkbox"
                                        value={cat}
                                        checked={category.includes(
                                            cat
                                        )}
                                        onChange={
                                            toggleCategory
                                        }
                                        className="hidden"
                                    />

                                    {cat}
                                </label>
                            ))}

                        </div>
                    </div>

                    {/* TYPE */}

                    <div>

                        <h4
                            className="
                                font-bold
                                mb-3
                                text-[#1E3A5F]
                                text-sm
                            "
                        >
                            TYPE
                        </h4>

                        <div className="flex flex-wrap gap-2">

                            {[
                                "Topwear",
                                "Bottomwear",
                                "Winterwear",
                            ].map((type) => (
                                <label
                                    key={type}
                                    className={`
                                        flex
                                        items-center
                                        px-4
                                        py-2.5
                                        rounded-full
                                        border
                                        cursor-pointer
                                        transition
                                        text-sm
                                        ${
                                            subCategory.includes(
                                                type
                                            )
                                                ? "bg-black text-white border-black"
                                                : "bg-white text-slate-700 border-gray-300"
                                        }
                                    `}
                                >
                                    <input
                                        type="checkbox"
                                        value={type}
                                        checked={subCategory.includes(
                                            type
                                        )}
                                        onChange={
                                            toggleSubCategory
                                        }
                                        className="hidden"
                                    />

                                    {type}
                                </label>
                            ))}

                        </div>
                    </div>

                    {/* ACTIVE FILTERS */}

                    {(category.length > 0 ||
                        subCategory.length > 0) && (
                        <div
                            className="
                                bg-slate-50
                                rounded-2xl
                                p-4
                            "
                        >
                            <p className="text-xs font-semibold text-slate-500 mb-2">
                                ACTIVE FILTERS
                            </p>

                            <div className="flex flex-wrap gap-2">

                                {[
                                    ...category,
                                    ...subCategory,
                                ].map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <span
                                            key={
                                                index
                                            }
                                            className="
                                                px-3
                                                py-1.5
                                                bg-white
                                                border
                                                border-gray-200
                                                rounded-full
                                                text-xs
                                                text-slate-700
                                            "
                                        >
                                            {item}
                                        </span>
                                    )
                                )}

                            </div>
                        </div>
                    )}

                    {/* APPLY BUTTON */}

                    <button
                        onClick={closeFilter}
                        className="
                            w-full
                            py-3.5
                            bg-black
                            text-white
                            rounded-full
                            font-semibold
                            text-sm
                            hover:bg-neutral-800
                            transition
                        "
                    >
                        Apply Filters
                    </button>

                </div>
            </div>

            {/* =====================================================
                MOBILE STICKY BOTTOM BAR
            ====================================================== */}

            <div
                className="
                    fixed
                    bottom-0
                    left-0
                    right-0
                    z-[60]
                    lg:hidden
                    bg-white
                    border-t
                    border-gray-200
                    shadow-[0_-4px_20px_rgba(0,0,0,0.08)]
                "
            >
                <div className="grid grid-cols-2 h-14">

                    {/* FILTER BUTTON */}

                    <button
                        onClick={() =>
                            setShowFilter(true)
                        }
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            border-r
                            border-gray-200
                            text-sm
                            font-semibold
                            text-slate-800
                            active:bg-gray-100
                        "
                    >
                        <FiFilter className="w-4 h-4" />

                        <span>
                            Filters
                        </span>

                        {(category.length > 0 ||
                            subCategory.length >
                                0) && (
                            <span
                                className="
                                    w-5
                                    h-5
                                    bg-black
                                    text-white
                                    rounded-full
                                    text-[10px]
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                {category.length +
                                    subCategory.length}
                            </span>
                        )}
                    </button>

                    {/* SORT BUTTON */}

                    <button
                        onClick={() => {
                            const nextSort =
                                sortType ===
                                "relavent"
                                    ? "low-high"
                                    : sortType ===
                                        "low-high"
                                      ? "high-low"
                                      : "relavent";

                            setSortType(
                                nextSort
                            );
                        }}
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            text-sm
                            font-semibold
                            text-slate-800
                            active:bg-gray-100
                        "
                    >
                        <FiChevronDown className="w-4 h-4" />

                        <span>
                            {sortType ===
                            "relavent"
                                ? "Sort"
                                : sortType ===
                                    "low-high"
                                  ? "Price: Low"
                                  : "Price: High"}
                        </span>
                    </button>

                </div>
            </div>
        </div>
    );
};

export default Collection;