import api from "../lib/axios";

// =========================
// GET CART DATA
// =========================

export const getCartData = async () => {
    try {

        const response = await api.post("/api/cart/get");

        return response.data;

    } catch (error) {

        console.log(error);

        throw error;

    }
};

// =========================
// ADD TO CART
// =========================

export const addItemToCart = async (cartData) => {
    try {

        const response = await api.post(
            "/api/cart/add",
            cartData
        );

        return response.data;

    } catch (error) {

        console.log(error);

        throw error;

    }
};

// =========================
// UPDATE CART
// =========================

export const updateCartItem = async (cartData) => {
    try {

        const response = await api.post(
            "/api/cart/update",
            cartData
        );

        return response.data;

    } catch (error) {

        console.log(error);

        throw error;

    }
};

// =========================
// REMOVE CART ITEM
// =========================

// export const removeCartItem = async (cartData) => {
//     try {

//         const response = await api.post(
//             "/api/cart/remove",
//             cartData
//         );

//         return response.data;

//     } catch (error) {

//         console.log(error);

//         throw error;

//     }
// };