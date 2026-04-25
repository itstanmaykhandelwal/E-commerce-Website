import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Lazy Loaded Pages (Code Splitting)
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

// ✅ Simple Loader Component
const Loader = () => (
    <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const App = () => {
    return (
        <>
            <Navbar />

            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-stone-50 via-emerald-50 to-teal-50">
                {/* Background Effects (Lightweight) */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-72 h-72 bg-emerald-200 rounded-full blur-2xl opacity-30" />
                    <div className="absolute -bottom-40 -left-40 w-72 h-72 bg-teal-200 rounded-full blur-2xl opacity-30" />
                </div>

                <div className="relative z-99 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
                    <ToastContainer
                        position="top-right"
                        autoClose={2000}
                        newestOnTop
                        pauseOnHover
                        theme="light"
                    />

                    <SearchBar />

                    {/* ✅ Suspense wraps only Routes */}
                    <Suspense fallback={<Loader />}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route
                                path="/collection"
                                element={<Collection />}
                            />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/wishlist" element={<Wishlist />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/verify" element={<Verify />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route
                                path="/place-order"
                                element={<PlaceOrder />}
                            />
                            <Route
                                path="/product/:productId"
                                element={<Product />}
                            />
                        </Routes>

                        {/* ChatBot lazy loaded */}
                        <ChatBot />
                    </Suspense>

                    <Footer />
                </div>
            </div>
        </>
    );
};

export default App;
