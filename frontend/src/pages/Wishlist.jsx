import React, { useMemo } from "react";

import ProductItem from "../components/ProductItem";

import Title from "../components/Title";

import { FiHeart } from "react-icons/fi";

// CUSTOM HOOKS
import useWishlist from "../hooks/useWishlist";

import useProducts from "../hooks/useProducts";

const Wishlist = () => {
    // WISHLIST
    const { wishlist } = useWishlist();

    // PRODUCTS
    const { products, loading } = useProducts();

    // FILTER PRODUCTS
    const wishlistProducts = useMemo(() => {
        if (!wishlist?.length || !products?.length) {
            return [];
        }

        return products.filter((product) =>
            wishlist.some((wish) => wish._id === product._id),
        );
    }, [wishlist, products]);

    return (
        <div className="min-h-screen bg-white pt-[140px] px-4 pb-10 relative overflow-hidden">
            {/* BACKGROUND BLOBS */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-sky-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

            <div className="absolute bottom-0 right-0 w-72 h-72 bg-slate-200 rounded-full blur-3xl opacity-40 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto">
                {/* TITLE */}
                <div className="text-center mb-12">
                    <Title text1={"YOUR"} text2={"WISHLIST"} />

                    <p className="text-slate-500 mt-4 max-w-2xl mx-auto leading-relaxed">
                        Save your favorite products and shop them later anytime.
                    </p>
                </div>

                {/* LOADING */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="animate-pulse">
                                <div className="aspect-square rounded-3xl bg-gray-200 mb-4"></div>

                                <div className="h-4 bg-gray-200 rounded-full mb-2"></div>

                                <div className="h-4 w-2/3 bg-gray-200 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                ) : wishlistProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 gap-y-8">
                        {wishlistProducts.map((item) => (
                            <ProductItem
                                key={item._id}
                                id={item._id}
                                name={item.name}
                                price={item.price}
                                image={item.image}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-gradient-to-br from-sky-50 to-slate-100 border border-gray-200 rounded-3xl shadow-sm">
                        {/* ICON */}
                        <div className="w-24 h-24 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-6 shadow-sm">
                            <FiHeart className="text-[#1E3A5F] text-4xl" />
                        </div>

                        {/* TITLE */}
                        <h2 className="text-3xl font-bold text-slate-800 mb-3">
                            Your wishlist is empty
                        </h2>

                        {/* DESC */}
                        <p className="text-slate-500 max-w-md leading-relaxed">
                            Start adding products you love to your wishlist and
                            access them quickly later.
                        </p>

                        {/* SMALL BADGE */}
                        <div className="mt-6 px-5 py-2 bg-white border border-gray-200 rounded-full text-sm text-[#1E3A5F] font-medium shadow-sm">
                            ❤ Save products for later
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
