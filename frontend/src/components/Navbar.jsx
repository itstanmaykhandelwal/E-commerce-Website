import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
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
    const [visible, setVisible] = useState(false);
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const {
        setShowSearch,
        getCartCount,
        navigate,
        token,
        setToken,
        setCartItems,
        setWishlist,
    } = useContext(ShopContext);

    const logout = () => {
        navigate("/login");
        localStorage.removeItem("token");
        localStorage.removeItem("cartItems");
        setToken("");
        setCartItems({});
        setWishlist([]);
    };
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY) {
                // scroll down
                setShowNavbar(false);
            } else {
                // scroll up
                setShowNavbar(true);
            }

            setLastScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);
    return (
        <>
            {/* MAIN NAVBAR */}
            <nav
                className={`fixed top-0 w-full z-50 transition-transform duration-300 
  ${showNavbar ? "translate-y-0" : "-translate-y-full"} 
  bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm`}
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
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-md"
                                alt="logo"
                            />
                        </Link>

                        {/* DESKTOP LINKS */}
                        <ul className="hidden sm:flex items-center gap-8">
                            {[
                                { path: "/", label: "Home" },
                                { path: "/collection", label: "Collection" },
                                { path: "/about", label: "About" },
                                { path: "/contact", label: "Contact" },
                            ].map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `relative group text-sm font-semibold py-2 transition ${
                                            isActive
                                                ? "text-emerald-700"
                                                : "text-slate-700 hover:text-emerald-700"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span>{item.label}</span>
                                            <span
                                                className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 transition-all ${
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
                                className="p-2 rounded-full hover:bg-emerald-50 hover:scale-110 transition"
                            >
                                <FiSearch className="w-5 h-5 text-slate-700 hover:text-emerald-700" />
                            </button>

                            {/* PROFILE */}
                            <div className="relative group">
                                <button
                                    onClick={() =>
                                        token ? null : navigate("/login")
                                    }
                                    className="p-2 rounded-full hover:bg-emerald-50 hover:scale-110 transition"
                                >
                                    <FiUser className="w-5 h-5 text-slate-700 hover:text-emerald-700" />
                                </button>

                                {token && (
                                    <div className="absolute right-0 top-14 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                                        <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 min-w-[200px] overflow-hidden">
                                            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white">
                                                <p className="text-sm font-semibold">
                                                    Welcome back
                                                </p>
                                                <p className="text-xs opacity-90">
                                                    Manage your account
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-2 w-100 py-3 px-5">
                                                <button
                                                    onClick={() =>
                                                        navigate("/profile")
                                                    }
                                                    className="nav-dd-btn flex gap-2 items-center"
                                                >
                                                    <FiUser /> My Profile
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        navigate("/orders")
                                                    }
                                                    className="nav-dd-btn flex gap-2 items-center"
                                                >
                                                    <FiPackage /> Orders
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        navigate("/wishlist")
                                                    }
                                                    className="nav-dd-btn flex gap-2 items-center"
                                                >
                                                    <FiHeart /> Wishlist
                                                </button>
                                                <div className="border-t my-1" />
                                                <button
                                                    onClick={logout}
                                                    className="nav-dd-btn text-red-600 hover:bg-red-50 flex gap-2 items-center"
                                                >
                                                    <FiLogOut /> Logout
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* CART */}
                            <Link
                                to="/cart"
                                className="relative p-2 rounded-full hover:bg-emerald-50 hover:scale-110 transition"
                            >
                                <FiShoppingCart className="w-5 h-5 text-slate-700 hover:text-emerald-700" />
                                {getCartCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
                                        {getCartCount()}
                                    </span>
                                )}
                            </Link>

                            {/* MOBILE MENU */}
                            <button
                                onClick={() => setVisible(true)}
                                className="sm:hidden p-2 rounded-full hover:bg-emerald-50 transition"
                            >
                                <FiMenu className="w-6 h-6 text-slate-700" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* MOBILE MENU */}
            <div
                className={`fixed inset-0 z-50 sm:hidden ${
                    visible ? "visible opacity-100" : "invisible opacity-0"
                } transition`}
            >
                <div
                    onClick={() => setVisible(false)}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                <div
                    className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transform transition ${
                        visible ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex justify-between items-center text-white">
                        <h2 className="text-xl font-bold">Menu</h2>
                        <button onClick={() => setVisible(false)}>
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="py-4">
                        {[
                            { path: "/", label: "HOME" },
                            { path: "/collection", label: "COLLECTION" },
                            { path: "/about", label: "ABOUT" },
                            { path: "/contact", label: "CONTACT" },
                        ].map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setVisible(false)}
                                className={({ isActive }) =>
                                    `block px-6 py-4 font-semibold transition ${
                                        isActive
                                            ? "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600"
                                            : "text-slate-700 hover:bg-slate-50"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>

                    {token && (
                        <div className="absolute bottom-0 w-full p-6 border-t">
                            <button
                                onClick={() => {
                                    logout();
                                    setVisible(false);
                                }}
                                className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-semibold"
                            >
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
