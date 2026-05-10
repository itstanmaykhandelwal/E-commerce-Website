import React, { useMemo, useState } from "react";

import useSearch from "../hooks/useSearch";

import useProducts from "../hooks/useProducts";

import Title from "../components/Title";

import ProductItem from "../components/ProductItem";

import Skeleton from "react-loading-skeleton";

import "react-loading-skeleton/dist/skeleton.css";

import {
    FiFilter,
    FiChevronDown,
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";

const Collection = () => {
    // PRODUCTS
    const { products, loading } = useProducts();

    // SEARCH
    const { search, showSearch } = useSearch();

    // FILTER STATES
    const [showFilter, setShowFilter] = useState(false);

    const [category, setCategory] = useState([]);

    const [subCategory, setSubCategory] = useState([]);

    const [sortType, setSortType] = useState("relavent");

    // PAGINATION
    const [currentPage, setCurrentPage] = useState(1);

    const productsPerPage = 12;

    // CATEGORY TOGGLE
    const toggleCategory = (e) => {
        const value = e.target.value;

        setCategory((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value],
        );

        setCurrentPage(1);
    };

    // SUBCATEGORY TOGGLE
    const toggleSubCategory = (e) => {
        const value = e.target.value;

        setSubCategory((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value],
        );

        setCurrentPage(1);
    };

    // FILTER + SORT PRODUCTS
    const filteredProducts = useMemo(() => {
        let copy = [...products];

        // SEARCH
        if (showSearch && search) {
            copy = copy.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase()),
            );
        }

        // CATEGORY
        if (category.length > 0) {
            copy = copy.filter((item) => category.includes(item.category));
        }

        // SUBCATEGORY
        if (subCategory.length > 0) {
            copy = copy.filter((item) =>
                subCategory.includes(item.subCategory),
            );
        }

        // SORTING
        if (sortType === "low-high") {
            copy.sort((a, b) => a.price - b.price);
        }

        if (sortType === "high-low") {
            copy.sort((a, b) => b.price - a.price);
        }

        return copy;
    }, [products, search, showSearch, category, subCategory, sortType]);

    // PAGINATION
    const indexOfLast = currentPage * productsPerPage;

    const indexOfFirst = indexOfLast - productsPerPage;

    const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    return (
        <div className="min-h-screen py-12 pt-[150px] px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
            {/* BACKGROUND BLOBS */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-sky-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

            <div className="absolute bottom-0 right-0 w-72 h-72 bg-slate-200 rounded-full blur-3xl opacity-40 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* FILTER SIDEBAR */}
                    <div className="lg:w-64">
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className="lg:hidden w-full flex justify-between items-center p-4 bg-white border border-gray-200 rounded-2xl shadow-sm mb-4"
                        >
                            <span className="flex items-center gap-2 font-semibold text-slate-800">
                                <FiFilter />
                                FILTERS
                            </span>

                            <FiChevronDown
                                className={`${
                                    showFilter ? "rotate-180" : ""
                                } transition`}
                            />
                        </button>

                        <div
                            className={`${
                                showFilter ? "block" : "hidden"
                            } lg:block space-y-4`}
                        >
                            {/* CATEGORY */}
                            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                                <h3 className="font-bold mb-4 flex items-center gap-2 text-[#1E3A5F]">
                                    <span className="w-2 h-2 bg-black rounded-full" />
                                    CATEGORIES
                                </h3>

                                {["Men", "Women", "Kids"].map((cat) => (
                                    <label
                                        key={cat}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition"
                                    >
                                        <input
                                            type="checkbox"
                                            value={cat}
                                            onChange={toggleCategory}
                                            className="accent-black"
                                        />

                                        <span className="text-slate-700">
                                            {cat}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            {/* TYPE */}
                            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                                <h3 className="font-bold mb-4 flex items-center gap-2 text-[#1E3A5F]">
                                    <span className="w-2 h-2 bg-[#0F766E] rounded-full" />
                                    TYPE
                                </h3>

                                {["Topwear", "Bottomwear", "Winterwear"].map(
                                    (type) => (
                                        <label
                                            key={type}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition"
                                        >
                                            <input
                                                type="checkbox"
                                                value={type}
                                                onChange={toggleSubCategory}
                                                className="accent-black"
                                            />

                                            <span className="text-slate-700">
                                                {type}
                                            </span>
                                        </label>
                                    ),
                                )}
                            </div>

                            {/* ACTIVE FILTERS */}
                            {(category.length > 0 ||
                                subCategory.length > 0) && (
                                <div className="bg-gradient-to-br from-sky-50 to-slate-100 border border-gray-200 rounded-3xl p-5 shadow-sm">
                                    <p className="text-sm font-semibold mb-3 text-[#1E3A5F]">
                                        Active Filters
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {[...category, ...subCategory].map(
                                            (item, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs shadow-sm text-slate-700"
                                                >
                                                    {item}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="flex-1">
                        {/* TOP */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
                            <div>
                                <Title text1="ALL" text2="COLLECTIONS" />

                                <p className="text-slate-600 mt-2">
                                    Showing {currentProducts.length} of{" "}
                                    {filteredProducts.length} products
                                </p>
                            </div>

                            {/* SORT */}
                            <div className="relative">
                                <select
                                    onChange={(e) =>
                                        setSortType(e.target.value)
                                    }
                                    className="appearance-none px-6 py-3 pr-10 bg-white border border-gray-300 rounded-2xl hover:border-black focus:ring-2 focus:ring-black outline-none transition"
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

                                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>

                        {/* PRODUCT GRID */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
                            {loading
                                ? Array(12)
                                      .fill(0)
                                      .map((_, index) => (
                                          <Skeleton
                                              key={index}
                                              height={320}
                                              borderRadius={24}
                                          />
                                      ))
                                : currentProducts.map((item) => (
                                      <ProductItem
                                          key={item._id}
                                          id={item._id}
                                          name={item.name}
                                          price={item.price}
                                          image={item.image}
                                      />
                                  ))}
                        </div>

                        {/* PAGINATION */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2">
                                {/* PREV */}
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(1, prev - 1),
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="p-3 bg-white border border-gray-300 rounded-2xl hover:border-black hover:bg-black hover:text-white transition disabled:opacity-40"
                                >
                                    <FiChevronLeft />
                                </button>

                                {/* PAGE BUTTONS */}
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setCurrentPage(index + 1)
                                        }
                                        className={`w-10 h-10 rounded-2xl font-semibold transition-all duration-300 ${
                                            currentPage === index + 1
                                                ? "bg-black text-white shadow-md"
                                                : "bg-white border border-gray-300 hover:border-black"
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                {/* NEXT */}
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(totalPages, prev + 1),
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className="p-3 bg-white border border-gray-300 rounded-2xl hover:border-black hover:bg-black hover:text-white transition disabled:opacity-40"
                                >
                                    <FiChevronRight />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Collection;
