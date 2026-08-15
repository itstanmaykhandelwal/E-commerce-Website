import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { toast } from "react-toastify";

import JustValidate from "just-validate";

import Title from "../components/Title";

import CartTotal from "../components/CartTotal";

import { assets } from "../assets/assets";

// CUSTOM HOOKS
import useCart from "../hooks/useCart";

import useProducts from "../hooks/useProducts";

import useAuth from "../hooks/useAuth";

// SERVICES
import {
    placeCodOrder,
    placeStripeOrder,
    placeRazorpayOrder,
    verifyRazorpayPayment,
} from "../services/orderService";

// CONSTANTS
import { deliveryFee } from "../utils/constants";

const PlaceOrder = () => {
    // =========================
    // AUTH
    // =========================

    const { token } = useAuth();

    // =========================
    // PRODUCTS
    // =========================

    const { products } = useProducts();

    // =========================
    // CART
    // =========================

    const {
        cartItems,
        clearCart,
        getCartAmount,
    } = useCart();

    // =========================
    // STATES
    // =========================

    const [method, setMethod] =
        useState("cod");

    const [loading, setLoading] =
        useState(false);

    const [formData, setFormData] =
        useState({
            firstName: "",
            lastName: "",
            email: "",
            street: "",
            city: "",
            state: "",
            zipcode: "",
            phone: "",
        });

    // =========================
    // LAST ADDRESS
    // =========================

    const [lastAddress] = useState(
        JSON.parse(
            localStorage.getItem(
                "lastAddress"
            )
        ) || null
    );

    // =========================
    // REFS
    // =========================

    const formRef = useRef(null);

    const validateRef = useRef(null);

    // =========================
    // TOTAL
    // =========================

    const totalAmount = useMemo(() => {
        return (
            getCartAmount() +
            deliveryFee
        );
    }, [cartItems, getCartAmount]);

    // =========================
    // HANDLE CHANGE
    // =========================

    const onChangeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value,
        });
    };

    // =========================
    // VALIDATION
    // =========================

    useEffect(() => {
        if (!formRef.current) return;

        if (validateRef.current) {
            validateRef.current.destroy();
        }

        const validate =
            new JustValidate(
                formRef.current,
                {
                    errorFieldCssClass:
                        "border-red-500",

                    errorLabelCssClass:
                        "text-red-500 text-xs sm:text-sm mt-1",

                    focusInvalidField: true,
                }
            );

        const fields = [
            "firstName",
            "lastName",
            "email",
            "street",
            "city",
            "state",
            "zipcode",
            "phone",
        ];

        fields.forEach((field) => {
            validate.addField(
                `#${field}`,
                [
                    {
                        rule: "required",
                        errorMessage: `${field} required`,
                    },
                ],
                {
                    errorsContainer: `#${field}-error`,
                }
            );
        });

        validate.onSuccess(() => {
            onSubmitHandler();
        });

        validateRef.current =
            validate;

        return () =>
            validate.destroy();
    }, [formData]);

    // =========================
    // INIT RAZORPAY
    // =========================

    const initPay = (order) => {
        const options = {
            key: import.meta.env
                .VITE_RAZORPAY_KEY_ID,

            amount: order.amount,

            currency: order.currency,

            name: "Order Payment",

            order_id: order.id,

            handler: async function (
                response
            ) {
                try {
                    const data =
                        await verifyRazorpayPayment(
                            response
                        );

                    if (data.success) {
                        clearCart();

                        window.location.href =
                            "/orders";
                    } else {
                        toast.error(
                            data.message
                        );
                    }
                } catch {
                    toast.error(
                        "Payment verification failed"
                    );
                }
            },
        };

        const rzp =
            new window.Razorpay(
                options
            );

        rzp.open();
    };

    // =========================
    // SUBMIT ORDER
    // =========================

    const onSubmitHandler =
        async () => {
            try {
                setLoading(true);

                let orderItems = [];

                // PREPARE ORDER ITEMS
                for (const itemId in cartItems) {
                    for (const size in cartItems[
                        itemId
                    ]) {
                        for (const color in cartItems[
                            itemId
                        ][size]) {
                            const quantity =
                                cartItems[
                                    itemId
                                ][size][
                                    color
                                ];

                            if (
                                quantity >
                                0
                            ) {
                                const itemInfo =
                                    structuredClone(
                                        products.find(
                                            (
                                                product
                                            ) =>
                                                product._id ===
                                                itemId
                                        )
                                    );

                                if (
                                    itemInfo
                                ) {
                                    itemInfo.size =
                                        size;

                                    itemInfo.color =
                                        color;

                                    itemInfo.quantity =
                                        quantity;

                                    orderItems.push(
                                        itemInfo
                                    );
                                }
                            }
                        }
                    }
                }

                const orderData = {
                    address: formData,

                    items: orderItems,

                    amount: totalAmount,
                };

                // =========================
                // COD
                // =========================

                if (
                    method === "cod"
                ) {
                    const data =
                        await placeCodOrder(
                            orderData
                        );

                    if (data.success) {
                        toast.success(
                            "Order placed successfully"
                        );

                        clearCart();

                        localStorage.setItem(
                            "lastAddress",
                            JSON.stringify(
                                formData
                            )
                        );

                        setTimeout(() => {
                            window.location.href =
                                "/orders";
                        }, 1000);

                        return;
                    } else {
                        toast.error(
                            data.message ||
                                "Failed to place order"
                        );

                        return;
                    }
                }

                // =========================
                // STRIPE
                // =========================

                if (
                    method ===
                    "stripe"
                ) {
                    const data =
                        await placeStripeOrder(
                            {
                                ...orderData,

                                frontendUrl:
                                    window
                                        .location
                                        .origin,
                            }
                        );

                    if (
                        data.success
                    ) {
                        window.location.replace(
                            data.session_url
                        );
                    }
                }

                // =========================
                // RAZORPAY
                // =========================

                if (
                    method ===
                    "razorpay"
                ) {
                    const data =
                        await placeRazorpayOrder(
                            orderData
                        );

                    if (
                        data.success
                    ) {
                        initPay(
                            data.order
                        );
                    }
                }
            } catch (error) {
                console.log(error);

                toast.error(
                    "Failed to place order"
                );
            } finally {
                setLoading(false);
            }
        };

    // =========================
    // USE LAST ADDRESS
    // =========================

    const useLastAddress = () => {
        if (lastAddress) {
            setFormData(lastAddress);

            toast.success(
                "Address loaded"
            );
        }
    };

    return (
        <form
            ref={formRef}
            noValidate
            className="
                min-h-screen
                bg-white
                pt-[90px]
                sm:pt-[110px]
                lg:pt-[140px]
                px-4
                sm:px-6
                lg:px-8
                pb-10
                sm:pb-14
            "
        >
            <div
                className="
                    max-w-7xl
                    mx-auto
                    flex
                    flex-col
                    lg:flex-row
                    gap-6
                    sm:gap-8
                    lg:gap-12
                "
            >
                {/* =================================================
                    LEFT - DELIVERY INFORMATION
                ================================================== */}

                <div
                    className="
                        flex-1
                        bg-white
                        p-5
                        sm:p-6
                        lg:p-8
                        rounded-2xl
                        sm:rounded-3xl
                        border
                        border-gray-200
                        shadow-lg
                    "
                >
                    <Title
                        text1="DELIVERY"
                        text2="INFORMATION"
                    />

                    <div
                        className="
                            mt-5
                            sm:mt-6
                            space-y-4
                            sm:space-y-5
                        "
                    >
                        {/* FIRST + LAST NAME */}

                        <div
                            className="
                                flex
                                flex-col
                                sm:flex-row
                                gap-4
                            "
                        >
                            {[
                                "firstName",
                                "lastName",
                            ].map(
                                (field) => (
                                    <div
                                        key={
                                            field
                                        }
                                        className="w-full"
                                    >
                                        <input
                                            id={
                                                field
                                            }
                                            name={
                                                field
                                            }
                                            value={
                                                formData[
                                                    field
                                                ]
                                            }
                                            onChange={
                                                onChangeHandler
                                            }
                                            placeholder={
                                                field ===
                                                "firstName"
                                                    ? "First Name"
                                                    : "Last Name"
                                            }
                                            className="
                                                border
                                                border-gray-300
                                                px-4
                                                py-3
                                                sm:py-3.5
                                                rounded-xl
                                                w-full
                                                text-sm
                                                sm:text-base
                                                focus:ring-2
                                                focus:ring-black
                                                focus:border-black
                                                outline-none
                                                transition
                                            "
                                        />

                                        <div
                                            id={`${field}-error`}
                                        ></div>
                                    </div>
                                )
                            )}
                        </div>

                        {/* OTHER FIELDS */}

                        {[
                            "email",
                            "street",
                            "city",
                            "state",
                            "zipcode",
                            "phone",
                        ].map(
                            (field) => (
                                <div
                                    key={
                                        field
                                    }
                                >
                                    <input
                                        id={
                                            field
                                        }
                                        name={
                                            field
                                        }
                                        value={
                                            formData[
                                                field
                                            ]
                                        }
                                        onChange={
                                            onChangeHandler
                                        }
                                        placeholder={
                                            field
                                                .charAt(
                                                    0
                                                )
                                                .toUpperCase() +
                                            field.slice(
                                                1
                                            )
                                        }
                                        className="
                                            border
                                            border-gray-300
                                            px-4
                                            py-3
                                            sm:py-3.5
                                            rounded-xl
                                            w-full
                                            text-sm
                                            sm:text-base
                                            focus:ring-2
                                            focus:ring-black
                                            focus:border-black
                                            outline-none
                                            transition
                                        "
                                    />

                                    <div
                                        id={`${field}-error`}
                                    ></div>
                                </div>
                            )
                        )}
                    </div>

                    {/* =================================================
                        LAST ADDRESS
                    ================================================== */}

                    {lastAddress && (
                        <div
                            className="
                                mt-6
                                sm:mt-8
                                p-4
                                sm:p-6
                                bg-gradient-to-br
                                from-sky-50
                                to-slate-100
                                rounded-2xl
                                border
                                border-gray-200
                            "
                        >
                            <p className="font-semibold mb-3 text-sm sm:text-base text-[#1E3A5F]">
                                Use your previous
                                address?
                            </p>

                            <button
                                type="button"
                                onClick={
                                    useLastAddress
                                }
                                className="
                                    w-full
                                    sm:w-auto
                                    bg-black
                                    hover:bg-neutral-800
                                    text-white
                                    px-5
                                    sm:px-6
                                    py-2.5
                                    sm:py-2
                                    rounded-xl
                                    transition-all
                                    duration-300
                                    text-sm
                                    sm:text-base
                                    font-medium
                                "
                            >
                                Use Last Address
                            </button>
                        </div>
                    )}
                </div>

                {/* =================================================
                    RIGHT - ORDER + PAYMENT
                ================================================== */}

                <div
                    className="
                        w-full
                        lg:w-[420px]
                        bg-white
                        p-5
                        sm:p-6
                        lg:p-8
                        rounded-2xl
                        sm:rounded-3xl
                        border
                        border-gray-200
                        shadow-lg
                        h-fit
                    "
                >
                    {/* CART TOTAL */}

                    <CartTotal
                        totalAmount={
                            getCartAmount()
                        }
                    />

                    {/* PAYMENT */}

                    <div
                        className="
                            mt-6
                            sm:mt-8
                            space-y-3
                            sm:space-y-4
                        "
                    >
                        <Title
                            text1="PAYMENT"
                            text2="METHOD"
                        />

                        {/* PAYMENT OPTIONS */}

                        {[
                            {
                                key: "stripe",
                                label: assets.stripe_logo,
                            },
                            {
                                key: "razorpay",
                                label: assets.razorpay_logo,
                            },
                            {
                                key: "cod",
                                label: "Cash On Delivery",
                            },
                        ].map(
                            (option) => (
                                <div
                                    key={
                                        option.key
                                    }
                                    onClick={() =>
                                        setMethod(
                                            option.key
                                        )
                                    }
                                    className={`
                                        flex
                                        items-center
                                        gap-3
                                        sm:gap-4
                                        p-3.5
                                        sm:p-4
                                        rounded-xl
                                        border
                                        cursor-pointer
                                        transition-all
                                        duration-300
                                        ${
                                            method ===
                                            option.key
                                                ? "border-black bg-slate-50"
                                                : "border-gray-300 hover:border-black"
                                        }
                                    `}
                                >
                                    {/* RADIO */}

                                    <div
                                        className={`
                                            w-4
                                            h-4
                                            rounded-full
                                            border
                                            flex-shrink-0
                                            ${
                                                method ===
                                                option.key
                                                    ? "bg-black border-black"
                                                    : "border-gray-400"
                                            }
                                        `}
                                    />

                                    {/* PAYMENT LABEL */}

                                    {option.key ===
                                    "cod" ? (
                                        <p className="text-sm font-medium text-slate-700">
                                            {
                                                option.label
                                            }
                                        </p>
                                    ) : (
                                        <img
                                            className="
                                                h-5
                                                sm:h-6
                                                max-w-[130px]
                                                object-contain
                                            "
                                            src={
                                                option.label
                                            }
                                            alt="payment"
                                        />
                                    )}
                                </div>
                            )
                        )}

                        {/* =================================================
                            PLACE ORDER
                        ================================================== */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                mt-4
                                sm:mt-6
                                bg-black
                                hover:bg-neutral-800
                                text-white
                                py-3
                                sm:py-3.5
                                rounded-xl
                                sm:rounded-2xl
                                font-semibold
                                text-sm
                                sm:text-base
                                hover:scale-[1.02]
                                transition-all
                                duration-300
                                disabled:opacity-60
                                disabled:cursor-not-allowed
                                disabled:hover:scale-100
                            "
                        >
                            {loading
                                ? "Processing..."
                                : "PLACE ORDER"}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;