import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { toast } from 'react-toastify';
import RippleButton from '../components/RippleButton';

const Cart = () => {
    const { products, currency, cartItems, updateQuantity, navigate, token } = useContext(ShopContext);

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
                            quantity
                        });
                    }
                }
            }
        }
        setCartData(tempData);
    }, [cartItems]);

    return (
        <div className='border-t pt-14'>
            <div className='text-2xl mb-3'>
                <Title text1={"YOUR"} text2={'CART'} />
            </div>

            {/* ✅ Agar cart empty hai */}
            {cartData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-lg text-gray-600 mb-4">
                        Your cart is empty. Add some products to continue shopping.
                    </p>
                    <RippleButton
                        onClick={() => navigate("/collection")}
                    >
                        ADD PRODUCTS
                    </RippleButton>
                </div>
            ) : (
                <>
                    {/* ✅ Cart items list */}
                    <div>
                        {cartData.map((item, index) => {
                            const productData = products.find((product) => product._id === item._id);

                            if (!productData) return null;

                            return (
                                <div
                                    key={index}
                                    className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
                                >
                                    <div className='flex items-start gap-6'>
                                        <img className='w-16 sm:w-20' src={productData.image[0]} alt="product" />
                                        <div>
                                            <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                                            <div className='flex items-center gap-5 mt-2'>
                                                <p>{currency}{productData.price}</p>
                                                <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                                                <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.color}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <input
                                        onChange={(e) =>
                                            e.target.value === "" || e.target.value === '0'
                                                ? null
                                                : updateQuantity(item._id, item.size, item.color, Number(e.target.value))
                                        }
                                        type="number"
                                        className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1'
                                        min={1}
                                        defaultValue={item.quantity}
                                    /> */}
                                    {/* 🔹 Quantity with + and - buttons */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                item.quantity > 1 &&
                                                updateQuantity(item._id, item.size, item.color, item.quantity - 1)
                                            }
                                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                        >
                                            -
                                        </button>
                                        <span className="px-3">{item.quantity}</span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(item._id, item.size, item.color, item.quantity + 1)
                                            }
                                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <img
                                        onClick={() => updateQuantity(item._id, item.size, item.color, 0)}
                                        src={assets.bin_icon}
                                        className='w-4 mr-3 sm:w-5 cursor-pointer'
                                        alt="bin"
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* ✅ Cart total + checkout */}
                    <div className='flex justify-end my-20'>
                        <div className="w-full sm:w-[450px]">
                            <CartTotal />
                            <div className='w-full text-end mt-3'>
                                <RippleButton
                                    onClick={() => {
                                        if (cartData.length === 0) {
                                            toast.error("Product is not available in cart");
                                        } else if (!token) {
                                            toast.info("Please login first");
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
    )
}

export default Cart