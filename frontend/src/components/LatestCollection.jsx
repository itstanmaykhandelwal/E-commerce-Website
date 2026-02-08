// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import Title from "./Title";
// import ProductItem from "./ProductItem";

// const LatestCollection = () => {
//     const { products } = useContext(ShopContext);
//     const [latestProducts, setLatestProducts] = useState([]);

//     useEffect(() => {
//         setLatestProducts(products.slice(0, 10));
//     }, [products]);

//     return (
//         <section className="my-16 px-4 sm:px-6 lg:px-8">
//             {/* Heading */}
//             <div className="text-center max-w-3xl mx-auto">
//                 <Title text1={"LATEST"} text2={"COLLECTIONS"} />

//                 <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-500 mx-auto mt-3 mb-5 rounded-full" />

//                 <p className="text-sm sm:text-base text-gray-600">
//                     Shop the latest collection of{" "}
//                     <span className="font-medium">Krishna Ji Poshaks</span>,
//                     Laddu Gopal dresses, and devotional attire – perfect for
//                     festivals and daily worship.
//                 </p>
//             </div>

//             {/* Products */}
//             {latestProducts.length > 0 ? (
//                 <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
//                     {latestProducts.map((item) => (
//                         <div
//                             key={item._id}
//                             className="transform transition duration-300 hover:-translate-y-2"
//                         >
//                             <ProductItem
//                                 id={item._id}
//                                 image={item.image}
//                                 name={item.name}
//                                 price={item.price}
//                             />
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 /* Empty State */
//                 <div className="flex flex-col items-center justify-center py-24 text-center">
//                     <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-100 mb-6">
//                         <img
//                             src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
//                             alt="No products"
//                             className="w-20 h-20 opacity-70"
//                         />
//                     </div>
//                     <h2 className="text-xl font-semibold text-gray-800">
//                         No products available
//                     </h2>
//                     <p className="text-sm text-gray-500 mt-2 max-w-sm">
//                         We’re preparing something special. Please check back
//                         soon for our latest collections.
//                     </p>
//                 </div>
//             )}
//         </section>
//     );
// };

// export default LatestCollection;

import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const [latestProducts, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading state
        setIsLoading(true);
        const timer = setTimeout(() => {
            setProducts(products.slice(0, 10));
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [products]);

    return (
        <div className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background Decoration */}
            {/* <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-20 animate-pulse animation-delay-2000"></div> */}

            <div className="relative max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12 space-y-4 animate-fade-in-up">
                    <Title text1="LATEST" text2="COLLECTIONS" />
                    <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed px-4">
                        Shop the latest collection of Krishna Ji Poshaks, Laddu
                        Gopal dresses, and devotional attire – perfect for
                        festivals and daily worship.
                    </p>

                    {/* Category Pills */}
                    {/* <div className="flex flex-wrap justify-center gap-3 pt-4">
                        {[
                            "All",
                            "Poshaks",
                            "Dresses",
                            "Accessories",
                            "Festival Special",
                        ].map((category, index) => (
                            <button
                                key={category}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 animate-slide-in-left ${
                                    index === 0
                                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                                        : "bg-white text-slate-700 border border-slate-200 hover:border-purple-600 hover:text-purple-600 shadow-sm"
                                }`}
                                style={{ animationDelay: `${index * 100}ms` }}
                                data-testid={`category-${category.toLowerCase().replace(" ", "-")}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div> */}
                </div>

                {/* Products Grid */}
                {isLoading ? (
                    // Loading Skeleton
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {[...Array(10)].map((_, index) => (
                            <div key={index} className="animate-pulse">
                                <div className="bg-slate-200 aspect-square rounded-2xl mb-3"></div>
                                <div className="bg-slate-200 h-4 rounded-full mb-2"></div>
                                <div className="bg-slate-200 h-4 w-2/3 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                ) : latestProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
                        {latestProducts.map((item, index) => (
                            <div
                                key={item._id}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 50}ms` }}
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
                ) : (
                    // Empty State
                    <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
                        <div className="relative mb-6">
                            {/* Decorative circles */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 bg-purple-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                            </div>
                            <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-full">
                                <svg
                                    className="w-16 h-16 text-purple-600"
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

                        <h3 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <svg
                                className="w-6 h-6 text-purple-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                />
                            </svg>
                            No Products Available
                        </h3>
                        <p className="text-slate-600 text-center max-w-md mb-6">
                            We're working on bringing you amazing new
                            collections. Check back soon for our latest
                            devotional attire!
                        </p>

                        {/* Call to Action */}
                        <div className="flex flex-wrap gap-3 justify-center">
                            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2">
                                <svg
                                    className="w-5 h-5"
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
                                Notify Me
                            </button>
                            <button className="px-6 py-3 bg-white text-slate-700 font-semibold rounded-full border-2 border-slate-200 hover:border-purple-600 hover:text-purple-600 transition-all duration-300 hover:scale-105">
                                Browse Catalog
                            </button>
                        </div>

                        {/* Decorative elements */}
                        <div className="mt-8 flex items-center gap-8 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span>New arrivals coming soon</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* View More Button */}
                {latestProducts.length > 0 && (
                    <div className="flex justify-center mt-12 animate-fade-in-up animation-delay-600">
                        <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2">
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
                )}
            </div>
        </div>
    );
};

export default LatestCollection;
