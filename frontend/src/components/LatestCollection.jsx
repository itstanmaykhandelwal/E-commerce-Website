import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {

    const { products } = useContext(ShopContext);
    const [latestProducts, setProducts] = useState([])

    useEffect(() => {
        setProducts(products.slice(0, 10));
    }, [products])

    return (
        <div className='my-10'>
            <div className="text-center py-8 text-3xl">
                <Title text1={'LATEST'} text2={'COLLECTIONS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base'>
                    Shop the latest collection of Krishna Ji Poshaks, Laddu Gopal dresses, and devotional attire – perfect for festivals and daily worship.
                </p>
            </div>
            {/* Rendering Products */}
            {latestProducts.length > 0 ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                    {latestProducts.map((item, index) => (
                        <ProductItem
                            key={index}
                            id={item._id}
                            image={item.image}
                            name={item.name}
                            price={item.price}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16">
                    {/* Graphic / Illustration */}
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                        alt="No products"
                        className="w-32 h-32 mb-4 opacity-80"
                    />
                    <h2 className="text-lg font-semibold text-gray-700">
                        No products available
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Please check back later for our latest collections.
                    </p>
                </div>
            )}
        </div>
    )
}

export default LatestCollection