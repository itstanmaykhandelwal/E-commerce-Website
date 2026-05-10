// Cart.jsx

import React, { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import Title from "../components/Title";

import CartTotal from "../components/CartTotal";

import { toast } from "react-toastify";

import RippleButton from "../components/RippleButton";

// CUSTOM HOOKS
import useProducts from "../hooks/useProducts";

import useCart from "../hooks/useCart";

import useAuth from "../hooks/useAuth";

// CONSTANTS
import { currency } from "../utils/constants";

const Cart = () => {
    const navigate = useNavigate();

    // PRODUCTS
    const { products } = useProducts();

    // CART
    const { cartItems, updateCart, removeFromCart, updateQuantity } = useCart();

    // AUTH
    const { isAuthenticated } = useAuth();

    // CART DATA
    const [cartData, setCartData] = useState([]);

    // PREPARE CART DATA
    useEffect(() => {
        const tempData = [];

        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                const sizeData = cartItems[itemId][size];

                // COLOR OBJECT
                if (typeof sizeData === "object" && sizeData !== null) {
                    for (const color in sizeData) {
                        const quantity = sizeData[color];

                        if (Number(quantity) > 0) {
                            tempData.push({
                                _id: itemId,
                                size,
                                color,
                                quantity: Number(quantity),
                            });
                        }
                    }
                }

                // DIRECT NUMBER
                else {
                    if (Number(sizeData) > 0) {
                        tempData.push({
                            _id: itemId,
                            size,
                            color: "default",
                            quantity: Number(sizeData),
                        });
                    }
                }
            }
        }

        setCartData(tempData);
    }, [cartItems]);

    // CART TOTAL
    const totalAmount = useMemo(() => {
        let total = 0;

        cartData.forEach((item) => {
            const productData = products.find(
                (product) => product._id === item._id,
            );

            if (productData) {
                total += Number(productData.price) * Number(item.quantity);
            }
        });

        return total;
    }, [cartData, products]);

    return (
        <div className="min-h-screen pt-[150px] px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* TITLE */}
                <div className="text-3xl mb-10 text-center">
                    <Title text1={"YOUR"} text2={"CART"} />
                </div>

                {/* EMPTY CART */}
                {cartData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-gradient-to-br from-sky-50 to-slate-100 rounded-3xl border border-gray-200 shadow-sm">
                        <div className="w-24 h-24 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm mb-6">
                            <svg
                                className="w-12 h-12 text-[#1E3A5F]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.8}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13L5.4 5M16 19a1 1 0 100 2 1 1 0 000-2zm-8 0a1 1 0 100 2 1 1 0 000-2z"
                                />
                            </svg>
                        </div>

                        <p className="text-lg text-slate-600 mb-6 max-w-md leading-relaxed">
                            Your cart is empty. Add some products to continue
                            shopping.
                        </p>

                        <RippleButton onClick={() => navigate("/collection")}>
                            ADD PRODUCTS
                        </RippleButton>
                    </div>
                ) : (
                    <>
                        {/* CART ITEMS */}
                        <div className="space-y-6">
                            {cartData.map((item) => {
                                const productData = products.find(
                                    (product) => product._id === item._id,
                                );

                                if (!productData) return null;

                                return (
                                    <div
                                        key={`${item._id}-${item.size}-${item.color}`}
                                        className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-lg transition-all duration-300"
                                    >
                                        {/* PRODUCT IMAGE */}
                                        <div className="bg-gradient-to-br from-slate-50 to-sky-50 p-2 rounded-2xl border border-gray-100">
                                            <img
                                                src={productData.image?.[0]}
                                                alt={productData.name}
                                                className="w-28 h-28 object-cover rounded-xl"
                                            />
                                        </div>

                                        {/* PRODUCT INFO */}
                                        <div className="flex-1 space-y-2">
                                            <h3 className="text-lg font-semibold text-slate-900">
                                                {productData.name}
                                            </h3>

                                            <p className="text-slate-600">
                                                Size: {item.size}
                                            </p>

                                            <p className="text-slate-600">
                                                Color: {item.color}
                                            </p>

                                            <p className="text-[#1E3A5F] font-bold text-lg">
                                                {currency}
                                                {productData.price}
                                            </p>
                                        </div>

                                        {/* QUANTITY */}
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => {
                                                    updateQuantity(
                                                        item._id,
                                                        item.size,
                                                        item.color,
                                                        item.quantity - 1,
                                                    );
                                                }}
                                                className="w-10 h-10 rounded-xl border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300"
                                            >
                                                -
                                            </button>

                                            <span className="font-bold text-lg min-w-[30px] text-center text-slate-900">
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() => {
                                                    updateQuantity(
                                                        item._id,
                                                        item.size,
                                                        item.color,
                                                        item.quantity + 1,
                                                    );
                                                }}
                                                className="w-10 h-10 rounded-xl border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* REMOVE */}
                                        <button
                                            onClick={() => {
                                                removeFromCart(
                                                    item._id,
                                                    item.size,
                                                    item.color,
                                                );
                                            }}
                                            className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 shadow-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* TOTAL + CHECKOUT */}
                        <div className="flex justify-end mt-16">
                            <div className="w-full sm:w-[450px] bg-white p-8 rounded-3xl border border-gray-200 shadow-lg">
                                <CartTotal totalAmount={totalAmount} />

                                <div className="mt-6">
                                    <RippleButton
                                        onClick={() => {
                                            if (cartData.length === 0) {
                                                toast.error(
                                                    "Product is not available in cart",
                                                );
                                            } else if (!isAuthenticated) {
                                                toast.info(
                                                    "Please login first",
                                                );

                                                navigate("/login");
                                            } else {
                                                navigate("/place-order");
                                            }
                                        }}
                                    >
                                        PROCEED TO CHECKOUT
                                    </RippleButton>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;
