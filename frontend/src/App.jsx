import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Collection from "./pages/Collection";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import PlaceOrder from "./pages/PlaceOrder";
import Product from "./pages/Product";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import ChatBot from "./components/ChatBot";
import About from "./pages/About";

// 👇 Lottie import
import Lottie from "lottie-react";
import loadingAnimation from "./assets/loading-gif.json"; // apna path check kar lena

const App = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API/Assets load
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); // 2 seconds
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-white text-center">
                <Lottie
                    animationData={loadingAnimation}
                    loop={true}
                    className="w-40 h-40"
                />
            </div>
        );
    }

    return (
        <>
            {/* <marquee
                behavior="scroll"
                direction="left"
                scrollamount="6"
                className="bg-#f6f6f6 text-grey py-2 text-sm font-medium"
            >
                🎉 Limited Offer! Get <span className="text-yellow-400 font-bold">10% OFF</span> on your first order. Hurry up!
            </marquee> */}
            <Navbar />

            {/* APP WRAPPER */}
            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-stone-50 via-emerald-50 to-teal-50">
                {/* BACKGROUND BLOBS (Brand aligned) */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply blur-xl opacity-40 animate-blob" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply blur-xl opacity-40 animate-blob animation-delay-2000" />
                </div>

                {/* MAIN CONTENT */}
                <div className="relative z-99 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
                    <ToastContainer
                        position="top-right"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        pauseOnHover
                        theme="light"
                    />

                    <SearchBar />

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/collection" element={<Collection />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/verify" element={<Verify />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/place-order" element={<PlaceOrder />} />
                        <Route
                            path="/product/:productId"
                            element={<Product />}
                        />
                    </Routes>

                    <ChatBot />
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default App;
