import { createContext, useEffect, useState } from "react";

import {
    addWishlistItem,
    getWishlistData,
    removeWishlistItem,
} from "../services/wishlistService";

// AUTH
import useAuth from "../hooks/useAuth";

export const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
    // AUTH
    const { token } = useAuth();

    // STATE
    const [wishlist, setWishlist] = useState([]);

    const [loading, setLoading] = useState(false);

    // =========================
    // FETCH WISHLIST
    // =========================

    const fetchWishlist = async () => {
        try {
            // NO TOKEN
            if (!token) return;

            setLoading(true);

            const data = await getWishlistData();

            if (data.success) {
                setWishlist(data.wishlist || []);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // ADD
    // =========================

    const addToWishlist = async (productId) => {
        try {
            if (!token) return;

            const data = await addWishlistItem(productId);

            if (data.success) {
                await fetchWishlist();
            }
        } catch (error) {
            console.log(error);
        }
    };

    // =========================
    // REMOVE
    // =========================

    const removeFromWishlist = async (productId) => {
        try {
            if (!token) return;

            const data = await removeWishlistItem(productId);

            if (data.success) {
                await fetchWishlist();
            }
        } catch (error) {
            console.log(error);
        }
    };

    // =========================
    // FETCH AFTER TOKEN
    // =========================

    useEffect(() => {
        if (token) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [token]);

    return (
        <WishlistContext.Provider
            value={{
                wishlist,

                loading,

                fetchWishlist,

                addToWishlist,

                removeFromWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export default WishlistProvider;
