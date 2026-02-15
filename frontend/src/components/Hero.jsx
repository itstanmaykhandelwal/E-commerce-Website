// import React from 'react'
// import {assets} from '../assets/assets'

// const Hero = () => {
//   return (
//     <div className='flex flex-col sm:flex-row border border-gray-400'>
//         {/* Here Left Side */}
//         <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
//             <div className='text-[#414141]'>
//                 <div className='flex items-center gap-2'>
//                     <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
//                     <p className='font-medium text-sm md:text-base'>OUR BESTSELLER</p>
//                 </div>
//                 <h1 className='text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Latest Arrivals</h1>
//                 <div className='flex items-center gap-2'>
//                     <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
//                     <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
//                 </div>
//             </div>
//         </div>
//         {/* Hero Right Side */}
//         <img className='w-full sm:w-1/2' src={assets.hero_img} alt="hero" />
//     </div>
//   )
// }

// export default Hero

import React from "react";
import { FiShoppingBag, FiTrendingUp, FiArrowRight } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

const Hero = () => {
    return (
        <>
            {/* Main Content */}
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen gap-12">
                    {/* LEFT CONTENT */}
                    <div className="w-full lg:w-1/2 space-y-8 animate-fade-in-up">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/85 backdrop-blur rounded-full shadow border border-emerald-100">
                            <HiSparkles className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                NEW SEASON COLLECTION
                            </span>
                        </div>

                        {/* Heading */}
                        <div>
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                                <span className="block text-slate-900">
                                    Discover
                                </span>
                                <span className="block bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
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
                                    <FiTrendingUp className="text-emerald-600" />
                                    <p className="text-2xl font-bold">2000+</p>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Products
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <FiShoppingBag className="text-teal-600" />
                                    <p className="text-2xl font-bold">50K+</p>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Happy Customers
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <HiSparkles className="text-emerald-500" />
                                    <p className="text-2xl font-bold">4.9/5</p>
                                </div>
                                <p className="text-sm text-slate-600">Rating</p>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex gap-4">
                            <button className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-semibold hover:scale-105 transition">
                                <span className="flex items-center gap-2">
                                    Shop Now
                                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>

                            <button className="px-8 py-4 bg-white/90 border border-emerald-200 rounded-full font-semibold text-slate-800 hover:border-emerald-500 hover:text-emerald-700 transition">
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
                        <div className="relative bg-white/85 backdrop-blur rounded-3xl p-4 shadow-2xl border border-emerald-100">
                            <img
                                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900"
                                alt="Fashion"
                                className="w-full h-[500px] object-cover rounded-2xl hover:scale-105 transition-transform duration-700"
                            />

                            {/* Sale Badge */}
                            <div className="absolute top-6 right-6 bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-6 py-3 rounded-full shadow-lg">
                                <p className="text-xs font-bold tracking-wide">
                                    UP TO
                                </p>
                                <p className="text-xl font-bold">50% OFF</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Wave */}
            
        </>
    );
};

export default Hero;
