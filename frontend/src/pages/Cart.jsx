import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { toast } from "react-toastify";
import RippleButton from "../components/RippleButton";

const Cart = () => {
    const { products, currency, cartItems, updateQuantity, navigate, token } =
        useContext(ShopContext);

    const [cartData, setCartData] = useState([]);

    useEffect(() => {
        const tempData = [];
        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                for (const color in cartItems[itemId][size]) {
                    const quantity = cartItems[itemId][size][color];
                    if (quantity > 0) {
                        tempData.push({
                            _id: itemId,
                            size,
                            color,
                            quantity,
                        });
                    }
                }
            }
        }
        setCartData(tempData);
    }, [cartItems]);

    return (
        <div className="min-h-screen  pt-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-3xl mb-10 text-center">
                    <Title text1={"YOUR"} text2={"CART"} />
                </div>

                {/* EMPTY CART */}
                {cartData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-emerald-100 shadow-lg">
                        <p className="text-lg text-slate-600 mb-6">
                            Your cart is empty. Add some products to continue
                            shopping.
                        </p>
                        <RippleButton
                            onClick={() => navigate("/collection")}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-2xl font-semibold hover:scale-105 transition"
                        >
                            ADD PRODUCTS
                        </RippleButton>
                    </div>
                ) : (
                    <>
                        {/* CART ITEMS */}
                        <div className="space-y-6">
                            {cartData.map((item, index) => {
                                const productData = products.find(
                                    (product) => product._id === item._id,
                                );
                                if (!productData) return null;

                                return (
                                    <div
                                        key={index}
                                        className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition"
                                    >
                                        {/* LEFT */}
                                        <div className="flex items-center gap-6 w-full sm:w-auto">
                                            <img
                                                className="w-20 h-20 object-cover rounded-xl"
                                                src={productData.image[0]}
                                                alt="product"
                                            />

                                            <div>
                                                <p className="text-lg font-semibold text-slate-900">
                                                    {productData.name}
                                                </p>

                                                <div className="flex gap-4 mt-2 mb-2 text-slate-600 text-sm">
                                                    <span>
                                                        {currency}
                                                        {productData.price}
                                                    </span>
                                                    <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg">
                                                        {item.size}
                                                    </span>
                                                    <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg">
                                                        {item.color}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* RIGHT */}
                                        <div className="flex items-center gap-6">
                                            {/* Quantity */}
                                            <div className="flex items-center bg-emerald-50 border border-emerald-200 rounded-xl overflow-hidden">
                                                <button
                                                    onClick={() =>
                                                        item.quantity > 1 &&
                                                        updateQuantity(
                                                            item._id,
                                                            item.size,
                                                            item.color,
                                                            item.quantity - 1,
                                                        )
                                                    }
                                                    className="px-4 py-2 hover:bg-emerald-100 transition font-semibold"
                                                >
                                                    −
                                                </button>

                                                <span className="px-5 font-semibold">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item._id,
                                                            item.size,
                                                            item.color,
                                                            item.quantity + 1,
                                                        )
                                                    }
                                                    className="px-4 py-2 hover:bg-emerald-100 transition font-semibold"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Remove */}
                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item._id,
                                                        item.size,
                                                        item.color,
                                                        0,
                                                    )
                                                }
                                                className="text-red-500 hover:text-red-600 font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* TOTAL + CHECKOUT */}
                        <div className="flex justify-end mt-16">
                            <div className="w-full sm:w-[450px] bg-white p-8 rounded-3xl border border-emerald-100 shadow-xl">
                                <CartTotal />

                                <RippleButton
                                    onClick={() => {
                                        if (cartData.length === 0) {
                                            toast.error(
                                                "Product is not available in cart",
                                            );
                                        } else if (!token) {
                                            toast.info("Please login first");
                                            navigate("/login");
                                        } else {
                                            navigate("/place-order");
                                        }
                                    }}
                                    className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-2xl font-semibold hover:scale-105 transition"
                                >
                                    PROCEED TO CHECKOUT
                                </RippleButton>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;
