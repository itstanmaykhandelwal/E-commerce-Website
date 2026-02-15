import React from "react";
import { assets } from "../assets/assets";
import { FiPhone, FiMail } from "react-icons/fi";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-emerald-100 mt-[30px]">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-sm">
                    {/* Logo + Description */}
                    <div>
                        <img
                            src={assets.logo}
                            className="mb-6 w-24"
                            alt="logo"
                        />

                        <p className="text-slate-600 leading-relaxed">
                            Shop beautifully handcrafted Poshaks for Lord
                            Krishna and Laddu Gopal. Our traditional Krishna
                            attire is designed with devotion, faith, and the
                            finest quality fabrics to enhance your divine
                            celebrations and daily worship.
                        </p>
                    </div>

                    {/* Company Links */}
                    <div>
                        <p className="text-xl font-semibold mb-6 text-slate-900">
                            COMPANY
                        </p>

                        <ul className="flex flex-col gap-3 text-slate-600">
                            {[
                                "Home",
                                "About Us",
                                "Delivery",
                                "Privacy Policy",
                            ].map((item, index) => (
                                <li
                                    key={index}
                                    className="cursor-pointer hover:text-emerald-600 transition-colors duration-300"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <p className="text-xl font-semibold mb-6 text-slate-900">
                            GET IN TOUCH
                        </p>

                        <ul className="flex flex-col gap-4 text-slate-600">
                            <li className="flex items-center gap-3 hover:text-emerald-600 transition">
                                <FiPhone className="text-emerald-600" />
                                +1-212-456-7890
                            </li>

                            <li className="flex items-center gap-3 hover:text-emerald-600 transition">
                                <FiMail className="text-emerald-600" />
                                contact@foreveryou.com
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-emerald-100 ">
                <p className="py-6 text-sm text-center text-slate-600">
                    © {year} Tanmay Khandelwal — All Rights Reserved.

                </p>
            </div>
        </footer>
    );
};

export default Footer;
