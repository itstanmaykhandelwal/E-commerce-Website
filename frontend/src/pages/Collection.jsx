import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { assets } from '../assets/assets';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Collection = () => {

    const { products, search, showSearch } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState('relavent')

    // pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;


    const toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            setCategory((prev) =>
                prev.filter((item) => item !== e.target.value)
            );
        } else {
            setCategory((prev) => [...prev, e.target.value]);
        }
    }
    const toggleSubCategory = (e) => {

        if (subCategory.includes(e.target.value)) {
            setSubCategory(prev => prev.filter(item => item !== e.target.value))
        }
        else {
            setSubCategory(prev => [...prev, e.target.value])
        }
    }
    const applyFilter = () => {

        let productsCopy = products.slice();

        if (showSearch && search) {
            productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
        }

        if (category.length > 0) {
            productsCopy = productsCopy.filter(item => category.includes(item.category));
        }

        if (subCategory.length > 0) {
            productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
        }

        setFilterProducts(productsCopy)

    }

    const sortProduct = () => {

        let fpCopy = filterProducts.slice();

        switch (sortType) {
            case 'low-high':
                setFilterProducts(fpCopy.sort((a, b) => (a.price - b.price)));
                break;

            case 'high-low':
                setFilterProducts(fpCopy.sort((a, b) => (b.price - a.price)));
                break;

            default:
                applyFilter();
                break;
        }

    }
    useEffect(() => {
        applyFilter();
    }, [category, subCategory, search, showSearch, products])

    useEffect(() => {
        sortProduct();
    }, [sortType])
    useEffect(() => {
        setFilterProducts(products)
        setLoading(false);
    }, [products])

    const renderSkeleton = () => {
        return Array(8).fill(0).map((_, index) => (
            <div key={index} className="border rounded p-3">
                <Skeleton height={160} className="mb-3" />
                <Skeleton width={`80%`} height={20} className="mb-1" />
                <Skeleton width={`50%`} height={20} />
            </div>
        ))
    }


    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filterProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filterProducts.length / productsPerPage);
    return (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-1">
            {/* Filter Option */}
            <div className="min-w-60">
                <p
                    onClick={() => setShowFilter(!showFilter)}
                    className="my-2 text-xl flex items-center cursor-pointer gap-2"
                >
                    FILTERS
                    <img
                        className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""
                            }`}
                        src={assets.dropdown_icon}
                        alt="dropdown-icon"
                    />
                </p>
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "block" : "hidden"} sm:block`}>

                    <p className="mb-3 text-sm font-medium">CATEGORIES</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        <p className="flex gap-2">
                            <input
                                className="w-3"
                                type="checkbox"
                                onChange={toggleCategory}
                                value={"Men"}
                            />{" "}
                            Men
                        </p>
                        <p className="flex gap-2">
                            <input
                                className="w-3"
                                type="checkbox"
                                onChange={toggleCategory}
                                value={"Women"}
                            />{" "}
                            Women
                        </p>
                        <p className="flex gap-2">
                            <input
                                className="w-3"
                                type="checkbox"
                                onChange={toggleCategory}
                                value={"Kids"}
                            />{" "}
                            Kids
                        </p>
                    </div>
                </div>
                {/* SubCategory Filter */}
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "block" : "hidden"} sm:block`}>

                    <p className="mb-3 text-sm font-medium">TYPE</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        <p className="flex gap-2">
                            <input
                                className="w-3"
                                type="checkbox"
                                value={"Topwear"}
                                onChange={toggleSubCategory}
                            />{" "}
                            Topwear
                        </p>
                        <p className="flex gap-2">
                            <input
                                className="w-3"
                                type="checkbox"
                                value={"Bottomwear"}
                                onChange={toggleSubCategory}
                            />{" "}
                            Bottomwear
                        </p>
                        <p className="flex gap-2">
                            <input
                                className="w-3"
                                type="checkbox"
                                value={"Winterwear"}
                                onChange={toggleSubCategory}
                            />{" "}
                            Winterwear
                        </p>
                    </div>
                </div>
            </div>
            {/* Right Side */}
            <div className="flex-1">
                <div className="flex justify-between text-base sm:text-2xl mb-4">
                    <Title text1={"ALL"} text2={"COLLECTIONS"} />
                    {/* Product Sort */}
                    <select
                        onChange={(e) => setSortType(e.target.value)}
                        className="border-2 border-gray-300 text-sm px-2"
                    >
                        <option value="relavant">Sort by: Relavent</option>
                        <option value="low-high">Sort by: Low to High</option>
                        <option value="high-low">Sort by: High to Low</option>
                    </select>
                </div>
                {/* Map Products */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
                    {loading ? renderSkeleton() : currentProducts.map((item, index) => (
                        <ProductItem
                            key={index}
                            name={item.name}
                            id={item._id}
                            price={item.price}
                            image={item.image}
                        />
                    ))}
                </div>
                {totalPages > 1 && (
                    <div className="flex justify-center mt-8 gap-2 flex-wrap">
                        {(() => {
                            const pages = [];
                            const maxVisible = 5; // current ke around max 5 dikhayenge
                            const addPage = (page) => {
                                pages.push(
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-1 border rounded ${currentPage === page
                                                ? "bg-black text-white"
                                                : "bg-white text-black"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            };

                            // Always show first page
                            addPage(1);

                            if (currentPage > 3) {
                                pages.push(<span key="start-ellipsis">...</span>);
                            }

                            // Middle pages
                            let start = Math.max(2, currentPage - 1);
                            let end = Math.min(totalPages - 1, currentPage + 1);

                            for (let i = start; i <= end; i++) {
                                addPage(i);
                            }

                            if (currentPage < totalPages - 2) {
                                pages.push(<span key="end-ellipsis">...</span>);
                            }

                            // Always show last page (if more than 1)
                            if (totalPages > 1) {
                                addPage(totalPages);
                            }

                            return pages;
                        })()}
                    </div>
                )}

            </div>
        </div>
    );
}

export default Collection