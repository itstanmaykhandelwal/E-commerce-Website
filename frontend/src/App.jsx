import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// CONTEXT PROVIDERS
import AuthProvider from "./context/AuthContext";
import ProductProvider from "./context/ProductContext";
import CartProvider from "./context/CartContext";
import WishlistProvider from "./context/WishlistContext";
import SearchProvider from "./context/SearchContext";
import ReviewProvider from "./context/ReviewContext";

// ==========================
// LAZY LOADED PAGES
// ==========================

const Home = lazy(() => import("./pages/Home"));
const Collection = lazy(() => import("./pages/Collection"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Orders = lazy(() => import("./pages/Orders"));
const Verify = lazy(() => import("./pages/Verify"));
const Profile = lazy(() => import("./pages/Profile"));
const PlaceOrder = lazy(() => import("./pages/PlaceOrder"));
const Product = lazy(() => import("./pages/Product"));

const ChatBot = lazy(() => import("./components/ChatBot"));

// ==========================
// LOADER COMPONENT
// ==========================

const Loader = () => {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
};

// ==========================
// MAIN APP
// ==========================

const App = () => {
    return (
        <AuthProvider>
            <ProductProvider>
                <CartProvider>
                    <WishlistProvider>
                        <SearchProvider>
                            <ReviewProvider>

                                <div className="relative min-h-screen overflow-hidden bg-white">

                                    {/* BACKGROUND EFFECTS */}
                                    <div className="absolute inset-0 z-0 pointer-events-none">

                                        <div className="absolute -top-40 -right-40 w-72 h-72 bg-sky-100 rounded-full blur-3xl opacity-40" />

                                        <div className="absolute -bottom-40 -left-40 w-72 h-72 bg-slate-100 rounded-full blur-3xl opacity-40" />
                                    </div>

                                    {/* MAIN CONTENT */}
                                    <div className="relative z-10 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">

                                        {/* TOAST */}
                                        <ToastContainer
                                            position="top-right"
                                            autoClose={2000}
                                            newestOnTop
                                            pauseOnHover
                                            theme="light"
                                        />

                                        {/* NAVBAR */}
                                        <Navbar />

                                        {/* SEARCH */}
                                        <SearchBar />

                                        {/* ROUTES */}
                                        <Suspense fallback={<Loader />}>
                                            
                                            <Routes>

                                                <Route
                                                    path="/"
                                                    element={<Home />}
                                                />

                                                <Route
                                                    path="/collection"
                                                    element={<Collection />}
                                                />

                                                <Route
                                                    path="/contact"
                                                    element={<Contact />}
                                                />

                                                <Route
                                                    path="/about"
                                                    element={<About />}
                                                />

                                                <Route
                                                    path="/login"
                                                    element={<Login />}
                                                />

                                                <Route
                                                    path="/cart"
                                                    element={<Cart />}
                                                />

                                                <Route
                                                    path="/wishlist"
                                                    element={<Wishlist />}
                                                />

                                                <Route
                                                    path="/orders"
                                                    element={<Orders />}
                                                />

                                                <Route
                                                    path="/verify"
                                                    element={<Verify />}
                                                />

                                                <Route
                                                    path="/profile"
                                                    element={<Profile />}
                                                />

                                                <Route
                                                    path="/place-order"
                                                    element={<PlaceOrder />}
                                                />

                                                <Route
                                                    path="/product/:productId"
                                                    element={<Product />}
                                                />
                                            </Routes>

                                            {/* CHATBOT */}
                                            <ChatBot />
                                        </Suspense>

                                        {/* FOOTER */}
                                        <Footer />
                                    </div>
                                </div>

                            </ReviewProvider>
                        </SearchProvider>
                    </WishlistProvider>
                </CartProvider>
            </ProductProvider>
        </AuthProvider>
    );
};

export default App;