import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";

import ScrollToTop from "./components/ScrollTop.jsx";

// CONTEXT PROVIDERS
import AuthProvider from "./context/AuthContext";

import ProductProvider from "./context/ProductContext";

import CartProvider from "./context/CartContext";

import WishlistProvider from "./context/WishlistContext";

import SearchProvider from "./context/SearchContext";

import ReviewProvider from "./context/ReviewContext";

// GOOGLE AUTH (OPTIONAL)
// import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(
    document.getElementById("root")
).render(

    <StrictMode>

        {/* GOOGLE AUTH */}
        {/*
        <GoogleOAuthProvider
            clientId={
                import.meta.env
                    .VITE_GOOGLE_CLIENT_ID
            }
        >
        */}

        <BrowserRouter>

            <AuthProvider>

                <ProductProvider>

                    <CartProvider>

                        <WishlistProvider>

                            <SearchProvider>

                                <ReviewProvider>

                                    <ScrollToTop />

                                    <App />

                                </ReviewProvider>

                            </SearchProvider>

                        </WishlistProvider>

                    </CartProvider>

                </ProductProvider>

            </AuthProvider>

        </BrowserRouter>

        {/* </GoogleOAuthProvider> */}

    </StrictMode>
);