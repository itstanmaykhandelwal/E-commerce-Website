import React from "react";
import { FiShoppingBag, FiTrendingUp, FiArrowRight } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

const Hero = () => {
    return (
        <div className="relative container mx-auto pt-8 sm:pt-12 lg:pt-16 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between min-h-0 lg:min-h-[90vh] gap-10 sm:gap-12 lg:gap-16">

                {/* ================= LEFT CONTENT ================= */}
                <div className="w-full lg:w-1/2 space-y-6 sm:space-y-7 lg:space-y-8 animate-fade-in-up">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white rounded-full shadow-sm border border-gray-200">
                        <HiSparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1E3A5F]" />

                        <span className="text-[11px] sm:text-sm font-semibold text-[#1E3A5F]">
                            NEW SEASON COLLECTION
                        </span>
                    </div>

                    {/* Heading */}
                    <div>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.05] sm:leading-tight">
                            <span className="block text-slate-900">
                                Discover
                            </span>

                            <span className="block text-[#1E3A5F]">
                                Latest Trends
                            </span>
                        </h1>

                        <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-slate-600 max-w-lg leading-relaxed">
                            Elevate your style with our exclusive collection
                            of premium fashion essentials.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 sm:flex sm:gap-7 lg:gap-8">

                        {/* Products */}
                        <div>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <FiTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E3A5F]" />

                                <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                                    2000+
                                </p>
                            </div>

                            <p className="text-[11px] sm:text-sm text-slate-600">
                                Products
                            </p>
                        </div>

                        {/* Customers */}
                        <div>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <FiShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-black" />

                                <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                                    50K+
                                </p>
                            </div>

                            <p className="text-[11px] sm:text-sm text-slate-600">
                                Customers
                            </p>
                        </div>

                        {/* Rating */}
                        <div>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <HiSparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#0F766E]" />

                                <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                                    4.9/5
                                </p>
                            </div>

                            <p className="text-[11px] sm:text-sm text-slate-600">
                                Rating
                            </p>
                        </div>

                    </div>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">

                        <button
                            className="
                                group
                                w-full sm:w-auto
                                px-6 sm:px-8
                                py-3 sm:py-4
                                bg-black
                                hover:bg-neutral-800
                                text-white
                                rounded-full
                                text-sm sm:text-base
                                font-semibold
                                transition
                            "
                        >
                            <span className="flex items-center justify-center gap-2">
                                Shop Now

                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>

                        <button
                            className="
                                w-full sm:w-auto
                                px-6 sm:px-8
                                py-3 sm:py-4
                                bg-white
                                border border-gray-300
                                rounded-full
                                text-sm sm:text-base
                                font-semibold
                                text-slate-800
                                hover:border-black
                                hover:text-black
                                transition
                            "
                        >
                            View Collection
                        </button>

                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 sm:gap-5 lg:gap-6 text-xs sm:text-sm text-slate-600">
                        <span>✔ Free Shipping</span>
                        <span>✔ 30-Day Returns</span>
                        <span>✔ Secure Payment</span>
                    </div>
                </div>

                {/* ================= RIGHT IMAGE ================= */}
                <div className="w-full lg:w-1/2">

                    <div className="relative bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-xl border border-gray-200">

                        <img
                            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900"
                            alt="Fashion"
                            className="
                                w-full
                                h-[300px]
                                sm:h-[380px]
                                lg:h-[500px]
                                object-cover
                                rounded-xl
                                sm:rounded-2xl
                                lg:hover:scale-105
                                transition-transform
                                duration-700
                            "
                        />

                        {/* Sale Badge */}
                        <div className="
                            absolute
                            top-4 right-4
                            sm:top-6 sm:right-6
                            bg-black
                            text-white
                            px-4 py-2
                            sm:px-6 sm:py-3
                            rounded-full
                            shadow-lg
                        ">
                            <p className="text-[9px] sm:text-xs font-bold tracking-wide">
                                UP TO
                            </p>

                            <p className="text-base sm:text-xl font-bold">
                                50% OFF
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Hero;