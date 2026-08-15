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

    // =========================
    // PRODUCTS
    // =========================

    const { products } = useProducts();

    // =========================
    // CART
    // =========================

    const {
        cartItems,
        updateCart,
        removeFromCart,
        updateQuantity,
    } = useCart();

    // =========================
    // AUTH
    // =========================

    const { isAuthenticated } = useAuth();

    // =========================
    // CART DATA
    // =========================

    const [cartData, setCartData] = useState([]);

    // =========================
    // PREPARE CART DATA
    // =========================

    useEffect(() => {
        const tempData = [];

        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                const sizeData =
                    cartItems[itemId][size];

                // COLOR OBJECT
                if (
                    typeof sizeData ===
                        "object" &&
                    sizeData !== null
                ) {
                    for (const color in sizeData) {
                        const quantity =
                            sizeData[color];

                        if (
                            Number(quantity) > 0
                        ) {
                            tempData.push({
                                _id: itemId,
                                size,
                                color,
                                quantity:
                                    Number(
                                        quantity
                                    ),
                            });
                        }
                    }
                }

                // DIRECT NUMBER
                else {
                    if (
                        Number(sizeData) > 0
                    ) {
                        tempData.push({
                            _id: itemId,
                            size,
                            color: "default",
                            quantity:
                                Number(
                                    sizeData
                                ),
                        });
                    }
                }
            }
        }

        setCartData(tempData);
    }, [cartItems]);

    // =========================
    // CART TOTAL
    // =========================

    const totalAmount = useMemo(() => {
        let total = 0;

        cartData.forEach((item) => {
            const productData =
                products.find(
                    (product) =>
                        product._id === item._id
                );

            if (productData) {
                total +=
                    Number(productData.price) *
                    Number(item.quantity);
            }
        });

        return total;
    }, [cartData, products]);

    // =========================
    // INCREASE QUANTITY
    // =========================

    const handleIncrease = (
        item,
        productData
    ) => {
        const stock =
            Number(productData.quantity) || 0;

        if (item.quantity >= stock) {
            toast.error(
                `Only ${stock} item(s) available`
            );

            return;
        }

        updateQuantity(
            item._id,
            item.size,
            item.color,
            item.quantity + 1
        );
    };

    // =========================
    // DECREASE QUANTITY
    // =========================

    const handleDecrease = (item) => {
        if (item.quantity <= 1) {
            removeFromCart(
                item._id,
                item.size,
                item.color
            );

            return;
        }

        updateQuantity(
            item._id,
            item.size,
            item.color,
            item.quantity - 1
        );
    };

    // =========================
    // CHECKOUT
    // =========================

    const handleCheckout = () => {
        if (cartData.length === 0) {
            toast.error(
                "Product is not available in cart"
            );

            return;
        }

        if (!isAuthenticated) {
            toast.info(
                "Please login first"
            );

            navigate("/login");

            return;
        }

        navigate("/place-order");
    };

    return (
        <div
            className="
                min-h-screen
                pt-[90px]
                sm:pt-[110px]
                lg:pt-[150px]
                px-4
                sm:px-6
                lg:px-8
                pb-12
                sm:pb-16
                bg-white
            "
        >
            <div className="max-w-7xl mx-auto">

                {/* =========================
                    TITLE
                ========================== */}

                <div
                    className="
                        text-center
                        mb-7
                        sm:mb-10
                    "
                >
                    <Title
                        text1="YOUR"
                        text2="CART"
                    />
                </div>

                {/* =========================
                    EMPTY CART
                ========================== */}

                {cartData.length === 0 ? (
                    <div
                        className="
                            flex
                            flex-col
                            items-center
                            justify-center
                            py-16
                            sm:py-24
                            px-5
                            text-center
                            bg-gradient-to-br
                            from-sky-50
                            to-slate-100
                            rounded-2xl
                            sm:rounded-3xl
                            border
                            border-gray-200
                            shadow-sm
                        "
                    >
                        <div
                            className="
                                w-20
                                h-20
                                sm:w-24
                                sm:h-24
                                rounded-full
                                bg-white
                                border
                                border-gray-200
                                flex
                                items-center
                                justify-center
                                shadow-sm
                                mb-5
                                sm:mb-6
                            "
                        >
                            <svg
                                className="
                                    w-10
                                    h-10
                                    sm:w-12
                                    sm:h-12
                                    text-[#1E3A5F]
                                "
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

                        <p
                            className="
                                text-base
                                sm:text-lg
                                text-slate-600
                                mb-5
                                sm:mb-6
                                max-w-md
                                leading-relaxed
                            "
                        >
                            Your cart is empty.
                            Add some products
                            to continue
                            shopping.
                        </p>

                        <RippleButton
                            onClick={() =>
                                navigate(
                                    "/collection"
                                )
                            }
                        >
                            ADD PRODUCTS
                        </RippleButton>
                    </div>
                ) : (
                    <>
                        {/* =========================
                            CART ITEMS
                        ========================== */}

                        <div
                            className="
                                space-y-3
                                sm:space-y-5
                                lg:space-y-6
                            "
                        >
                            {cartData.map(
                                (item) => {
                                    const productData =
                                        products.find(
                                            (
                                                product
                                            ) =>
                                                product._id ===
                                                item._id
                                        );

                                    if (
                                        !productData
                                    ) {
                                        return null;
                                    }

                                    return (
                                        <div
                                            key={`${item._id}-${item.size}-${item.color}`}
                                            className="
                                                bg-white
                                                rounded-2xl
                                                sm:rounded-3xl
                                                border
                                                border-gray-200
                                                shadow-sm
                                                p-3.5
                                                sm:p-5
                                                lg:p-6
                                                flex
                                                flex-col
                                                sm:flex-row
                                                sm:items-center
                                                gap-4
                                                sm:gap-5
                                                lg:gap-6
                                                hover:shadow-lg
                                                transition-all
                                                duration-300
                                            "
                                        >
                                            {/* =====================
                                                PRODUCT TOP
                                            ====================== */}

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                    sm:gap-5
                                                    flex-1
                                                    min-w-0
                                                "
                                            >
                                                {/* IMAGE */}

                                                <div
                                                    className="
                                                        bg-gradient-to-br
                                                        from-slate-50
                                                        to-sky-50
                                                        p-1.5
                                                        sm:p-2
                                                        rounded-xl
                                                        sm:rounded-2xl
                                                        border
                                                        border-gray-100
                                                        flex-shrink-0
                                                    "
                                                >
                                                    <img
                                                        src={
                                                            productData
                                                                .image?.[0]
                                                        }
                                                        alt={
                                                            productData.name
                                                        }
                                                        className="
                                                            w-20
                                                            h-20
                                                            sm:w-24
                                                            sm:h-24
                                                            lg:w-28
                                                            lg:h-28
                                                            object-cover
                                                            rounded-lg
                                                            sm:rounded-xl
                                                        "
                                                    />
                                                </div>

                                                {/* PRODUCT INFO */}

                                                <div
                                                    className="
                                                        flex-1
                                                        min-w-0
                                                        space-y-1.5
                                                        sm:space-y-2
                                                    "
                                                >
                                                    <h3
                                                        className="
                                                            text-sm
                                                            sm:text-base
                                                            lg:text-lg
                                                            font-semibold
                                                            text-slate-900
                                                            line-clamp-2
                                                        "
                                                    >
                                                        {
                                                            productData.name
                                                        }
                                                    </h3>

                                                    <div
                                                        className="
                                                            flex
                                                            flex-wrap
                                                            items-center
                                                            gap-x-3
                                                            gap-y-1
                                                            text-xs
                                                            sm:text-sm
                                                        "
                                                    >
                                                        <p className="text-slate-600">
                                                            Size:{" "}
                                                            <span className="text-slate-800 font-medium">
                                                                {
                                                                    item.size
                                                                }
                                                            </span>
                                                        </p>

                                                        <p className="text-slate-600">
                                                            Color:{" "}
                                                            <span className="text-slate-800 font-medium capitalize">
                                                                {
                                                                    item.color
                                                                }
                                                            </span>
                                                        </p>
                                                    </div>

                                                    <p
                                                        className="
                                                            text-[#1E3A5F]
                                                            font-bold
                                                            text-base
                                                            sm:text-lg
                                                        "
                                                    >
                                                        {
                                                            currency
                                                        }
                                                        {
                                                            productData.price
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            {/* =====================
                                                CONTROLS
                                            ====================== */}

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    sm:justify-end
                                                    gap-3
                                                    sm:gap-5
                                                    w-full
                                                    sm:w-auto
                                                    border-t
                                                    sm:border-t-0
                                                    pt-3
                                                    sm:pt-0
                                                "
                                            >
                                                {/* QUANTITY */}

                                                <div className="flex items-center gap-1.5 sm:gap-3">

                                                    <button
                                                        onClick={() =>
                                                            handleDecrease(
                                                                item
                                                            )
                                                        }
                                                        className="
                                                            w-9
                                                            h-9
                                                            sm:w-10
                                                            sm:h-10
                                                            rounded-lg
                                                            sm:rounded-xl
                                                            border
                                                            border-gray-300
                                                            hover:border-black
                                                            hover:bg-black
                                                            hover:text-white
                                                            transition-all
                                                            duration-300
                                                        "
                                                    >
                                                        -
                                                    </button>

                                                    <span
                                                        className="
                                                            font-bold
                                                            text-base
                                                            sm:text-lg
                                                            min-w-[24px]
                                                            sm:min-w-[30px]
                                                            text-center
                                                            text-slate-900
                                                        "
                                                    >
                                                        {
                                                            item.quantity
                                                        }
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            handleIncrease(
                                                                item,
                                                                productData
                                                            )
                                                        }
                                                        className="
                                                            w-9
                                                            h-9
                                                            sm:w-10
                                                            sm:h-10
                                                            rounded-lg
                                                            sm:rounded-xl
                                                            border
                                                            border-gray-300
                                                            hover:border-black
                                                            hover:bg-black
                                                            hover:text-white
                                                            transition-all
                                                            duration-300
                                                        "
                                                    >
                                                        +
                                                    </button>

                                                </div>

                                                {/* REMOVE */}

                                                <button
                                                    onClick={() =>
                                                        removeFromCart(
                                                            item._id,
                                                            item.size,
                                                            item.color
                                                        )
                                                    }
                                                    className="
                                                        px-3.5
                                                        sm:px-5
                                                        py-2
                                                        sm:py-2.5
                                                        bg-red-500
                                                        hover:bg-red-600
                                                        text-white
                                                        text-xs
                                                        sm:text-sm
                                                        font-medium
                                                        rounded-lg
                                                        sm:rounded-xl
                                                        transition-all
                                                        duration-300
                                                        shadow-sm
                                                    "
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>

                        {/* =========================
                            TOTAL + CHECKOUT
                        ========================== */}

                        <div
                            className="
                                flex
                                justify-end
                                mt-8
                                sm:mt-12
                                lg:mt-16
                            "
                        >
                            <div
                                className="
                                    w-full
                                    sm:w-[450px]
                                    bg-white
                                    p-5
                                    sm:p-7
                                    lg:p-8
                                    rounded-2xl
                                    sm:rounded-3xl
                                    border
                                    border-gray-200
                                    shadow-lg
                                "
                            >
                                <CartTotal
                                    totalAmount={
                                        totalAmount
                                    }
                                />

                                <div className="mt-5 sm:mt-6">
                                    <RippleButton
                                        onClick={
                                            handleCheckout
                                        }
                                        className="w-full"
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