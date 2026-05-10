import { useContext } from "react";

import { CartContext } from "../context/CartContext";

const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }

    const {
        cartItems,
        addToCart,
        updateCart,
        removeFromCart,
        getCartCount,
        getCartAmount,
        clearCart,
    } = context;

    // UPDATE QUANTITY
    const updateQuantity = async (itemId, size, color, quantity) => {
        try {
            // REMOVE IF 0
            if (quantity <= 0) {
                return removeFromCart(itemId, size, color);
            }

            // UPDATE
            await updateCart(itemId, size, color, quantity);
        } catch (error) {
            console.log(error);
        }
    };

    return {
        cartItems,
        addToCart,
        updateCart,
        removeFromCart,
        updateQuantity,
        getCartCount,
        getCartAmount,
        clearCart,
    };
};

export default useCart;
