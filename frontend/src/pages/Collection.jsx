// import React, { useContext, useEffect, useState } from 'react'
// import { ShopContext } from '../context/ShopContext'
// import Title from '../components/Title';
// import ProductItem from '../components/ProductItem';
// import { assets } from '../assets/assets';
// import Skeleton from 'react-loading-skeleton';
// import 'react-loading-skeleton/dist/skeleton.css';

// const Collection = () => {

//     const { products, search, showSearch } = useContext(ShopContext);
//     const [showFilter, setShowFilter] = useState(false);
//     const [filterProducts, setFilterProducts] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const [category, setCategory] = useState([]);
//     const [subCategory, setSubCategory] = useState([]);
//     const [sortType, setSortType] = useState('relavent')

//     // pagination states
//     const [currentPage, setCurrentPage] = useState(1);
//     const productsPerPage = 9;

//     const toggleCategory = (e) => {
//         if (category.includes(e.target.value)) {
//             setCategory((prev) =>
//                 prev.filter((item) => item !== e.target.value)
//             );
//         } else {
//             setCategory((prev) => [...prev, e.target.value]);
//         }
//     }
//     const toggleSubCategory = (e) => {

//         if (subCategory.includes(e.target.value)) {
//             setSubCategory(prev => prev.filter(item => item !== e.target.value))
//         }
//         else {
//             setSubCategory(prev => [...prev, e.target.value])
//         }
//     }
//     const applyFilter = () => {

//         let productsCopy = products.slice();

//         if (showSearch && search) {
//             productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
//         }

//         if (category.length > 0) {
//             productsCopy = productsCopy.filter(item => category.includes(item.category));
//         }

//         if (subCategory.length > 0) {
//             productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
//         }

//         setFilterProducts(productsCopy)

//     }

//     const sortProduct = () => {

//         let fpCopy = filterProducts.slice();

//         switch (sortType) {
//             case 'low-high':
//                 setFilterProducts(fpCopy.sort((a, b) => (a.price - b.price)));
//                 break;

//             case 'high-low':
//                 setFilterProducts(fpCopy.sort((a, b) => (b.price - a.price)));
//                 break;

//             default:
//                 applyFilter();
//                 break;
//         }

//     }
//     useEffect(() => {
//         applyFilter();
//     }, [category, subCategory, search, showSearch, products])

//     useEffect(() => {
//         sortProduct();
//     }, [sortType])
//     useEffect(() => {
//         setFilterProducts(products)
//         setLoading(false);
//     }, [products])

//     const renderSkeleton = () => {
//         return Array(8).fill(0).map((_, index) => (
//             <div key={index} className="border rounded p-3">
//                 <Skeleton height={160} className="mb-3" />
//                 <Skeleton width={`80%`} height={20} className="mb-1" />
//                 <Skeleton width={`50%`} height={20} />
//             </div>
//         ))
//     }

//     const indexOfLastProduct = currentPage * productsPerPage;
//     const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//     const currentProducts = filterProducts.slice(indexOfFirstProduct, indexOfLastProduct);
//     const totalPages = Math.ceil(filterProducts.length / productsPerPage);
//     return (
//         <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-1">
//             {/* Filter Option */}
//             <div className="min-w-60">
//                 <p
//                     onClick={() => setShowFilter(!showFilter)}
//                     className="my-2 text-xl flex items-center cursor-pointer gap-2"
//                 >
//                     FILTERS
//                     <img
//                         className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""
//                             }`}
//                         src={assets.dropdown_icon}
//                         alt="dropdown-icon"
//                     />
//                 </p>
//                 <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "block" : "hidden"} sm:block`}>

//                     <p className="mb-3 text-sm font-medium">CATEGORIES</p>
//                     <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
//                         <p className="flex gap-2">
//                             <input
//                                 className="w-3"
//                                 type="checkbox"
//                                 onChange={toggleCategory}
//                                 value={"Men"}
//                             />{" "}
//                             Men
//                         </p>
//                         <p className="flex gap-2">
//                             <input
//                                 className="w-3"
//                                 type="checkbox"
//                                 onChange={toggleCategory}
//                                 value={"Women"}
//                             />{" "}
//                             Women
//                         </p>
//                         <p className="flex gap-2">
//                             <input
//                                 className="w-3"
//                                 type="checkbox"
//                                 onChange={toggleCategory}
//                                 value={"Kids"}
//                             />{" "}
//                             Kids
//                         </p>
//                     </div>
//                 </div>
//                 {/* SubCategory Filter */}
//                 <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "block" : "hidden"} sm:block`}>

//                     <p className="mb-3 text-sm font-medium">TYPE</p>
//                     <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
//                         <p className="flex gap-2">
//                             <input
//                                 className="w-3"
//                                 type="checkbox"
//                                 value={"Topwear"}
//                                 onChange={toggleSubCategory}
//                             />{" "}
//                             Topwear
//                         </p>
//                         <p className="flex gap-2">
//                             <input
//                                 className="w-3"
//                                 type="checkbox"
//                                 value={"Bottomwear"}
//                                 onChange={toggleSubCategory}
//                             />{" "}
//                             Bottomwear
//                         </p>
//                         <p className="flex gap-2">
//                             <input
//                                 className="w-3"
//                                 type="checkbox"
//                                 value={"Winterwear"}
//                                 onChange={toggleSubCategory}
//                             />{" "}
//                             Winterwear
//                         </p>
//                     </div>
//                 </div>
//             </div>
//             {/* Right Side */}
//             <div className="flex-1">
//                 <div className="flex justify-between text-base sm:text-2xl mb-4">
//                     <Title text1={"ALL"} text2={"COLLECTIONS"} />
//                     {/* Product Sort */}
//                     <select
//                         onChange={(e) => setSortType(e.target.value)}
//                         className="border-2 border-gray-300 text-sm px-2"
//                     >
//                         <option value="relavant">Sort by: Relavent</option>
//                         <option value="low-high">Sort by: Low to High</option>
//                         <option value="high-low">Sort by: High to Low</option>
//                     </select>
//                 </div>
//                 {/* Map Products */}
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
//                     {loading ? renderSkeleton() : currentProducts.map((item, index) => (
//                         <ProductItem
//                             key={index}
//                             name={item.name}
//                             id={item._id}
//                             price={item.price}
//                             image={item.image}
//                         />
//                     ))}
//                 </div>
//                 {totalPages > 1 && (
//                     <div className="flex justify-center mt-8 gap-2 flex-wrap">
//                         {(() => {
//                             const pages = [];
//                             const maxVisible = 5; // current ke around max 5 dikhayenge
//                             const addPage = (page) => {
//                                 pages.push(
//                                     <button
//                                         key={page}
//                                         onClick={() => setCurrentPage(page)}
//                                         className={`px-3 py-1 border rounded ${currentPage === page
//                                                 ? "bg-black text-white"
//                                                 : "bg-white text-black"
//                                             }`}
//                                     >
//                                         {page}
//                                     </button>
//                                 );
//                             };

//                             // Always show first page
//                             addPage(1);

//                             if (currentPage > 3) {
//                                 pages.push(<span key="start-ellipsis">...</span>);
//                             }

//                             // Middle pages
//                             let start = Math.max(2, currentPage - 1);
//                             let end = Math.min(totalPages - 1, currentPage + 1);

//                             for (let i = start; i <= end; i++) {
//                                 addPage(i);
//                             }

//                             if (currentPage < totalPages - 2) {
//                                 pages.push(<span key="end-ellipsis">...</span>);
//                             }

//                             // Always show last page (if more than 1)
//                             if (totalPages > 1) {
//                                 addPage(totalPages);
//                             }

//                             return pages;
//                         })()}
//                     </div>
//                 )}

//             </div>
//         </div>
//     );
// }

// export default Collection

import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
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
    const { products, search, showSearch } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState("relavent");

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    const toggleCategory = (e) => {
        category.includes(e.target.value)
            ? setCategory((prev) => prev.filter((i) => i !== e.target.value))
            : setCategory((prev) => [...prev, e.target.value]);
    };

    const toggleSubCategory = (e) => {
        subCategory.includes(e.target.value)
            ? setSubCategory((prev) => prev.filter((i) => i !== e.target.value))
            : setSubCategory((prev) => [...prev, e.target.value]);
    };

    const applyFilter = () => {
        let copy = [...products];

        if (showSearch && search) {
            copy = copy.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase()),
            );
        }

        if (category.length) {
            copy = copy.filter((item) => category.includes(item.category));
        }

        if (subCategory.length) {
            copy = copy.filter((item) =>
                subCategory.includes(item.subCategory),
            );
        }

        setFilterProducts(copy);
    };

    const sortProduct = () => {
        let copy = [...filterProducts];
        if (sortType === "low-high") copy.sort((a, b) => a.price - b.price);
        if (sortType === "high-low") copy.sort((a, b) => b.price - a.price);
        setFilterProducts(copy);
    };

    useEffect(
        () => applyFilter(),
        [category, subCategory, search, showSearch, products],
    );
    useEffect(() => sortProduct(), [sortType]);
    useEffect(() => {
        setFilterProducts(products);
        setLoading(false);
    }, [products]);

    const indexOfLast = currentPage * productsPerPage;
    const indexOfFirst = indexOfLast - productsPerPage;
    const currentProducts = filterProducts.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filterProducts.length / productsPerPage);

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* FILTER SIDEBAR */}
                    <div className="lg:w-64">
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className="lg:hidden w-full flex justify-between items-center p-4 bg-white rounded-2xl shadow-sm mb-4"
                        >
                            <span className="flex items-center gap-2 font-semibold">
                                <FiFilter /> FILTERS
                            </span>
                            <FiChevronDown
                                className={`${showFilter ? "rotate-180" : ""} transition`}
                            />
                        </button>

                        <div
                            className={`${showFilter ? "block" : "hidden"} lg:block space-y-4`}
                        >
                            {/* Categories */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-emerald-600 rounded-full" />
                                    CATEGORIES
                                </h3>
                                {["Men", "Women", "Kids"].map((cat) => (
                                    <label
                                        key={cat}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            value={cat}
                                            onChange={toggleCategory}
                                            className="text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <span>{cat}</span>
                                    </label>
                                ))}
                            </div>

                            {/* Types */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-teal-600 rounded-full" />
                                    TYPE
                                </h3>
                                {["Topwear", "Bottomwear", "Winterwear"].map(
                                    (type) => (
                                        <label
                                            key={type}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                value={type}
                                                onChange={toggleSubCategory}
                                                className="text-teal-600 focus:ring-teal-500"
                                            />
                                            <span>{type}</span>
                                        </label>
                                    ),
                                )}
                            </div>

                            {(category.length || subCategory.length) > 0 && (
                                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4">
                                    <p className="text-sm font-semibold mb-2">
                                        Active Filters
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {[...category, ...subCategory].map(
                                            (f, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 bg-white rounded-full text-xs shadow"
                                                >
                                                    {f}
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
                        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
                            <div>
                                <Title text1="ALL" text2="COLLECTIONS" />
                                <p className="text-slate-600 mt-2">
                                    Showing {currentProducts.length} of{" "}
                                    {filterProducts.length} products
                                </p>
                            </div>

                            <div className="relative">
                                <select
                                    onChange={(e) =>
                                        setSortType(e.target.value)
                                    }
                                    className="appearance-none px-6 py-3 pr-10 bg-white border-2 rounded-xl hover:border-emerald-500 focus:ring-emerald-500"
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

                        {/* GRID */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
                            {loading
                                ? Array(12)
                                      .fill(0)
                                      .map((_, i) => (
                                          <Skeleton key={i} height={320} />
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
                                <button
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.max(1, p - 1),
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="p-2 bg-white border rounded-xl hover:border-emerald-500"
                                >
                                    <FiChevronLeft />
                                </button>

                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-10 h-10 rounded-xl font-semibold ${
                                            currentPage === i + 1
                                                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                                                : "bg-white border hover:border-emerald-500"
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.min(totalPages, p + 1),
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className="p-2 bg-white border rounded-xl hover:border-emerald-500"
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
