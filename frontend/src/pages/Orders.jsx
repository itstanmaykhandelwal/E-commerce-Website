import React, { useEffect, useMemo, useState } from "react";

import Title from "../components/Title";

import { toast } from "react-toastify";

import {
    FiPackage,
    FiTruck,
    FiCheckCircle,
    FiClock,
    FiXCircle,
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";

// CUSTOM HOOK
import useAuth from "../hooks/useAuth";

// SERVICES
import {
    getUserOrders,
    cancelOrder,
} from "../services/orderService";

// CONSTANTS
import { currency } from "../utils/constants";

const Orders = () => {
    // =========================
    // AUTH
    // =========================

    const { token } = useAuth();

    // =========================
    // STATES
    // =========================

    const [orderData, setOrderData] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [showPopup, setShowPopup] =
        useState(false);

    const [selectedOrderId, setSelectedOrderId] =
        useState(null);

    const [reason, setReason] =
        useState("");

    const [otherReason, setOtherReason] =
        useState("");

    // =========================
    // PAGINATION
    // =========================

    const [currentPage, setCurrentPage] =
        useState(1);

    const itemsPerPage = 10;

    // =========================
    // TRACK MODAL
    // =========================

    const [showTrackModal, setShowTrackModal] =
        useState(false);

    const [trackOrderData, setTrackOrderData] =
        useState(null);

    // =========================
    // CANCEL REASONS
    // =========================

    const cancelReasons = [
        "Ordered by mistake",
        "Found cheaper elsewhere",
        "Delivery time is too long",
        "Don't need the product anymore",
        "Other",
    ];

    // =========================
    // STATUS STEPS
    // =========================

    const statusSteps = [
        {
            key: "Placed",
            label: "Placed",
            icon: FiPackage,
        },
        {
            key: "Packing",
            label: "Packing",
            icon: FiClock,
        },
        {
            key: "Shipped",
            label: "Shipped",
            icon: FiTruck,
        },
        {
            key: "OutForDelivery",
            label: "Out For Delivery",
            icon: FiTruck,
        },
        {
            key: "Delivered",
            label: "Delivered",
            icon: FiCheckCircle,
        },
    ];

    // =========================
    // LOAD ORDERS
    // =========================

    const loadOrderData = async () => {
        try {
            setLoading(true);

            if (!token) return;

            const data =
                await getUserOrders();

            if (data.success) {
                let allOrders = [];

                data.orders.forEach(
                    (order) => {
                        order.items.forEach(
                            (item) => {
                                item.status =
                                    order.status;

                                item.payment =
                                    order.payment;

                                item.paymentMethod =
                                    order.paymentMethod;

                                item.date =
                                    order.date;

                                item.orderId =
                                    order._id;

                                allOrders.push(
                                    item
                                );
                            }
                        );
                    }
                );

                setOrderData(
                    allOrders.reverse()
                );
            }
        } catch (error) {
            console.log(error);

            toast.error(
                "Failed to load orders"
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // CANCEL ORDER
    // =========================

    const handleCancelConfirm =
        async () => {
            const finalReason =
                reason === "Other"
                    ? otherReason
                    : reason;

            if (!finalReason) {
                toast.error(
                    "Please select a reason"
                );

                return;
            }

            try {
                const data =
                    await cancelOrder({
                        orderId:
                            selectedOrderId,

                        reason: finalReason,
                    });

                if (data.success) {
                    toast.success(
                        data.message
                    );

                    setShowPopup(false);

                    setReason("");

                    setOtherReason("");

                    loadOrderData();
                } else {
                    toast.error(
                        data.message
                    );
                }
            } catch (error) {
                console.log(error);

                toast.error(
                    "Something went wrong"
                );
            }
        };

    // =========================
    // TRACK ORDER
    // =========================

    const handleTrackOrder = (
        item
    ) => {
        setTrackOrderData(item);

        setShowTrackModal(true);
    };

    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {
        loadOrderData();
    }, [token]);

    // =========================
    // ACTIVE ORDERS
    // =========================

    const activeOrders = useMemo(() => {
        return orderData.filter(
            (item) =>
                item.status !==
                "Cancelled"
        );
    }, [orderData]);

    // =========================
    // PAGINATION
    // =========================

    const indexOfLastItem =
        currentPage * itemsPerPage;

    const indexOfFirstItem =
        indexOfLastItem -
        itemsPerPage;

    const currentItems =
        activeOrders.slice(
            indexOfFirstItem,
            indexOfLastItem
        );

    const totalPages = Math.ceil(
        activeOrders.length /
            itemsPerPage
    );

    return (
        <div
            className="
                min-h-screen
                pt-[90px]
                sm:pt-[110px]
                lg:pt-[150px]
                px-4
                sm:px-6
                pb-10
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
                        text-xl
                        sm:text-2xl
                        lg:text-3xl
                        mb-7
                        sm:mb-10
                    "
                >
                    <Title
                        text1="MY"
                        text2="ORDERS"
                    />
                </div>

                {/* =========================
                    LOADING
                ========================== */}

                {loading ? (
                    <div className="flex justify-center py-16 sm:py-20">
                        <div
                            className="
                                w-10
                                h-10
                                sm:w-12
                                sm:h-12
                                border-4
                                border-black
                                border-t-transparent
                                rounded-full
                                animate-spin
                            "
                        />
                    </div>
                ) : currentItems.length >
                  0 ? (
                    <>
                        {/* =========================
                            ORDERS
                        ========================== */}

                        <div
                            className="
                                space-y-3
                                sm:space-y-5
                                lg:space-y-6
                            "
                        >
                            {currentItems.map(
                                (
                                    item,
                                    index
                                ) => (
                                    <div
                                        key={
                                            index
                                        }
                                        className="
                                            bg-white
                                            rounded-2xl
                                            sm:rounded-3xl
                                            border
                                            border-gray-200
                                            shadow-sm
                                            p-4
                                            sm:p-5
                                            lg:p-6
                                            hover:shadow-xl
                                            transition-all
                                            duration-300
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                flex-col
                                                lg:flex-row
                                                lg:items-center
                                                lg:justify-between
                                                gap-5
                                                sm:gap-6
                                            "
                                        >
                                            {/* =====================
                                                LEFT
                                            ====================== */}

                                            <div
                                                className="
                                                    flex
                                                    items-start
                                                    gap-3
                                                    sm:gap-5
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
                                                        className="
                                                            w-20
                                                            h-20
                                                            sm:w-24
                                                            sm:h-24
                                                            rounded-lg
                                                            sm:rounded-2xl
                                                            object-cover
                                                        "
                                                        src={
                                                            item
                                                                .image?.[0]
                                                        }
                                                        alt="product"
                                                    />
                                                </div>

                                                {/* INFO */}

                                                <div
                                                    className="
                                                        space-y-1.5
                                                        sm:space-y-2
                                                        min-w-0
                                                    "
                                                >
                                                    <h2
                                                        className="
                                                            text-sm
                                                            sm:text-lg
                                                            font-semibold
                                                            text-slate-900
                                                            line-clamp-2
                                                        "
                                                    >
                                                        {
                                                            item.name
                                                        }
                                                    </h2>

                                                    <div
                                                        className="
                                                            flex
                                                            flex-wrap
                                                            gap-x-3
                                                            gap-y-1
                                                            text-xs
                                                            sm:text-sm
                                                            text-slate-600
                                                        "
                                                    >
                                                        <span>
                                                            {
                                                                currency
                                                            }
                                                            {
                                                                item.price
                                                            }
                                                        </span>

                                                        <span>
                                                            Qty:{" "}
                                                            {
                                                                item.quantity
                                                            }
                                                        </span>

                                                        <span>
                                                            Size:{" "}
                                                            {item.size ||
                                                                "N/A"}
                                                        </span>
                                                    </div>

                                                    <p
                                                        className="
                                                            text-xs
                                                            sm:text-sm
                                                            text-slate-500
                                                        "
                                                    >
                                                        Ordered
                                                        on{" "}
                                                        {new Date(
                                                            item.date
                                                        ).toDateString()}
                                                    </p>

                                                    <p
                                                        className="
                                                            text-xs
                                                            sm:text-sm
                                                            text-slate-500
                                                        "
                                                    >
                                                        Payment:{" "}
                                                        {
                                                            item.paymentMethod
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            {/* =====================
                                                RIGHT
                                            ====================== */}

                                            <div
                                                className="
                                                    flex
                                                    flex-col
                                                    gap-3
                                                    sm:gap-4
                                                    w-full
                                                    lg:w-auto
                                                "
                                            >
                                                {/* STATUS */}

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        justify-start
                                                        lg:justify-end
                                                        gap-2
                                                    "
                                                >
                                                    <span
                                                        className="
                                                            w-2.5
                                                            h-2.5
                                                            sm:w-3
                                                            sm:h-3
                                                            rounded-full
                                                            bg-[#0F766E]
                                                        "
                                                    />

                                                    <span
                                                        className="
                                                            font-medium
                                                            text-sm
                                                            sm:text-base
                                                            text-slate-700
                                                        "
                                                    >
                                                        {
                                                            item.status
                                                        }
                                                    </span>
                                                </div>

                                                {/* BUTTONS */}

                                                <div
                                                    className="
                                                        grid
                                                        grid-cols-2
                                                        sm:flex
                                                        sm:flex-wrap
                                                        gap-2
                                                        sm:gap-3
                                                    "
                                                >
                                                    <button
                                                        onClick={() =>
                                                            handleTrackOrder(
                                                                item
                                                            )
                                                        }
                                                        className="
                                                            px-3
                                                            sm:px-5
                                                            py-2
                                                            sm:py-2.5
                                                            rounded-lg
                                                            sm:rounded-xl
                                                            border
                                                            border-gray-300
                                                            hover:border-black
                                                            hover:bg-black
                                                            hover:text-white
                                                            transition-all
                                                            duration-300
                                                            text-xs
                                                            sm:text-sm
                                                            font-medium
                                                        "
                                                    >
                                                        Track
                                                        Order
                                                    </button>

                                                    {item.status !==
                                                        "Delivered" && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedOrderId(
                                                                    item.orderId
                                                                );

                                                                setShowPopup(
                                                                    true
                                                                );
                                                            }}
                                                            className="
                                                                px-3
                                                                sm:px-5
                                                                py-2
                                                                sm:py-2.5
                                                                rounded-lg
                                                                sm:rounded-xl
                                                                bg-red-500
                                                                hover:bg-red-600
                                                                text-white
                                                                transition-all
                                                                duration-300
                                                                text-xs
                                                                sm:text-sm
                                                                font-medium
                                                            "
                                                        >
                                                            Cancel
                                                            Order
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>

                        {/* =========================
                            PAGINATION
                        ========================== */}

                        {totalPages > 1 && (
                            <div
                                className="
                                    flex
                                    justify-center
                                    items-center
                                    gap-1.5
                                    sm:gap-3
                                    mt-8
                                    sm:mt-10
                                "
                            >
                                {/* PREVIOUS */}

                                <button
                                    disabled={
                                        currentPage ===
                                        1
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (
                                                prev
                                            ) =>
                                                prev -
                                                1
                                        )
                                    }
                                    className="
                                        p-2
                                        border
                                        border-gray-300
                                        rounded-lg
                                        sm:rounded-xl
                                        disabled:opacity-40
                                        hover:border-black
                                        hover:bg-black
                                        hover:text-white
                                        transition
                                    "
                                >
                                    <FiChevronLeft
                                        size={
                                            18
                                        }
                                    />
                                </button>

                                {/* PAGE NUMBERS */}

                                <div
                                    className="
                                        flex
                                        gap-1.5
                                        sm:gap-2
                                    "
                                >
                                    {[
                                        ...Array(
                                            totalPages
                                        ),
                                    ].map(
                                        (
                                            _,
                                            index
                                        ) => (
                                            <button
                                                key={
                                                    index
                                                }
                                                onClick={() =>
                                                    setCurrentPage(
                                                        index +
                                                            1
                                                    )
                                                }
                                                className={`
                                                    w-8
                                                    h-8
                                                    sm:w-10
                                                    sm:h-10
                                                    rounded-lg
                                                    sm:rounded-xl
                                                    text-xs
                                                    sm:text-sm
                                                    transition-all
                                                    duration-300
                                                    ${
                                                        currentPage ===
                                                        index +
                                                            1
                                                            ? "bg-black text-white"
                                                            : "border border-gray-300 hover:border-black"
                                                    }
                                                `}
                                            >
                                                {
                                                    index +
                                                    1
                                                }
                                            </button>
                                        )
                                    )}
                                </div>

                                {/* NEXT */}

                                <button
                                    disabled={
                                        currentPage ===
                                        totalPages
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (
                                                prev
                                            ) =>
                                                prev +
                                                1
                                        )
                                    }
                                    className="
                                        p-2
                                        border
                                        border-gray-300
                                        rounded-lg
                                        sm:rounded-xl
                                        disabled:opacity-40
                                        hover:border-black
                                        hover:bg-black
                                        hover:text-white
                                        transition
                                    "
                                >
                                    <FiChevronRight
                                        size={
                                            18
                                        }
                                    />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    /* =========================
                        EMPTY
                    ========================== */

                    <div
                        className="
                            text-center
                            py-16
                            sm:py-20
                            px-4
                        "
                    >
                        <FiXCircle
                            className="
                                mx-auto
                                text-5xl
                                sm:text-6xl
                                text-slate-300
                                mb-5
                            "
                        />

                        <h2
                            className="
                                text-xl
                                sm:text-2xl
                                font-semibold
                                text-slate-700
                            "
                        >
                            No Orders Found
                        </h2>
                    </div>
                )}

                {/* =================================================
                    TRACK ORDER MODAL
                ================================================== */}

                {showTrackModal &&
                    trackOrderData && (
                        <div
                            className="
                                fixed
                                inset-0
                                z-50
                                flex
                                items-center
                                justify-center
                                bg-black/50
                                px-3
                                sm:px-4
                                py-4
                            "
                        >
                            <div
                                className="
                                    relative
                                    w-full
                                    max-w-2xl
                                    max-h-[90vh]
                                    overflow-y-auto
                                    rounded-2xl
                                    sm:rounded-3xl
                                    bg-white
                                    p-5
                                    sm:p-7
                                    lg:p-8
                                    shadow-2xl
                                    border
                                    border-gray-200
                                "
                            >
                                {/* CLOSE */}

                                <button
                                    onClick={() =>
                                        setShowTrackModal(
                                            false
                                        )
                                    }
                                    className="
                                        absolute
                                        top-3
                                        right-3
                                        sm:top-4
                                        sm:right-4
                                        w-9
                                        h-9
                                        flex
                                        items-center
                                        justify-center
                                        rounded-full
                                        hover:bg-slate-100
                                        text-lg
                                        sm:text-2xl
                                        text-slate-500
                                        hover:text-black
                                        transition
                                    "
                                >
                                    ✕
                                </button>

                                <h2
                                    className="
                                        text-xl
                                        sm:text-2xl
                                        lg:text-3xl
                                        font-bold
                                        mb-6
                                        sm:mb-8
                                        text-[#1E3A5F]
                                        pr-10
                                    "
                                >
                                    Track Order
                                </h2>

                                <div
                                    className="
                                        space-y-4
                                        sm:space-y-6
                                    "
                                >
                                    {statusSteps.map(
                                        (
                                            step,
                                            index
                                        ) => {
                                            const currentIndex =
                                                statusSteps.findIndex(
                                                    (
                                                        s
                                                    ) =>
                                                        s.key ===
                                                        trackOrderData.status
                                                );

                                            const isCompleted =
                                                index <=
                                                currentIndex;

                                            const Icon =
                                                step.icon;

                                            return (
                                                <div
                                                    key={
                                                        step.key
                                                    }
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-3
                                                        sm:gap-5
                                                    "
                                                >
                                                    <div
                                                        className={`
                                                            flex
                                                            h-11
                                                            w-11
                                                            sm:h-14
                                                            sm:w-14
                                                            flex-shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-full
                                                            ${
                                                                isCompleted
                                                                    ? "bg-black text-white"
                                                                    : "bg-slate-200 text-slate-500"
                                                            }
                                                        `}
                                                    >
                                                        <Icon
                                                            size={
                                                                20
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <h4
                                                            className="
                                                                font-semibold
                                                                text-sm
                                                                sm:text-lg
                                                                text-slate-900
                                                            "
                                                        >
                                                            {
                                                                step.label
                                                            }
                                                        </h4>

                                                        <p
                                                            className="
                                                                text-xs
                                                                sm:text-sm
                                                                text-slate-500
                                                            "
                                                        >
                                                            {isCompleted
                                                                ? "Completed"
                                                                : "Pending"}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                {/* =================================================
                    CANCEL ORDER POPUP
                ================================================== */}

                {showPopup && (
                    <div
                        className="
                            fixed
                            inset-0
                            z-50
                            flex
                            items-center
                            justify-center
                            bg-black/50
                            px-3
                            sm:px-4
                            py-4
                        "
                    >
                        <div
                            className="
                                w-full
                                max-w-md
                                max-h-[90vh]
                                overflow-y-auto
                                rounded-2xl
                                sm:rounded-3xl
                                bg-white
                                p-5
                                sm:p-7
                                lg:p-8
                                shadow-2xl
                                border
                                border-gray-200
                            "
                        >
                            <h2
                                className="
                                    text-xl
                                    sm:text-2xl
                                    font-bold
                                    mb-5
                                    sm:mb-6
                                    text-[#1E3A5F]
                                "
                            >
                                Cancel Order
                            </h2>

                            {/* REASONS */}

                            <div className="space-y-3">
                                {cancelReasons.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <label
                                            key={
                                                index
                                            }
                                            className="
                                                flex
                                                items-start
                                                gap-3
                                                cursor-pointer
                                                text-sm
                                                sm:text-base
                                                text-slate-700
                                            "
                                        >
                                            <input
                                                type="radio"
                                                name="cancelReason"
                                                value={
                                                    item
                                                }
                                                checked={
                                                    reason ===
                                                    item
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setReason(
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className="mt-1 flex-shrink-0"
                                            />

                                            <span>
                                                {
                                                    item
                                                }
                                            </span>
                                        </label>
                                    )
                                )}
                            </div>

                            {/* OTHER REASON */}

                            {reason ===
                                "Other" && (
                                <textarea
                                    value={
                                        otherReason
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setOtherReason(
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Write your reason..."
                                    className="
                                        w-full
                                        mt-4
                                        border
                                        border-gray-300
                                        rounded-xl
                                        p-3
                                        text-sm
                                        sm:text-base
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-black
                                        resize-none
                                        min-h-[100px]
                                    "
                                />
                            )}

                            {/* BUTTONS */}

                            <div
                                className="
                                    flex
                                    flex-col-reverse
                                    sm:flex-row
                                    justify-end
                                    gap-2
                                    sm:gap-3
                                    mt-6
                                    sm:mt-8
                                "
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPopup(
                                            false
                                        );

                                        setReason(
                                            ""
                                        );

                                        setOtherReason(
                                            ""
                                        );
                                    }}
                                    className="
                                        w-full
                                        sm:w-auto
                                        px-5
                                        py-2.5
                                        rounded-xl
                                        border
                                        border-gray-300
                                        hover:border-black
                                        transition
                                        text-sm
                                        sm:text-base
                                    "
                                >
                                    Close
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleCancelConfirm
                                    }
                                    className="
                                        w-full
                                        sm:w-auto
                                        px-5
                                        py-2.5
                                        rounded-xl
                                        bg-red-500
                                        hover:bg-red-600
                                        text-white
                                        transition
                                        text-sm
                                        sm:text-base
                                    "
                                >
                                    Confirm Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;