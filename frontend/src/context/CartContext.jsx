import { createContext, useEffect, useState } from "react";

import {
    addItemToCart,
    getCartData,
    updateCartItem,
} from "../services/cartService";

// HOOKS
import useProducts from "../hooks/useProducts";
import useAuth from "../hooks/useAuth";
import axios from "axios";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
    // PRODUCTS
    const { products } = useProducts();

    // AUTH
    const { token } = useAuth();

    // STATES
    const [cartItems, setCartItems] = useState({});

    const [loading, setLoading] = useState(false);

    // =========================
    // FETCH CART
    // =========================

    const fetchCart = async () => {
        try {
            if (!token) return;

            setLoading(true);

            const data = await getCartData();

            if (data.success) {
                setCartItems(data.cartData || {});
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // ADD TO CART
    // =========================

    const addToCart = async (
        itemId,
        size = "default",
        color = "default",
        quantity = 1,
    ) => {
        let cartData = structuredClone(cartItems);

        // PRODUCT
        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        // SIZE
        if (!cartData[itemId][size]) {
            cartData[itemId][size] = {};
        }

        // COLOR
        if (!cartData[itemId][size][color]) {
            cartData[itemId][size][color] = 0;
        }

        // QUANTITY
        cartData[itemId][size][color] += quantity;

        setCartItems(cartData);

        try {
            await axios.post(
                backendUrl + "/api/cart/add",
                {
                    itemId,
                    size,
                    color,
                    quantity,
                },
                {
                    headers: {
                        token,
                    },
                },
            );
        } catch (error) {
            console.log(error);
        }
    };

    // =========================
    // UPDATE CART
    // =========================

    const updateCart = async (itemId, size, color, quantity) => {
        let cartData = structuredClone(cartItems);

        // REMOVE
        if (quantity <= 0) {
            delete cartData[itemId][size][color];

            // CLEAN EMPTY SIZE
            if (Object.keys(cartData[itemId][size]).length === 0) {
                delete cartData[itemId][size];
            }

            // CLEAN EMPTY PRODUCT
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        } else {
            cartData[itemId][size][color] = quantity;
        }

        setCartItems(cartData);

        try {
            await axios.post(
                backendUrl + "/api/cart/update",
                {
                    itemId,
                    size,
                    color,
                    quantity,
                },
                {
                    headers: {
                        token,
                    },
                },
            );
        } catch (error) {
            console.log(error);
        }
    };

    // =========================
    // REMOVE FROM CART
    // =========================

    const removeFromCart = async (itemId, size, color) => {
        let cartData = structuredClone(cartItems);

        if (
            cartData[itemId] &&
            cartData[itemId][size] &&
            cartData[itemId][size][color]
        ) {
            delete cartData[itemId][size][color];

            // CLEAN EMPTY SIZE
            if (Object.keys(cartData[itemId][size]).length === 0) {
                delete cartData[itemId][size];
            }

            // CLEAN EMPTY PRODUCT
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        }

        setCartItems(cartData);

        try {
            await axios.post(
                backendUrl + "/api/cart/remove",
                {
                    itemId,
                    size,
                    color,
                },
                {
                    headers: {
                        token,
                    },
                },
            );
        } catch (error) {
            console.log(error);
        }
    };

    // =========================
    // CLEAR CART
    // =========================

    // const clearCart = () => {
    //     setCartItems({});
    // };
    const clearCart = () => {

    setCartItems({});

    localStorage.removeItem("cart");
};
    // =========================
    // TOTAL CART COUNT
    // =========================

    const getCartCount = () => {
        let totalCount = 0;

        for (const itemId in cartItems) {
            const item = cartItems[itemId];

            for (const size in item) {
                const sizeData = item[size];

                // COLOR OBJECT
                if (typeof sizeData === "object" && sizeData !== null) {
                    for (const color in sizeData) {
                        totalCount += Number(sizeData[color]) || 0;
                    }
                }

                // DIRECT NUMBER
                else {
                    totalCount += Number(sizeData) || 0;
                }
            }
        }

        return totalCount;
    };

    // =========================
    // TOTAL CART AMOUNT
    // =========================

    const getCartAmount = () => {
        let totalAmount = 0;

        for (const itemId in cartItems) {
            const itemInfo = products.find((product) => product._id === itemId);

            if (!itemInfo) continue;

            for (const size in cartItems[itemId]) {
                const sizeData = cartItems[itemId][size];

                // COLOR OBJECT
                if (typeof sizeData === "object" && sizeData !== null) {
                    for (const color in sizeData) {
                        const quantity = sizeData[color];

                        if (quantity > 0) {
                            totalAmount += itemInfo.price * quantity;
                        }
                    }
                }

                // OLD STRUCTURE SUPPORT
                else {
                    if (sizeData > 0) {
                        totalAmount += itemInfo.price * sizeData;
                    }
                }
            }
        }

        return totalAmount;
    };

    // =========================
    // FETCH CART AFTER LOGIN
    // =========================

    useEffect(() => {
        if (token) {
            fetchCart();
        } else {
            setCartItems({});
        }
    }, [token]);

    return (
        <CartContext.Provider
            value={{
                products,
                cartItems,
                addToCart,
                updateCart,
                removeFromCart,
                getCartCount,
                getCartAmount,
                setCartItems,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;
