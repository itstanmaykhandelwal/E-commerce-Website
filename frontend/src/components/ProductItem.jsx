import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';

const ProductItem = ({ id, image, name, price }) => {
    const { currency, wishlist, addToWishlist, removeFromWishlist,token } = useContext(ShopContext);

    // const isInWishlist = wishlist.includes(id);
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
        <Link className='text-gray-700 cursor-pointer relative block' to={`/product/${id}`}>
            {/* Heart Icon */}
            <div
                onClick={toggleWishlist}
                className="absolute top-2 right-2 z-10 cursor-pointer"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={isInWishlist ? "red" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6 stroke-2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                    />
                </svg>
            </div>


            {/* Product Image */}
            <div className='overflow-hidden'>
                <img className='hover:scale-110 transition ease-in-out' src={image[0]} alt={name} />
            </div>
            <p className='pt-3 pb-1 text-sm'>{name}</p>
            <p className='text-sm font-medium'>{currency}{price}</p>
        </Link>
    )
}

export default ProductItem
