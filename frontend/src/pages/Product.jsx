import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import RelatedProducts from '../components/RelatedProducts';
import DeliveryInfo from '../components/DeliveryInfo';
import { FaStar } from "react-icons/fa";
import { toast } from 'react-toastify';

const Product = () => {
    const { productId } = useParams();

    const {
        products,
        currency,
        addToCart,
        reviews,
        fetchReviews,
        addReview,
        updateReview,
        currentUser,
        removeReview
    } = useContext(ShopContext);

    const [productData, setProductData] = useState(false);
    const [image, setImage] = useState('');
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');

    // Review modal state
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);
    const [reviewText, setReviewText] = useState("");
    const [editingReviewId, setEditingReviewId] = useState(null);

    const fetchProductData = () => {
        products.map((item) => {
            if (item._id === productId) {
                setProductData(item);
                setImage(item.image?.[0] || '');
                return null;
            }
            return null;
        });
    };

    useEffect(() => {
        fetchProductData();
    }, [productId, products]);

    const submitReview = async () => {
        if (!rating) {
            toast.error("Please select a rating!");
            return;
        }
        if (!reviewText.trim()) {
            toast.error("Please write a review!");
            return;
        }

        try {
            if (editingReviewId) {
                await updateReview(editingReviewId, productId, rating, reviewText);
                toast.success("Review updated!");
            } else {
                await addReview(productId, rating, reviewText);
                toast.success("Review added!");
            }
            setShowReviewModal(false);
            setRating(0);
            setReviewText("");
            setEditingReviewId(null);
        } catch (err) {
            console.error(err);
            toast.error("Failed to submit review");
        }
    };

    // average rating
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
        : 0;

    useEffect(() => {
        fetchProductData();
        if (productId) {
            fetchReviews(productId);
        }
    }, [productId, products]);

    return productData ? (
        <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
            {/* Top section */}
            <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
                {/* Images */}
                <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
                    <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-auto justify-between sm:justify-normal sm:w-[18.7%] w-full'>
                        {productData.image?.map((item, index) => (
                            <img
                                onClick={() => setImage(item)}
                                src={item}
                                key={index}
                                className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer'
                                alt="product"
                            />
                        ))}
                    </div>
                    <div className='w-full sm:w-[80%]'>
                        {image && <img className='w-full h-auto' src={image} alt="product" />}
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                    <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>

                    <div className='flex items-center gap-1 mt-2'>
                        {[...Array(5)].map((_, index) => (
                            <FaStar
                                key={index}
                                size={16}
                                color={index < Math.round(avgRating) ? "#ffc107" : "#e4e5e9"}
                            />
                        ))}
                        <p className='pl-2'>({totalReviews})</p>
                    </div>

                    <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
                    <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>

                    <div className='flex flex-col gap-4 my-8'>
                        <p>Select Size</p>
                        <div className='flex gap-2'>
                            {productData.sizes?.map((item, index) => (
                                <button
                                    onClick={() => setSize(item)}
                                    className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`}
                                    key={index}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className='flex flex-col gap-4 my-8'>
                        <p>Select Color</p>
                        <div className='flex gap-2'>
                            {productData.color?.map((item, index) => (
                                <button
                                    onClick={() => setColor(item)}
                                    className={`border py-2 px-4 bg-gray-100 ${item === color ? 'border-orange-500' : ''}`}
                                    key={index}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => addToCart(productData._id, size, color)}
                        className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'
                    >
                        ADD TO CART
                    </button>

                    <DeliveryInfo />

                    <hr className='mt-8 sm:w-4/5' />
                    <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
                        <p>100% Original product.</p>
                        <p>Cash on delivery is available on this product.</p>
                        <p>Easy return and exchange policy within 7 days.</p>
                    </div>

                    <button
                        onClick={() => setShowReviewModal(true)}
                        className="mt-5 bg-orange-500 text-white px-6 py-2 rounded"
                    >
                        Write a Review
                    </button>
                </div>
            </div>

            {/* Description */}
            <div className='mt-20'>
                <div className='flex'>
                    <b className='border px-5 py-3 text-sm'>Description</b>
                </div>
                <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
                    <p>{productData.description}</p>
                </div>
            </div>

            {/* Reviews */}
            <div className="mt-10">
                <h2 className="text-lg font-semibold mb-4">Reviews</h2>

                {reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews yet. Be the first to write one!</p>
                ) : (
                    reviews.map((review, i) => (
                        <div key={review._id || i} className="flex gap-4 border-b pb-4 mb-4">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                alt="user"
                                className="w-12 h-12 rounded-full"
                            />
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold">{review.userId?.name || "Anonymous"}</p>
                                    <div>
                                        {/* 🔐 EDIT: only show for *your* review */}
                                        {currentUser &&
                                            (String(review.userId?._id) === String(currentUser._id)) && (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setShowReviewModal(true);
                                                            setRating(review.rating);
                                                            setReviewText(review.comment);
                                                            setEditingReviewId(review._id);
                                                        }}
                                                        className="text-sm text-blue-500"
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        onClick={() => removeReview(review._id, productId)}
                                                        className="text-sm text-red-500"
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </>

                                            )}
                                    </div>
                                </div>

                                <div className="flex gap-1 text-yellow-400 my-1">
                                    {[...Array(5)].map((_, index) => (
                                        <FaStar
                                            key={index}
                                            size={16}
                                            color={index < review.rating ? "#ffc107" : "#e4e5e9"}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-600">{review.comment}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <RelatedProducts
                category={productData.category}
                subCategory={productData.subCategory}
            />

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingReviewId ? 'Edit your Review' : 'Write a Review'}
                        </h2>

                        <div className="flex gap-2 mb-4">
                            {[...Array(5)].map((star, index) => {
                                const starValue = index + 1;
                                return (
                                    <FaStar
                                        key={index}
                                        size={30}
                                        className="cursor-pointer"
                                        color={starValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                        onClick={() => setRating(starValue)}
                                        onMouseEnter={() => setHover(starValue)}
                                        onMouseLeave={() => setHover(null)}
                                    />
                                );
                            })}
                        </div>

                        <textarea
                            placeholder="Write your review"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="w-full border p-2 rounded mb-4"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowReviewModal(false);
                                    setEditingReviewId(null);
                                    setRating(0);
                                    setReviewText('');
                                }}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitReview}
                                className="px-4 py-2 bg-orange-500 text-white rounded"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    ) : <div className='opacity-0'></div>;
};

export default Product;
