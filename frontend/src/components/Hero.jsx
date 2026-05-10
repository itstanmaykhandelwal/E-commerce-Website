import React from "react";
import { FiShoppingBag, FiTrendingUp, FiArrowRight } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

const Hero = () => {
    return (
        <>
            {/* Main Content */}
            <div className="relative container mx-auto pt-16 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between min-h-[90vh] gap-12">
                    {/* LEFT CONTENT */}
                    <div className="w-full lg:w-1/2 space-y-8 animate-fade-in-up">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
                            <HiSparkles className="w-4 h-4 text-[#1E3A5F]" />

                            <span className="text-sm font-semibold text-[#1E3A5F]">
                                NEW SEASON COLLECTION
                            </span>
                        </div>

                        {/* Heading */}
                        <div>
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                                <span className="block text-slate-900">
                                    Discover
                                </span>

                                <span className="block text-[#1E3A5F]">
                                    Latest Trends
                                </span>
                            </h1>

                            <p className="mt-4 text-lg text-slate-600 max-w-lg">
                                Elevate your style with our exclusive collection
                                of premium fashion essentials.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8">
                            <div>
                                <div className="flex items-center gap-2">
                                    <FiTrendingUp className="text-[#1E3A5F]" />

                                    <p className="text-2xl font-bold">2000+</p>
                                </div>

                                <p className="text-sm text-slate-600">
                                    Products
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <FiShoppingBag className="text-black" />

                                    <p className="text-2xl font-bold">50K+</p>
                                </div>

                                <p className="text-sm text-slate-600">
                                    Happy Customers
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <HiSparkles className="text-[#0F766E]" />

                                    <p className="text-2xl font-bold">4.9/5</p>
                                </div>

                                <p className="text-sm text-slate-600">Rating</p>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex gap-4">
                            <button className="group px-8 py-4 bg-black hover:bg-neutral-800 text-white rounded-full font-semibold hover:scale-105 transition">
                                <span className="flex items-center gap-2">
                                    Shop Now
                                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>

                            <button className="px-8 py-4 bg-white border border-gray-300 rounded-full font-semibold text-slate-800 hover:border-black hover:text-black transition">
                                View Collection
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex gap-6 text-sm text-slate-600">
                            <span>✔ Free Shipping</span>
                            <span>✔ 30-Day Returns</span>
                            <span>✔ Secure Payment</span>
                        </div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative bg-white rounded-3xl p-4 shadow-xl border border-gray-200">
                            <img
                                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900"
                                alt="Fashion"
                                className="w-full h-[500px] object-cover rounded-2xl hover:scale-105 transition-transform duration-700"
                            />

                            {/* Sale Badge */}
                            <div className="absolute top-6 right-6 bg-black text-white px-6 py-3 rounded-full shadow-lg">
                                <p className="text-xs font-bold tracking-wide">
                                    UP TO
                                </p>

                                <p className="text-xl font-bold">50% OFF</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Hero;
