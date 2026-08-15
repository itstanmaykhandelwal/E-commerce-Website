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

    // SEARCH
    const { setShowSearch } = useSearch();

    // AUTH
    const { logout } = useAuth();

    // CART
    const { getCartCount } = useCart();

    const cartCount = getCartCount();

    // TOKEN
    const token = localStorage.getItem("token");

    // =========================
    // NAVIGATION LINKS
    // =========================

    const navLinks = [
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
    ];

    // =========================
    // SCROLL HANDLER
    // =========================

    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;

        // Don't hide navbar while mobile menu is open
        if (visible) {
            setShowNavbar(true);
            setLastScrollY(currentScrollY);
            return;
        }

        if (currentScrollY > lastScrollY && currentScrollY > 80) {
            setShowNavbar(false);
        } else {
            setShowNavbar(true);
        }

        setLastScrollY(currentScrollY);
    }, [lastScrollY, visible]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]);

    // =========================
    // CLOSE MOBILE MENU
    // =========================

    const closeMobileMenu = () => {
        setVisible(false);
    };

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {
        logout();

        localStorage.removeItem("token");
        localStorage.removeItem("cartItems");

        setVisible(false);

        navigate("/login");
    };

    // =========================
    // SEARCH
    // =========================

    const handleSearch = () => {
        setVisible(false);
        navigate("/collection");
        setShowSearch(true);
    };

    // =========================
    // NAVIGATE + CLOSE MENU
    // =========================

    const handleMobileNavigation = (path) => {
        setVisible(false);
        navigate(path);
    };

    return (
        <>
            {/* =====================================================
                MAIN NAVBAR
            ====================================================== */}

            <nav
                className={`
                    fixed
                    left-0
                    top-0
                    w-full
                    z-50
                    transition-transform
                    duration-300
                    ${
                        showNavbar
                            ? "translate-y-0"
                            : "-translate-y-full"
                    }
                    bg-white
                    border-b
                    border-gray-200
                    shadow-sm
                `}
            >
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

                    <div className="flex items-center justify-between h-16 sm:h-20">

                        {/* =====================================================
                            LOGO
                        ====================================================== */}

                        <Link
                            to="/"
                            onClick={closeMobileMenu}
                            className="flex-shrink-0 hover:scale-105 transition"
                        >
                            <img
                                src={assets.logo}
                                className="
                                    w-12
                                    h-12
                                    sm:w-20
                                    sm:h-20
                                    rounded-full
                                    shadow-sm
                                    object-contain
                                "
                                alt="logo"
                            />
                        </Link>

                        {/* =====================================================
                            DESKTOP LINKS
                        ====================================================== */}

                        <ul className="hidden sm:flex items-center gap-5 lg:gap-8">

                            {navLinks.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `
                                        relative
                                        group
                                        text-sm
                                        font-semibold
                                        py-2
                                        transition
                                        ${
                                            isActive
                                                ? "text-[#1E3A5F]"
                                                : "text-slate-700 hover:text-black"
                                        }
                                        `
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span>{item.label}</span>

                                            <span
                                                className={`
                                                    absolute
                                                    -bottom-1
                                                    left-0
                                                    h-0.5
                                                    bg-black
                                                    transition-all
                                                    duration-300
                                                    ${
                                                        isActive
                                                            ? "w-full"
                                                            : "w-0 group-hover:w-full"
                                                    }
                                                `}
                                            />
                                        </>
                                    )}
                                </NavLink>
                            ))}

                        </ul>

                        {/* =====================================================
                            RIGHT ICONS
                        ====================================================== */}

                        <div className="flex items-center gap-1 sm:gap-4 lg:gap-6">

                            {/* SEARCH */}

                            <button
                                onClick={handleSearch}
                                className="
                                    p-2
                                    rounded-full
                                    hover:bg-gray-100
                                    hover:scale-110
                                    transition
                                "
                                aria-label="Search"
                            >
                                <FiSearch className="w-5 h-5 text-slate-700" />
                            </button>

                            {/* PROFILE */}

                            <div className="relative group">

                                <button
                                    onClick={() => {
                                        if (!token) {
                                            navigate("/login");
                                        }
                                    }}
                                    className="
                                        p-2
                                        rounded-full
                                        hover:bg-gray-100
                                        hover:scale-110
                                        transition
                                    "
                                    aria-label="Profile"
                                >
                                    <FiUser className="w-5 h-5 text-slate-700" />
                                </button>

                                {/* DESKTOP PROFILE DROPDOWN */}

                                {token && (
                                    <div className="absolute right-0 top-10 hidden group-hover:block z-50 pt-4">

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
                                                    className="flex gap-2 items-center hover:text-black text-sm"
                                                >
                                                    <FiUser />
                                                    My Profile
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        navigate("/orders")
                                                    }
                                                    className="flex gap-2 items-center hover:text-black text-sm"
                                                >
                                                    <FiPackage />
                                                    Orders
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        navigate("/wishlist")
                                                    }
                                                    className="flex gap-2 items-center hover:text-black text-sm"
                                                >
                                                    <FiHeart />
                                                    Wishlist
                                                </button>

                                                <div className="border-t border-gray-200 my-1" />

                                                <button
                                                    onClick={handleLogout}
                                                    className="
                                                        text-red-600
                                                        hover:bg-red-50
                                                        flex
                                                        gap-2
                                                        items-center
                                                        rounded-lg
                                                        px-2
                                                        py-2
                                                        text-sm
                                                        transition
                                                    "
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
                                className="
                                    relative
                                    p-2
                                    rounded-full
                                    hover:bg-gray-100
                                    hover:scale-110
                                    transition
                                "
                                aria-label="Cart"
                            >
                                <FiShoppingCart className="w-5 h-5 text-slate-700" />

                                {cartCount > 0 && (
                                    <span
                                        className="
                                            absolute
                                            -top-1
                                            -right-1
                                            w-5
                                            h-5
                                            bg-black
                                            text-white
                                            text-xs
                                            font-bold
                                            rounded-full
                                            flex
                                            items-center
                                            justify-center
                                        "
                                    >
                                        {cartCount}
                                    </span>
                                )}

                            </Link>

                            {/* =====================================================
                                MOBILE MENU BUTTON
                            ====================================================== */}

                            <button
                                onClick={() => setVisible(true)}
                                className="
                                    sm:hidden
                                    p-2
                                    rounded-full
                                    hover:bg-gray-100
                                    transition
                                "
                                aria-label="Open menu"
                            >
                                <FiMenu className="w-6 h-6 text-slate-700" />
                            </button>

                        </div>

                    </div>

                </div>
            </nav>

            {/* =====================================================
                MOBILE MENU OVERLAY
            ====================================================== */}

            <div
                onClick={closeMobileMenu}
                className={`
                    fixed
                    inset-0
                    bg-black/40
                    z-[60]
                    transition-opacity
                    duration-300
                    sm:hidden
                    ${
                        visible
                            ? "opacity-100 visible"
                            : "opacity-0 invisible pointer-events-none"
                    }
                `}
            />

            {/* =====================================================
                MOBILE SIDE DRAWER
            ====================================================== */}

            <div
                className={`
                    fixed
                    top-0
                    right-0
                    h-full
                    w-[82%]
                    max-w-sm
                    bg-white
                    z-[70]
                    shadow-2xl
                    sm:hidden
                    transition-transform
                    duration-300
                    ease-in-out
                    ${
                        visible
                            ? "translate-x-0"
                            : "translate-x-full"
                    }
                `}
            >

                {/* DRAWER HEADER */}

                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">

                    <Link
                        to="/"
                        onClick={closeMobileMenu}
                    >
                        <img
                            src={assets.logo}
                            alt="logo"
                            className="w-12 h-12 rounded-full object-contain"
                        />
                    </Link>

                    <button
                        onClick={closeMobileMenu}
                        className="
                            p-2
                            rounded-full
                            hover:bg-gray-100
                            transition
                        "
                        aria-label="Close menu"
                    >
                        <FiX className="w-6 h-6 text-slate-800" />
                    </button>

                </div>

                {/* DRAWER CONTENT */}

                <div className="flex flex-col h-[calc(100%-81px)]">

                    {/* NAVIGATION */}

                    <div className="px-5 py-6">

                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                            Navigation
                        </p>

                        <div className="flex flex-col gap-1">

                            {navLinks.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={closeMobileMenu}
                                    className={({ isActive }) =>
                                        `
                                        px-4
                                        py-3
                                        rounded-xl
                                        text-base
                                        font-semibold
                                        transition
                                        ${
                                            isActive
                                                ? "bg-slate-100 text-[#1E3A5F]"
                                                : "text-slate-700 hover:bg-gray-50"
                                        }
                                        `
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            ))}

                        </div>

                    </div>

                    {/* QUICK ACTIONS */}

                    <div className="border-t border-gray-200 px-5 py-6">

                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                            Quick Actions
                        </p>

                        <div className="flex flex-col gap-1">

                            <button
                                onClick={handleSearch}
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    px-4
                                    py-3
                                    rounded-xl
                                    text-slate-700
                                    hover:bg-gray-50
                                    transition
                                    text-left
                                "
                            >
                                <FiSearch className="w-5 h-5" />
                                Search Products
                            </button>

                            <button
                                onClick={() =>
                                    handleMobileNavigation("/cart")
                                }
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    px-4
                                    py-3
                                    rounded-xl
                                    text-slate-700
                                    hover:bg-gray-50
                                    transition
                                    text-left
                                "
                            >
                                <FiShoppingCart className="w-5 h-5" />
                                Cart

                                {cartCount > 0 && (
                                    <span className="ml-auto bg-black text-white text-xs px-2 py-1 rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() =>
                                    handleMobileNavigation(
                                        token ? "/profile" : "/login"
                                    )
                                }
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    px-4
                                    py-3
                                    rounded-xl
                                    text-slate-700
                                    hover:bg-gray-50
                                    transition
                                    text-left
                                "
                            >
                                <FiUser className="w-5 h-5" />
                                {token ? "My Profile" : "Login"}
                            </button>

                            {token && (
                                <>
                                    <button
                                        onClick={() =>
                                            handleMobileNavigation(
                                                "/orders"
                                            )
                                        }
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            rounded-xl
                                            text-slate-700
                                            hover:bg-gray-50
                                            transition
                                            text-left
                                        "
                                    >
                                        <FiPackage className="w-5 h-5" />
                                        Orders
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleMobileNavigation(
                                                "/wishlist"
                                            )
                                        }
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            rounded-xl
                                            text-slate-700
                                            hover:bg-gray-50
                                            transition
                                            text-left
                                        "
                                    >
                                        <FiHeart className="w-5 h-5" />
                                        Wishlist
                                    </button>
                                </>
                            )}

                        </div>

                    </div>

                    {/* BOTTOM LOGOUT */}

                    {token && (
                        <div className="mt-auto border-t border-gray-200 p-5">

                            <button
                                onClick={handleLogout}
                                className="
                                    w-full
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    py-3
                                    rounded-xl
                                    bg-red-50
                                    text-red-600
                                    font-semibold
                                    hover:bg-red-100
                                    transition
                                "
                            >
                                <FiLogOut />
                                Logout
                            </button>

                        </div>
                    )}

                </div>

            </div>
        </>
    );
};

export default Navbar;