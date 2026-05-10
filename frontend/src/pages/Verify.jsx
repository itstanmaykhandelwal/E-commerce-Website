import React, { useEffect } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { toast } from "react-toastify";

import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

// CUSTOM HOOK
import useAuth from "../hooks/useAuth";

import useCart from "../hooks/useCart";

// SERVICES
import { verifyStripePayment } from "../services/orderService";

const Verify = () => {
    const navigate = useNavigate();

    // AUTH
    const { token } = useAuth();

    // CART
    const { clearCart } = useCart();

    // SEARCH PARAMS
    const [searchParams] = useSearchParams();

    const success = searchParams.get("success");

    const orderId = searchParams.get("orderId");

    // VERIFY PAYMENT
    const verifyPayment = async () => {
        try {
            if (!token) return;

            const data = await verifyStripePayment({
                success,
                orderId,
            });

            if (data.success) {
                clearCart();

                toast.success("Payment verified successfully");

                setTimeout(() => {
                    navigate("/orders");
                }, 1500);
            } else {
                toast.error(data.message || "Payment verification failed");

                setTimeout(() => {
                    navigate("/cart");
                }, 1500);
            }
        } catch (error) {
            console.log(error);

            toast.error(
                error?.response?.data?.message || "Something went wrong",
            );

            setTimeout(() => {
                navigate("/cart");
            }, 1500);
        }
    };

    // VERIFY ON LOAD
    useEffect(() => {
        verifyPayment();
    }, [token]);

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4 relative overflow-hidden">
            {/* BACKGROUND BLOBS */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-sky-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

            <div className="absolute bottom-0 right-0 w-72 h-72 bg-slate-200 rounded-full blur-3xl opacity-40 pointer-events-none" />

            {/* CARD */}
            <div className="relative bg-white border border-gray-200 shadow-xl rounded-3xl px-10 py-12 max-w-lg w-full text-center">
                {/* LOADER */}
                <div className="relative flex items-center justify-center mb-8">
                    <div className="w-20 h-20 border-4 border-black border-t-transparent rounded-full animate-spin"></div>

                    <div className="absolute">
                        {success === "true" ? (
                            <FiCheckCircle className="w-8 h-8 text-[#0F766E]" />
                        ) : (
                            <FiAlertCircle className="w-8 h-8 text-red-500" />
                        )}
                    </div>
                </div>

                {/* TITLE */}
                <h2 className="text-3xl font-bold text-[#1E3A5F] mb-3">
                    Verifying Payment...
                </h2>

                {/* DESCRIPTION */}
                <p className="text-slate-500 text-center leading-relaxed">
                    Please wait while we securely verify your payment and
                    confirm your order details.
                </p>

                {/* ORDER ID */}
                {orderId && (
                    <div className="mt-8 inline-flex items-center gap-2 bg-slate-100 border border-gray-200 rounded-full px-5 py-2 text-sm text-slate-700">
                        <span className="font-semibold">Order ID:</span>

                        <span className="truncate max-w-[180px]">
                            {orderId}
                        </span>
                    </div>
                )}

                {/* SECURITY BADGE */}
                <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2 bg-sky-50 border border-sky-100 text-[#1E3A5F] px-4 py-2 rounded-full text-sm font-medium">
                        🔒 Secure Payment Verification
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Verify;
