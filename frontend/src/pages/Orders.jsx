import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
    const { backendUrl, token, currency } = useContext(ShopContext);

    const [orderData, setOrderData] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [reason, setReason] = useState("");
    const [otherReason, setOtherReason] = useState("");

    // ✅ Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const cancelReasons = [
        "Ordered by mistake",
        "Found cheaper elsewhere",
        "Delivery time is too long",
        "Don't need the product anymore",
        "Other",
    ];
    // ✅ NEW: Track Order modal state
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [trackOrderData, setTrackOrderData] = useState(null);

    // ✅ Example status steps
    const statusSteps = [
        { key: "Placed", label: "Order Placed", img: "https://cdn-icons-png.flaticon.com/512/869/869636.png" },
        { key: "Packing", label: "Packing", img: "https://cdn-icons-png.flaticon.com/512/679/679922.png" },
        { key: "Shipped", label: "Shipped", img: "https://cdn-icons-png.flaticon.com/512/2928/2928931.png" },
        { key: "OutForDelivery", label: "Out for Delivery", img: "https://cdn-icons-png.flaticon.com/512/1048/1048314.png" },
        { key: "Delivered", label: "Delivered", img: "https://cdn-icons-png.flaticon.com/512/190/190411.png" },
    ];
    const loadOrderData = async () => {
        try {
            if (!token) return null;

            const response = await axios.post(
                backendUrl + "/api/order/userorders",
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                let allOrdersItem = [];
                response.data.orders.map((order) => {
                    order.items.map((item) => {
                        item["status"] = order.status;
                        item["payment"] = order.payment;
                        item["paymentMethod"] = order.paymentMethod;
                        item["date"] = order.date;
                        item["orderId"] = order._id;
                        allOrdersItem.push(item);
                    });
                });
                setOrderData(allOrdersItem.reverse());
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancelConfirm = async () => {
        const finalReason = reason === "Other" ? otherReason : reason;

        if (!finalReason) {
            toast.error("Please select a reason");
            return;
        }

        try {
            const { data } = await axios.post(
                backendUrl + "/api/order/cancel",
                { orderId: selectedOrderId, reason: finalReason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                toast.success(data.message);
                setShowPopup(false);
                setReason("");
                setOtherReason("");
                loadOrderData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        loadOrderData();
    }, [token]);

    // ✅ Function to open Track modal
    const handleTrackOrder = (item) => {
        setTrackOrderData(item);
        setShowTrackModal(true);
    };

    // ✅ Split orders into active + cancelled
    const activeOrders = orderData.filter((item) => item.status !== "Cancelled");
    const cancelledOrders = orderData.filter((item) => item.status === "Cancelled");

    // ✅ Pagination for active orders
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = activeOrders.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(activeOrders.length / itemsPerPage);

    return (
        <div className="border-t pt-16">
            <div className="text-2xl">
                <Title text1={"MY"} text2={"ORDERS"} />
            </div>

            {/* ✅ Active Orders */}
            <div>
                {currentItems.map((item, index) => (
                    <div
                        key={index}
                        className="py-4 border-t text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                        <div className="flex items-start gap-6 text-sm">
                            <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
                            <div>
                                <p className="sm:text-base font-medium">{item.name}</p>
                                <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                                    <p>
                                        {currency}
                                        {item.price}
                                    </p>
                                    <p>Quantity : {item.quantity}</p>
                                    <p>Size: {item.size}</p>
                                    <p>Color: {item.color}</p>
                                </div>
                                <p className="mt-2">
                                    Date:{" "}
                                    <span className="text-gray-400">
                                        {new Date(item.date).toDateString()}
                                    </span>
                                </p>
                                <p className="mt-2">
                                    Payment:{" "}
                                    <span className="text-gray-400">{item.paymentMethod}</span>
                                </p>
                            </div>
                        </div>
                        <div className="md:w-1/2 flex justify-between">
                            <div className="flex items-center gap-2">
                                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                                <p className="text-sm md:text-base">{item.status}</p>
                            </div>
                            <div>
                                <button
                                    // onClick={loadOrderData}
                                    onClick={() => handleTrackOrder(item)}
                                    className="border px-4 py-2 text-sm font-medium rounded-sm"
                                >
                                    Track Order
                                </button>
                                {item.status !== "Delivered" && (
                                    <button
                                        onClick={() => {
                                            setSelectedOrderId(item.orderId);
                                            setShowPopup(true);
                                        }}
                                        className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                                    >
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ✅ Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 border rounded ${currentPage === i + 1
                                ? "bg-blue-500 text-white"
                                : "bg-white"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* ✅ Cancelled Orders Section */}
            {cancelledOrders.length > 0 && (
                <div className="mt-10">
                    <hr className="border-t border-gray-300 w-full mb-4" />
                    <h2 className="text-xl font-semibold mb-4">Cancelled Orders</h2>
                    {cancelledOrders.map((item, index) => (
                        <div
                            key={index}
                            className="py-4 border-t flex flex-col md:flex-row md:items-center md:justify-between gap-4 opacity-50 text-gray-400"
                        >
                            <div className="flex items-start gap-6 text-sm">
                                <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
                                <div>
                                    <p className="sm:text-base font-medium">{item.name}</p>
                                    <div className="flex items-center gap-3 mt-1 text-base">
                                        <p>
                                            {currency}
                                            {item.price}
                                        </p>
                                        <p>Quantity : {item.quantity}</p>
                                        <p>Size: {item.size}</p>
                                        <p>Color: {item.color}</p>
                                    </div>
                                    <p className="mt-2">
                                        Date:{" "}
                                        <span className="text-gray-400">
                                            {new Date(item.date).toDateString()}
                                        </span>
                                    </p>
                                    <p className="mt-2">
                                        Payment:{" "}
                                        <span className="text-gray-400">{item.paymentMethod}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="md:w-1/2 flex justify-between">
                                <div className="flex items-center gap-2">
                                    <p className="min-w-2 h-2 rounded-full bg-gray-400"></p>
                                    <p className="text-sm md:text-base">{item.status}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ✅ Cancel Popup */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-md w-96">
                        <h2 className="text-lg font-semibold mb-4">Cancel Order</h2>
                        <div className="space-y-2">
                            {cancelReasons.map((r, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id={`reason-${i}`}
                                        value={r}
                                        checked={reason === r}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                    <label htmlFor={`reason-${i}`}>{r}</label>
                                </div>
                            ))}
                        </div>

                        {reason === "Other" && (
                            <textarea
                                className="w-full border rounded p-2 mt-2"
                                placeholder="Write your reason..."
                                value={otherReason}
                                onChange={(e) => setOtherReason(e.target.value)}
                            />
                        )}

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setShowPopup(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleCancelConfirm}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Confirm Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Track Order Modal */}
            {showTrackModal && trackOrderData && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] md:w-[600px] relative">
                        <h2 className="text-xl font-bold mb-6">Track Order</h2>

                        {/* Stepper Timeline */}
                        <div className="flex items-center justify-between relative w-full">
                            {statusSteps.map((step, i) => {
                                const activeIndex = statusSteps.findIndex(
                                    (s) => s.key.toLowerCase() === trackOrderData.status?.toLowerCase()
                                );
                                console.log("Current Status:", trackOrderData.status);
                                const isActive = activeIndex >= i;

                                return (
                                    <div key={i} className="flex flex-col items-center w-full relative">
                                        {/* ✅ Green connector line */}
                                        {i < statusSteps.length - 1 && (
                                            <div
                                                className={`absolute top-7 left-1/2 w-full h-1 ${isActive ? "bg-green-500" : "bg-gray-300"
                                                    }`}
                                                style={{ zIndex: 0 }}
                                            ></div>
                                        )}

                                        {/* ✅ Circle above line */}
                                        <div
                                            className={`w-14 h-14 flex items-center justify-center rounded-full border-4 transition-all duration-300 relative`}
                                            style={{ zIndex: 10 }}
                                        >
                                            <div
                                                className={`absolute inset-0 rounded-full ${isActive ? "bg-green-100 border-green-500" : "bg-gray-100 border-gray-300"
                                                    }`}
                                            ></div>
                                            <img
                                                src={step.img}
                                                alt={step.label}
                                                className={`w-7 h-7 relative ${isActive ? "opacity-100" : "opacity-50"}`}
                                                style={{ zIndex: 20 }}
                                            />
                                        </div>

                                        {/* ✅ Label */}
                                        <p
                                            className={`mt-2 text-xs font-medium ${isActive ? "text-green-600" : "text-gray-400"
                                                }`}
                                        >
                                            {step.label}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>


                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setShowTrackModal(false)}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
