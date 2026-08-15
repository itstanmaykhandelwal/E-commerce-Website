import React from "react";

import useCart from "../hooks/useCart";

import { currency } from "../utils/constants";

const CartTotal = ({ totalAmount }) => {
    const { getCartCount } = useCart();

    const shippingFee = totalAmount > 0 ? 40 : 0;

    const finalTotal = totalAmount + shippingFee;

    return (
        <div>
            {/* =========================
                TITLE
            ========================== */}

            <div className="text-xl sm:text-2xl">
                <div className="inline-flex gap-2 items-center mb-5 sm:mb-8">
                    <p className="text-slate-700 font-semibold">
                        CART
                    </p>

                    <p className="text-[#1E3A5F] font-bold">
                        TOTALS
                    </p>

                    <span className="w-10 sm:w-16 h-[2px] bg-black"></span>
                </div>
            </div>

            {/* =========================
                TOTAL BOX
            ========================== */}

            <div
                className="
                    flex
                    flex-col
                    gap-3
                    sm:gap-4
                    text-sm
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    sm:rounded-3xl
                    p-5
                    sm:p-7
                    lg:p-10
                    shadow-sm
                "
            >
                {/* TOTAL ITEMS */}

                <div className="flex justify-between items-center gap-4">
                    <p className="text-slate-600">
                        Total Items
                    </p>

                    <p className="font-semibold text-slate-900">
                        {getCartCount()}
                    </p>
                </div>

                <hr className="border-gray-200" />

                {/* SUBTOTAL */}

                <div className="flex justify-between items-center gap-4">
                    <p className="text-slate-600">
                        Subtotal
                    </p>

                    <p className="font-semibold text-slate-900">
                        {currency}
                        {totalAmount.toFixed(2)}
                    </p>
                </div>

                <hr className="border-gray-200" />

                {/* SHIPPING */}

                <div className="flex justify-between items-center gap-4">
                    <p className="text-slate-600">
                        Shipping Fee
                    </p>

                    <p className="font-semibold text-slate-900">
                        {currency}
                        {shippingFee.toFixed(2)}
                    </p>
                </div>

                <hr className="border-gray-200" />

                {/* FINAL TOTAL */}

                <div
                    className="
                        flex
                        justify-between
                        items-center
                        gap-4
                        text-base
                        sm:text-lg
                        font-bold
                        mt-1
                        sm:mt-2
                    "
                >
                    <p className="text-slate-900">
                        Total
                    </p>

                    <p className="text-[#1E3A5F]">
                        {currency}
                        {finalTotal.toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CartTotal;