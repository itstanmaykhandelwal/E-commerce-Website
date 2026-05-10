import api from "../lib/axios";

// ==============================
// GET USER ORDERS
// ==============================

export const getUserOrders = async () => {
    try {
        const response = await api.post("/api/order/userorders");

        return response.data;
    } catch (error) {
        console.log(error);

        throw error;
    }
};

// ==============================
// PLACE COD ORDER
// ==============================

export const placeCodOrder = async (orderData) => {
    try {
        const response = await api.post("/api/order/place", orderData);

        return response.data;
    } catch (error) {
        console.log(error);

        throw error;
    }
};

// ==============================
// PLACE STRIPE ORDER
// ==============================

export const placeStripeOrder = async (orderData) => {
    try {
        const response = await api.post("/api/order/stripe", orderData);

        return response.data;
    } catch (error) {
        console.log(error);

        throw error;
    }
};

// ==============================
// PLACE RAZORPAY ORDER
// ==============================

export const placeRazorpayOrder = async (orderData) => {
    try {
        const response = await api.post("/api/order/razorpay", orderData);

        return response.data;
    } catch (error) {
        console.log(error);

        throw error;
    }
};

// ==============================
// VERIFY RAZORPAY PAYMENT
// ==============================

export const verifyRazorpayPayment = async (paymentData) => {
    try {
        const response = await api.post(
            "/api/order/verifyRazorpay",
            paymentData,
        );

        return response.data;
    } catch (error) {
        console.log(error);

        throw error;
    }
};

// ==============================
// VERIFY STRIPE PAYMENT
// ==============================

export const verifyStripePayment = async (paymentData) => {
    try {
        const response = await api.post("/api/order/verifyStripe", paymentData);

        return response.data;
    } catch (error) {
        console.log(error);

        throw error;
    }
};

// ==============================
// CANCEL ORDER
// ==============================

export const cancelOrder = async ({ orderId, reason }) => {
    try {
        const response = await api.post("/api/order/cancel", {
            orderId,
            reason,
        });

        return response.data;
    } catch (error) {
        console.log(error);

        throw error;
    }
};
