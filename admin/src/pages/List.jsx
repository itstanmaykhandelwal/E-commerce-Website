import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
    const [list, setList] = useState([]);

    const fetchList = async () => {
        try {
            const response = await axios.get(backendUrl + "/api/product/list");

            if (response.data.success) {
                setList(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // =========================
    // DELETE PRODUCT
    // =========================

    const removeProduct = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?",
        );

        if (!confirmDelete) return;

        try {
            console.log("Deleting product:", id);
            console.log("Admin token exists:", !!token);

            const response = await axios.post(
                backendUrl + "/api/product/remove",
                { id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            console.log("Delete response:", response.data);

            if (response.data.success) {
                toast.success(response.data.message);
                await fetchList();
            } else {
                toast.error(
                    response.data.message || "Unable to delete product",
                );
            }
        } catch (error) {
            console.error("Delete Product Error:", error);

            console.error("Backend error:", error.response?.data);

            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    "Unable to delete product",
            );
        }
    };

    // =========================
    // EDIT PRODUCT
    // =========================

    const editProduct = (id) => {
        window.location.href = `/add?edit=${id}`;
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <>
            <p className="mb-2">All Products List</p>

            <div className="flex flex-col gap-2">
                {/* TABLE HEADER */}

                <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1.5fr] items-center py-2 px-2 border bg-gray-100 text-sm">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b>Stock</b>
                    <b className="text-center">Action</b>
                </div>

                {/* PRODUCT LIST */}

                {list.map((item) => (
                    <div
                        className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1.5fr] items-center gap-2 py-2 px-2 border text-sm"
                        key={item._id}
                    >
                        <img
                            className="w-12 h-12 object-cover"
                            src={item.image?.[0]}
                            alt={item.name}
                        />

                        <p>{item.name}</p>

                        <p>{item.category}</p>

                        <p>
                            {currency}
                            {item.price}
                        </p>

                        <p>{item.quantity}</p>

                        {/* ACTIONS */}

                        <div className="flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => editProduct(item._id)}
                                className="px-3 py-1 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition"
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                onClick={() => removeProduct(item._id)}
                                className="px-3 py-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default List;
