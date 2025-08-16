import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from '../components/ProductItem';
import Title from '../components/Title';

const Wishlist = () => {
    const { wishlist, products } = useContext(ShopContext);
    const [wishlistProducts, setWishlistProducts] = useState([]);

    useEffect(() => {
    const data = products.filter(p =>
        wishlist.some(w => w._id === p._id)
    );
    setWishlistProducts(data);
}, [wishlist, products]);


    return (
        <div className="pt-10">
            <Title text1="YOUR" text2="WISHLIST" />
            {wishlistProducts.length === 0 ? (
                <p className="mt-5 text-gray-500">Your wishlist is empty.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 mt-5">
                    {wishlistProducts.map(item => (
                        <ProductItem
                            key={item._id}
                            id={item._id}
                            name={item.name}
                            price={item.price}
                            image={item.image}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
