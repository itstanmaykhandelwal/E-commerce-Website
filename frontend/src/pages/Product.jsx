import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import DeliveryInfo from '../components/DeliveryInfo';

const Product = () => {

    const { productId } = useParams();
    const { products, currency, addToCart } = useContext(ShopContext);
    const [productData, setProductData] = useState(false);
    const [image, setImage] = useState('');
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');

    const fetchProductData = async () => {
        products.map((item) => {
            if (item._id === productId) {
                setProductData(item);
                setImage(item.image[0]);
                return null;
            }
        })
    }

    useEffect(() => {
        fetchProductData();
    }, [productId, products])

    return productData ? (
        <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
            {/* Product Data */}
            <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
                {/* Product Image */}
                <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
                    <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-auto justify-between sm:justify-normal sm:w-[18.7%] w-full'>
                        {
                            productData.image.map((item, index) => (
                                <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="product" />
                            ))
                        }
                    </div>
                    <div className='w-full sm:w-[80%]'>
                        <img className='w-full h-auto' src={image} alt="product" />
                    </div>
                </div>
                {/* Product Info */}
                <div className="flex-1">
                    <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
                    <div className='flex items-center gap-1 mt-2'>
                        <img src={assets.star_icon} alt="" className="w-3 5" />
                        <img src={assets.star_icon} alt="" className="w-3 5" />
                        <img src={assets.star_icon} alt="" className="w-3 5" />
                        <img src={assets.star_icon} alt="" className="w-3 5" />
                        <img src={assets.star_icon} alt="" className="w-3 5" />
                        <p className='pl-2'>(123)</p>
                    </div>
                    <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
                    <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
                    <div className='flex flex-col gap-4 my-8'>
                        <p>Select Size</p>
                        <div className='flex gap-2'>
                            {productData.sizes.map((item, index) => (
                                <button onClick={() => setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`} key={index}>{item}</button>
                            ))}
                        </div>
                    </div>
                    <div className='flex flex-col gap-4 my-8'>
                        <p>Select Color</p>
                        <div className='flex gap-2'>
                            {productData.color.map((item, index) => (
                                <button onClick={() => setColor(item)} className={`border py-2 px-4 bg-gray-100 ${item === color ? 'border-orange-500' : ''}`} key={index}>{item}</button>
                            ))}
                        </div>
                    </div>
                    <button onClick={() => {
                        console.log("Add to Cart Clicked:", {
                            itemId: productData._id,
                            size,
                            color
                        });
                        addToCart(productData._id, size, color);
                    }} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
                    <DeliveryInfo />

                    <hr className='mt-8 sm:w-4/5' />
                    <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
                        <p>100% Original product.</p>
                        <p>Cash on delivery is available on this product.</p>
                        <p>Easy return and exchange policy within 7 days.</p>
                    </div>
                </div>
            </div>
            {/* ---------- Description & Review Section ------------- */}
            <div className='mt-20'>
                <div className='flex'>
                    <b className='border px-5 py-3 text-sm'>Description</b>
                    <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
                </div>
                <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
                    <div className="product-description">
                        <h2>✨ Divine Elegance for Your Laddu Gopal – Handcrafted Green & Gold Jutti</h2>
                        <p>
                            Add a touch of tradition and grace to your <b>Laddu Gopal’s attire</b> with this
                            <b>exquisite handcrafted jutti</b>. Designed in vibrant <b>green and golden hues</b>,
                            this footwear is beautifully adorned with sparkling stones, giving your deity a
                            royal and festive look.
                        </p>

                        <p>
                            Perfectly crafted for <b>Laddu Gopal ji idols</b>, this jutti enhances their
                            appearance during <b>festivals, poojas, Janmashtami celebrations, or daily adornment</b>.
                            The intricate detailing and premium fabric make it not just an accessory but a
                            <b>symbol of love and devotion</b>.
                        </p>

                        <h3>🌟 Key Features:</h3>
                        <ul>
                            <li><b>Material:</b> High-quality fabric with fine stone embellishments.</li>
                            <li><b>Design:</b> Traditional yet stylish, highlighted with golden embroidery and rhinestones.</li>
                            <li><b>Size:</b> Available in multiple sizes to fit your Laddu Gopal idol perfectly.</li>
                            <li><b>Occasion:</b> Suitable for daily puja, Janmashtami, Diwali, Holi, and other religious functions.</li>
                            <li><b>Care Instructions:</b> Gently wipe with a soft, dry cloth to maintain shine and beauty.</li>
                        </ul>

                        <h3>🙏 Why Choose This Jutti?</h3>
                        <ul>
                            <li>Elevates the divine charm of your <b>Thakur ji / Laddu Gopal</b>.</li>
                            <li>A <b>thoughtful gift</b> for devotees and spiritual occasions.</li>
                            <li>Complements any <b>Laddu Gopal poshak or accessories</b> beautifully.</li>
                        </ul>

                        <p>
                            ✨ Bring home this symbol of devotion and elegance, and let your
                            <b>Laddu Gopal ji radiate divine beauty</b> every day!<br /><br />
                            <b>Order Now</b> and complete your deity’s royal look with this elegant jutti.
                        </p>
                    </div>

                </div>
            </div>
            {/* Display Related Products */}
            <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
        </div>
    ) : <div className='opacity-0'></div>
}

export default Product