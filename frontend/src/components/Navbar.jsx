import React, { useEffect, useState, useCallback } from "react";

import { assets } from "../assets/assets";

import { Link, NavLink, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import useSearch from "../hooks/useSearch";

import {
    FiSearch,
    FiUser,
    FiShoppingCart,
    FiMenu,
    FiX,
    FiHeart,
    FiPackage,
    FiLogOut,
} from "react-icons/fi";

const Navbar = () => {
    const navigate = useNavigate();

    const [visible, setVisible] = useState(false);

    const [showNavbar, setShowNavbar] = useState(true);

    const [lastScrollY, setLastScrollY] = useState(0);

    // SEARCH CONTEXT
    const { setShowSearch } = useSearch();

    // AUTH CONTEXT
    const { logout } = useAuth();

    // CART CONTEXT
    const { getCartCount } = useCart();

    const cartCount = getCartCount();

    // TOKEN
    const token = localStorage.getItem("token");

    // SCROLL HANDLER
    const handleScroll = useCallback(() => {
        if (window.scrollY > lastScrollY) {
            setShowNavbar(false);
        } else {
            setShowNavbar(true);
        }

        setLastScrollY(window.scrollY);
    }, [lastScrollY]);

    // SCROLL EFFECT
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]);

    // LOGOUT
    const handleLogout = () => {
        logout();

        localStorage.removeItem("token");

        localStorage.removeItem("cartItems");

        navigate("/login");

        setVisible(false);
    };

    return (
        <>
            {/* MAIN NAVBAR */}
            <nav
                className={`fixed left-0 top-0 w-full z-50 transition-transform duration-300
                ${showNavbar ? "translate-y-0" : "-translate-y-full"}
                bg-white border-b border-gray-200 shadow-sm`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="flex items-center justify-between h-20">
                        
                        {/* LOGO */}
                        <Link
                            to="/"
                            className="flex-shrink-0 hover:scale-105 transition"
                        >
                            <img
                                src={assets.logo}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-sm"
                                alt="logo"
                            />
                        </Link>

                        {/* DESKTOP LINKS */}
                        <ul className="hidden sm:flex items-center gap-8">
                            {[
                                {
                                    path: "/",
                                    label: "Home",
                                },
                                {
                                    path: "/collection",
                                    label: "Collection",
                                },
                                {
                                    path: "/about",
                                    label: "About",
                                },
                                {
                                    path: "/contact",
                                    label: "Contact",
                                },
                            ].map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `relative group text-sm font-semibold py-2 transition ${
                                            isActive
                                                ? "text-[#1E3A5F]"
                                                : "text-slate-700 hover:text-black"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span>{item.label}</span>

                                            <span
                                                className={`absolute -bottom-1 left-0 h-0.5 bg-black transition-all duration-300 ${
                                                    isActive
                                                        ? "w-full"
                                                        : "w-0 group-hover:w-full"
                                                }`}
                                            />
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </ul>

                        {/* RIGHT ICONS */}
                        <div className="flex items-center gap-4 sm:gap-6">
                            
                            {/* SEARCH */}
                            <button
                                onClick={() => {
                                    navigate("/collection");
                                    setShowSearch(true);
                                }}
                                className="p-2 rounded-full hover:bg-gray-100 hover:scale-110 transition"
                            >
                                <FiSearch className="w-5 h-5 text-slate-700 hover:text-black" />
                            </button>

                            {/* PROFILE */}
                            <div className="relative group">
                                
                                <button
                                    onClick={() =>
                                        token ? null : navigate("/login")
                                    }
                                    className="p-2 rounded-full hover:bg-gray-100 hover:scale-110 transition"
                                >
                                    <FiUser className="w-5 h-5 text-slate-700 hover:text-black" />
                                </button>

                                {token && (
                                    <div className="absolute right-0 top-10 hidden group-hover:block z-50 pt-4">
                                        
                                        <div className="absolute top-[-10px] right-0 w-full h-8 bg-transparent"></div>

                                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 min-w-[220px] overflow-hidden">
                                            
                                            <div className="bg-black p-4 text-white">
                                                
                                                <p className="text-sm font-semibold">
                                                    Welcome back
                                                </p>

                                                <p className="text-xs opacity-80">
                                                    Manage your account
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-2 w-full py-3 px-5">
                                                
                                                <button
                                                    onClick={() =>
                                                        navigate("/profile")
                                                    }
                                                    className="nav-dd-btn flex gap-2 items-center hover:text-black"
                                                >
                                                    <FiUser />
                                                    My Profile
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        navigate("/orders")
                                                    }
                                                    className="nav-dd-btn flex gap-2 items-center hover:text-black"
                                                >
                                                    <FiPackage />
                                                    Orders
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        navigate("/wishlist")
                                                    }
                                                    className="nav-dd-btn flex gap-2 items-center hover:text-black"
                                                >
                                                    <FiHeart />
                                                    Wishlist
                                                </button>

                                                <div className="border-t border-gray-200 my-1" />

                                                <button
                                                    onClick={handleLogout}
                                                    className="nav-dd-btn text-red-600 hover:bg-red-50 flex gap-2 items-center rounded-lg px-2 py-2 transition"
                                                >
                                                    <FiLogOut />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* CART */}
                            <Link
                                to="/cart"
                                className="relative p-2 rounded-full hover:bg-gray-100 hover:scale-110 transition"
                            >
                                <FiShoppingCart className="w-5 h-5 text-slate-700 hover:text-black" />

                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* MOBILE MENU */}
                            <button
                                onClick={() => setVisible(true)}
                                className="sm:hidden p-2 rounded-full hover:bg-gray-100 transition"
                            >
                                <FiMenu className="w-6 h-6 text-slate-700" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;