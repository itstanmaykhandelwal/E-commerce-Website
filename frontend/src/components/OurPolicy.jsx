import React from "react";
import { FiRefreshCw, FiShield, FiHeadphones } from "react-icons/fi";

const OurPolicy = () => {
    const policies = [
        {
            icon: FiRefreshCw,
            title: "Easy Exchange Policy",
            description: "We offer hassle-free exchange on eligible products",
            iconBg: "bg-black",
            cardBg: "from-slate-50 to-sky-50",
        },
        {
            icon: FiShield,
            title: "7 Days Return Policy",
            description: "Enjoy 7 days easy return for a worry-free purchase",
            iconBg: "bg-[#1E3A5F]",
            cardBg: "from-slate-50 to-slate-100",
        },
        {
            icon: FiHeadphones,
            title: "Best Customer Support",
            description: "Our support team is available 24/7 for your help",
            iconBg: "bg-[#0F766E]",
            cardBg: "from-sky-50 to-slate-100",
        },
    ];

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-14 animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                        Why Choose Us
                    </h2>

                    <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        We focus on quality, trust, and a smooth shopping
                        experience for every customer
                    </p>
                </div>

                {/* Policy Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {policies.map((policy, index) => {
                        const Icon = policy.icon;

                        return (
                            <div
                                key={index}
                                className="group relative bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 animate-fade-in-up overflow-hidden"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                {/* Soft Hover Background */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${policy.cardBg} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                                />

                                {/* Content */}
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    {/* Icon */}
                                    <div
                                        className={`mb-6 p-6 ${policy.iconBg} rounded-2xl shadow-md transform group-hover:scale-105 transition-all duration-500`}
                                    >
                                        <Icon
                                            className="w-12 h-12 text-white"
                                            strokeWidth={1.5}
                                        />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#1E3A5F] transition-colors">
                                        {policy.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {policy.description}
                                    </p>

                                    {/* Divider */}
                                    <div className="mt-6 h-1 w-16 bg-black rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
                                </div>

                                {/* Corner Glow */}
                                <div className="absolute -top-3 -right-3 w-20 h-20 bg-sky-100 rounded-full opacity-30 blur-2xl group-hover:opacity-50 transition-opacity" />
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Stats */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {[
                        { value: "100K+", label: "Happy Customers" },
                        { value: "50K+", label: "Products Sold" },
                        { value: "4.9/5", label: "Customer Rating" },
                        { value: "24/7", label: "Support Available" },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <p className="text-3xl font-bold text-[#1E3A5F]">
                                {stat.value}
                            </p>

                            <p className="text-sm text-slate-600 mt-1">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OurPolicy;
