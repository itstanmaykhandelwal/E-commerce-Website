import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const ProductItem = ({ id, image, name, price }) => {
    const { currency, wishlist, addToWishlist, removeFromWishlist, token } = useContext(ShopContext);

    const isInWishlist = wishlist.some(item => item._id === id);

    const toggleWishlist = (e) => {
        e.preventDefault(); // Link ke click ko rokne ke liye

        if (!token) {
            toast.error("Please login to use wishlist");
            return;
        }

        if (isInWishlist) removeFromWishlist(id);
        else addToWishlist(id);
    }

    return (
        <Link className='product-card text-gray-700 cursor-pointer relative block' to={`/product/${id}`}>
            {/* Heart Icon */}
            <div
                onClick={toggleWishlist}
                className="absolute top-2 right-4 z-10 cursor-pointer text-xl"
            >
                {isInWishlist ? (
                    <AiFillHeart className="text-red-500" />
                ) : (
                    <AiOutlineHeart />
                )}
            </div>

            {/* Product Image */}
            <div className='overflow-hidden'>
                <img
                    className='hover:scale-110 transition ease-in-out'
                    src={image[0]}
                    alt={name}
                />
            </div>
            <p className='pt-3 pb-1 text-sm'>{name}</p>
            <p className='text-sm font-medium'>{currency}{price}</p>
        </Link>
    )
}

export default ProductItem
