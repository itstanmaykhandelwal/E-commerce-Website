import { createContext, useEffect, useState } from "react";

import {
    addItemToCart,
    getCartData,
    updateCartItem,
    removeCartItem,
} from "../services/cartService";

import { toast } from "react-toastify";

// HOOKS
import useProducts from "../hooks/useProducts";
import useAuth from "../hooks/useAuth";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
    // =========================
    // PRODUCTS
    // =========================

    const { products } = useProducts();

    // =========================
    // AUTH
    // =========================

    const { token } = useAuth();

    // =========================
    // STATES
    // =========================

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
            console.log("Fetch Cart Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // GET CURRENT PRODUCT
    // =========================

    const getProduct = (itemId) => {
        return products.find((product) => product._id === itemId);
    };

    // =========================
    // GET TOTAL QUANTITY
    // OF A PRODUCT IN CART
    // =========================

    const getProductCartQuantity = (itemId) => {
        let total = 0;

        const productCart = cartItems[itemId];

        if (!productCart) {
            return 0;
        }

        for (const size in productCart) {
            const sizeData = productCart[size];

            if (typeof sizeData === "object" && sizeData !== null) {
                for (const color in sizeData) {
                    total += Number(sizeData[color]) || 0;
                }
            } else {
                total += Number(sizeData) || 0;
            }
        }

        return total;
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
        const product = getProduct(itemId);

        if (!product) {
            toast.error("Product not found");
            return;
        }

        const stock = Number(product.quantity) || 0;
        const requestedQuantity = Number(quantity) || 1;

        if (stock <= 0) {
            toast.error("Out of stock");
            return;
        }

        // Current total quantity of this product
        const currentTotal = getProductCartQuantity(itemId);

        // Stock validation
        if (currentTotal + requestedQuantity > stock) {
            const remaining = stock - currentTotal;

            toast.error(
                remaining > 0
                    ? `Only ${remaining} item(s) available`
                    : "No more stock available",
            );

            return;
        }

        // =========================
        // OPTIMISTIC UPDATE
        // =========================

        const previousCart = structuredClone(cartItems);

        const newCart = structuredClone(cartItems);

        if (!newCart[itemId]) {
            newCart[itemId] = {};
        }

        if (!newCart[itemId][size]) {
            newCart[itemId][size] = {};
        }

        if (!newCart[itemId][size][color]) {
            newCart[itemId][size][color] = 0;
        }

        newCart[itemId][size][color] += requestedQuantity;

        setCartItems(newCart);

        // =========================
        // API
        // =========================

        try {
            const response = await addItemToCart({
                itemId,
                size,
                color,
                quantity: requestedQuantity,
            });

            if (!response.success) {
                setCartItems(previousCart);

                toast.error(response.message || "Unable to add product");

                return;
            }

            // Sync with backend
            await fetchCart();
        } catch (error) {
            console.log("Add To Cart Error:", error);

            // Rollback
            setCartItems(previousCart);

            toast.error(
                error.response?.data?.message || "Unable to add product",
            );
        }
    };

    // =========================
    // UPDATE CART
    // =========================

    const updateCart = async (itemId, size, color, quantity) => {
        const product = getProduct(itemId);

        if (!product) {
            toast.error("Product not found");
            return;
        }

        const stock = Number(product.quantity) || 0;

        const requestedQuantity = Number(quantity) || 0;

        const previousCart = structuredClone(cartItems);

        const newCart = structuredClone(cartItems);

        // =========================
        // REMOVE
        // =========================

        if (requestedQuantity <= 0) {
            if (
                newCart[itemId] &&
                newCart[itemId][size] &&
                newCart[itemId][size][color]
            ) {
                delete newCart[itemId][size][color];

                if (Object.keys(newCart[itemId][size]).length === 0) {
                    delete newCart[itemId][size];
                }

                if (Object.keys(newCart[itemId]).length === 0) {
                    delete newCart[itemId];
                }
            }

            setCartItems(newCart);

            try {
                const response = await removeCartItem({
                    itemId,
                    size,
                    color,
                });

                if (!response.success) {
                    setCartItems(previousCart);

                    toast.error(response.message || "Unable to remove product");
                }
            } catch (error) {
                console.log("Remove Cart Error:", error);

                setCartItems(previousCart);

                toast.error(
                    error.response?.data?.message || "Unable to remove product",
                );
            }

            return;
        }

        // =========================
        // STOCK VALIDATION
        // =========================

        // Current total includes the old
        // quantity of this particular variant.
        const currentTotal = getProductCartQuantity(itemId);

        const currentVariantQuantity =
            Number(cartItems?.[itemId]?.[size]?.[color]) || 0;

        const otherQuantity = currentTotal - currentVariantQuantity;

        if (otherQuantity + requestedQuantity > stock) {
            const remaining = stock - otherQuantity;

            toast.error(
                remaining > 0
                    ? `Only ${remaining} item(s) available`
                    : "No more stock available",
            );

            return;
        }

        // =========================
        // UPDATE LOCAL CART
        // =========================

        if (!newCart[itemId]) {
            newCart[itemId] = {};
        }

        if (!newCart[itemId][size]) {
            newCart[itemId][size] = {};
        }

        newCart[itemId][size][color] = requestedQuantity;

        setCartItems(newCart);

        // =========================
        // API
        // =========================

        try {
            const response = await updateCartItem({
                itemId,
                size,
                color,
                quantity: requestedQuantity,
            });

            if (!response.success) {
                setCartItems(previousCart);

                toast.error(response.message || "Unable to update cart");

                return;
            }

            await fetchCart();
        } catch (error) {
            console.log("Update Cart Error:", error);

            setCartItems(previousCart);

            toast.error(
                error.response?.data?.message || "Unable to update cart",
            );
        }
    };

    // =========================
    // REMOVE FROM CART
    // =========================

    const removeFromCart = async (itemId, size, color) => {
        const previousCart = structuredClone(cartItems);

        const newCart = structuredClone(cartItems);

        if (
            newCart[itemId] &&
            newCart[itemId][size] &&
            newCart[itemId][size][color]
        ) {
            delete newCart[itemId][size][color];

            if (Object.keys(newCart[itemId][size]).length === 0) {
                delete newCart[itemId][size];
            }

            if (Object.keys(newCart[itemId]).length === 0) {
                delete newCart[itemId];
            }
        }

        setCartItems(newCart);

        try {
            const response = await removeCartItem({
                itemId,
                size,
                color,
            });

            if (!response.success) {
                setCartItems(previousCart);

                toast.error(response.message || "Unable to remove product");
            }
        } catch (error) {
            console.log("Remove Cart Error:", error);

            setCartItems(previousCart);

            toast.error(
                error.response?.data?.message || "Unable to remove product",
            );
        }
    };

    // =========================
    // CLEAR CART
    // =========================

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

                if (typeof sizeData === "object" && sizeData !== null) {
                    for (const color in sizeData) {
                        totalCount += Number(sizeData[color]) || 0;
                    }
                } else {
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
            const itemInfo = getProduct(itemId);

            if (!itemInfo) continue;

            for (const size in cartItems[itemId]) {
                const sizeData = cartItems[itemId][size];

                if (typeof sizeData === "object" && sizeData !== null) {
                    for (const color in sizeData) {
                        const quantity = Number(sizeData[color]) || 0;

                        if (quantity > 0) {
                            totalAmount += itemInfo.price * quantity;
                        }
                    }
                } else {
                    const quantity = Number(sizeData) || 0;

                    if (quantity > 0) {
                        totalAmount += itemInfo.price * quantity;
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

    // =========================
    // CONTEXT
    // =========================

    return (
        <CartContext.Provider
            value={{
                products,
                cartItems,
                loading,

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
